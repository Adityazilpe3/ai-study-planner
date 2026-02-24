import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

export default function PlanCard({ plan, onDelete, onUpdate }) {
  const navigate = useNavigate();

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (!window.confirm('Delete this plan?')) return;
    try {
      await API.delete(`/plans/${plan._id}`);
      onDelete(plan._id);
    } catch (err) {
      alert('Failed to delete plan');
    }
  };

  const handleProgressChange = async (e) => {
    e.stopPropagation();
    const progress = parseInt(e.target.value);
    try {
      const { data } = await API.patch(`/plans/${plan._id}`, {
        progress,
        isCompleted: progress === 100,
      });
      onUpdate(data);
    } catch (err) {
      console.error(err);
    }
  };

  const daysLeft = () => {
    const today = new Date();
    const exam = new Date(plan.examDate);
    const diff = Math.ceil((exam - today) / (1000 * 60 * 60 * 24));
    if (diff < 0) return <span className="badge badge-red">Exam passed</span>;
    if (diff === 0) return <span className="badge badge-red">Exam today!</span>;
    if (diff <= 3) return <span className="badge badge-orange">{diff} days left</span>;
    return <span className="badge badge-green">{diff} days left</span>;
  };

  return (
    <div
      className={`plan-card ${plan.isCompleted ? 'plan-completed' : ''}`}
      onClick={() => navigate(`/plans/${plan._id}`)}
    >
      <div className="plan-card-header">
        <div>
          <h4 className="plan-title">{plan.subjects}</h4>
          <div className="plan-meta-row">
            <span>📅 {plan.examDate}</span>
            <span>⏰ {plan.hoursPerDay}h/day</span>
            {daysLeft()}
          </div>
        </div>
        <button className="btn-delete" onClick={handleDelete} title="Delete plan">
          🗑️
        </button>
      </div>

      <div className="progress-section" onClick={(e) => e.stopPropagation()}>
        <div className="progress-label">
          <span>Progress</span>
          <span>{plan.progress}%</span>
        </div>
        <div className="progress-bar-bg">
          <div
            className="progress-bar-fill"
            style={{ width: `${plan.progress}%` }}
          />
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={plan.progress}
          onChange={handleProgressChange}
          className="progress-slider"
        />
      </div>

      <div className="plan-card-footer">
        <span className="plan-date">
          Created {new Date(plan.createdAt).toLocaleDateString()}
        </span>
        {plan.isCompleted && <span className="badge badge-green">✅ Completed</span>}
      </div>
    </div>
  );
}
