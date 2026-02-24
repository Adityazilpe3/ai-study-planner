import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import API from '../api/axios';

export default function PlanDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [plan, setPlan] = useState(null);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const { data } = await API.get(`/plans/${id}`);
        setPlan(data);
        setNotes(data.notes || '');
      } catch (err) {
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchPlan();
  }, [id]);

  const handleProgressChange = async (e) => {
    const progress = parseInt(e.target.value);
    try {
      const { data } = await API.patch(`/plans/${id}`, {
        progress,
        isCompleted: progress === 100,
      });
      setPlan(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveNotes = async () => {
    setSaving(true);
    try {
      const { data } = await API.patch(`/plans/${id}`, { notes });
      setPlan(data);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error(err);
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this plan permanently?')) return;
    try {
      await API.delete(`/plans/${id}`);
      navigate('/dashboard');
    } catch (err) {
      alert('Failed to delete plan');
    }
  };

  if (loading) return (
    <div className="app-layout">
      <Navbar />
      <div className="loading-state"><div className="spinner" /><p>Loading plan...</p></div>
    </div>
  );

  const daysLeft = () => {
    const diff = Math.ceil((new Date(plan.examDate) - new Date()) / (1000 * 60 * 60 * 24));
    if (diff < 0) return { text: 'Exam passed', cls: 'badge-red' };
    if (diff === 0) return { text: 'Exam today!', cls: 'badge-red' };
    if (diff <= 3) return { text: `${diff} days left`, cls: 'badge-orange' };
    return { text: `${diff} days left`, cls: 'badge-green' };
  };

  const dl = daysLeft();

  return (
    <div className="app-layout">
      <Navbar />
      <main className="plan-detail-main">

        {/* Back */}
        <button className="back-btn" onClick={() => navigate('/dashboard')}>
          ← Back to Dashboard
        </button>

        {/* Plan Header */}
        <div className="detail-header">
          <div>
            <h1>{plan.subjects}</h1>
            <div className="plan-meta-row">
              <span>📅 Exam: {plan.examDate}</span>
              <span>⏰ {plan.hoursPerDay}h/day</span>
              <span className={`badge ${dl.cls}`}>{dl.text}</span>
              {plan.isCompleted && <span className="badge badge-green">✅ Completed</span>}
            </div>
          </div>
          <button className="btn-danger" onClick={handleDelete}>🗑️ Delete Plan</button>
        </div>

        <div className="detail-grid">
          {/* Generated Plan */}
          <div className="detail-card plan-text-card">
            <h3>📋 Your Study Plan</h3>
            <div className="plan-text">
              {plan.generatedPlan.split('\n').map((line, i) => (
                <p key={i}>{line || <br />}</p>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="detail-sidebar">
            {/* Progress */}
            <div className="detail-card">
              <h3>📊 Progress Tracker</h3>
              <div className="big-progress">
                <div className="big-progress-value">{plan.progress}%</div>
                <div className="progress-bar-bg">
                  <div className="progress-bar-fill" style={{ width: `${plan.progress}%` }} />
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={plan.progress}
                  onChange={handleProgressChange}
                  className="progress-slider"
                />
                <div className="progress-hint">Drag to update your progress</div>
              </div>
            </div>

            {/* Notes */}
            <div className="detail-card">
              <h3>📝 My Notes</h3>
              <textarea
                className="notes-textarea"
                placeholder="Add your notes, reminders, or updates here..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={6}
              />
              <button
                className="btn-primary btn-full"
                onClick={handleSaveNotes}
                disabled={saving}
              >
                {saving ? 'Saving...' : saved ? '✅ Saved!' : 'Save Notes'}
              </button>
            </div>

            {/* Info */}
            <div className="detail-card info-card">
              <h3>ℹ️ Plan Info</h3>
              <div className="info-row"><span>Created</span><span>{new Date(plan.createdAt).toLocaleDateString()}</span></div>
              <div className="info-row"><span>Status</span><span>{plan.isCompleted ? 'Completed' : 'In Progress'}</span></div>
              <div className="info-row"><span>Hours/Day</span><span>{plan.hoursPerDay}h</span></div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
