import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import PlanCard from '../components/PlanCard';
import API from '../api/axios';

export default function Dashboard() {
  const [plans, setPlans] = useState([]);
  const [stats, setStats] = useState({ total: 0, completed: 0 });
  const [form, setForm] = useState({ subjects: '', examDate: '', hoursPerDay: '' });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const fetchPlans = async (searchVal = search, filterVal = filter) => {
    try {
      const params = {};
      if (searchVal) params.search = searchVal;
      if (filterVal === 'completed') params.completed = 'true';
      if (filterVal === 'active') params.completed = 'false';

      const { data } = await API.get('/plans', { params });
      setPlans(data.plans);
      setStats({ total: data.total, completed: data.completed });
    } catch (err) {
      console.error(err);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    fetchPlans(e.target.value, filter);
  };

  const handleFilter = (val) => {
    setFilter(val);
    fetchPlans(search, val);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleGenerate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const { data } = await API.post('/plans/generate-plan', form);
      setPlans((prev) => [data, ...prev]);
      setStats((prev) => ({ ...prev, total: prev.total + 1 }));
      setForm({ subjects: '', examDate: '', hoursPerDay: '' });
      setShowForm(false);
      setSuccess('✅ Study plan generated successfully!');
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate plan');
    }
    setLoading(false);
  };

  const handleDelete = (id) => {
    setPlans((prev) => prev.filter((p) => p._id !== id));
    setStats((prev) => ({ ...prev, total: prev.total - 1 }));
  };

  const handleUpdate = (updated) => {
    setPlans((prev) => prev.map((p) => (p._id === updated._id ? updated : p)));
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="app-layout">
      <Navbar />
      <main className="dashboard-main">

        {/* Stats Row */}
        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-icon">📋</div>
            <div>
              <div className="stat-value">{stats.total}</div>
              <div className="stat-label">Total Plans</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div>
              <div className="stat-value">{stats.completed}</div>
              <div className="stat-label">Completed</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🔄</div>
            <div>
              <div className="stat-value">{stats.total - stats.completed}</div>
              <div className="stat-label">In Progress</div>
            </div>
          </div>
          <div className="stat-card cta-stat" onClick={() => setShowForm(true)}>
            <div className="stat-icon">➕</div>
            <div>
              <div className="stat-value">New</div>
              <div className="stat-label">Generate Plan</div>
            </div>
          </div>
        </div>

        {/* Alerts */}
        {success && <div className="alert alert-success">{success}</div>}
        {error && <div className="alert alert-error">{error}</div>}

        {/* Generate Form Modal */}
        {showForm && (
          <div className="modal-overlay" onClick={() => setShowForm(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>✨ Generate Study Plan</h3>
                <button className="modal-close" onClick={() => setShowForm(false)}>✕</button>
              </div>
              <form onSubmit={handleGenerate} className="plan-form">
                <div className="form-group">
                  <label>Subjects</label>
                  <input
                    name="subjects"
                    placeholder="e.g. Mathematics, Physics, Chemistry"
                    value={form.subjects}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Exam Date</label>
                    <input
                      name="examDate"
                      type="date"
                      min={today}
                      value={form.examDate}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Hours Per Day</label>
                    <input
                      name="hoursPerDay"
                      type="number"
                      placeholder="e.g. 4"
                      min="1"
                      max="16"
                      value={form.hoursPerDay}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="form-actions">
                  <button type="button" className="btn-outline" onClick={() => setShowForm(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary" disabled={loading}>
                    {loading ? '🤖 Generating...' : '✨ Generate Plan'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Plans Section */}
        <div className="plans-section-header">
          <h2>Your Study Plans</h2>
          <button className="btn-primary" onClick={() => setShowForm(true)}>
            + New Plan
          </button>
        </div>

        {/* Search & Filter */}
        <div className="search-filter-row">
          <input
            className="search-input"
            type="text"
            placeholder="🔍 Search by subject..."
            value={search}
            onChange={handleSearch}
          />
          <div className="filter-tabs">
            {['all', 'active', 'completed'].map((f) => (
              <button
                key={f}
                className={`filter-tab ${filter === f ? 'active' : ''}`}
                onClick={() => handleFilter(f)}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Plans Grid */}
        {fetching ? (
          <div className="loading-state">
            <div className="spinner" />
            <p>Loading your plans...</p>
          </div>
        ) : plans.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <h3>No plans found</h3>
            <p>
              {search || filter !== 'all'
                ? 'Try adjusting your search or filter.'
                : 'Generate your first AI study plan to get started!'}
            </p>
            {!search && filter === 'all' && (
              <button className="btn-primary" onClick={() => setShowForm(true)}>
                + Generate Your First Plan
              </button>
            )}
          </div>
        ) : (
          <div className="plans-grid">
            {plans.map((plan) => (
              <PlanCard
                key={plan._id}
                plan={plan}
                onDelete={handleDelete}
                onUpdate={handleUpdate}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
