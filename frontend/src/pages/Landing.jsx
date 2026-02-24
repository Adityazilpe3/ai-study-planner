import { Link } from 'react-router-dom';

const features = [
  { icon: '🤖', title: 'AI-Powered Plans', desc: 'Gemini AI creates personalized study schedules based on your subjects and exam date.' },
  { icon: '📊', title: 'Track Progress', desc: 'Monitor your study progress with visual progress bars for each plan.' },
  { icon: '🗓️', title: 'Exam Countdown', desc: 'Always know how many days are left until your exam with smart countdowns.' },
  { icon: '📝', title: 'Personal Notes', desc: 'Add notes and updates to your plans as you study and learn.' },
  { icon: '🔍', title: 'Search & Filter', desc: 'Quickly find any plan by subject name or filter by completion status.' },
  { icon: '🔒', title: 'Secure & Private', desc: 'JWT authentication ensures your study plans are always private and secure.' },
];

const steps = [
  { step: '01', title: 'Create an Account', desc: 'Sign up in seconds with your name, email, and password.' },
  { step: '02', title: 'Enter Your Details', desc: 'Add your subjects, exam date, and how many hours you can study daily.' },
  { step: '03', title: 'Get Your Plan', desc: 'Our AI generates a detailed, structured study plan instantly.' },
  { step: '04', title: 'Track & Succeed', desc: 'Follow your plan, update progress, and ace your exams.' },
];

export default function Landing() {
  const isLoggedIn = !!localStorage.getItem('token');

  return (
    <div className="landing">
      {/* Header */}
      <header className="landing-header">
        <div className="landing-logo">📚 AI Study Planner</div>
        <div className="landing-nav">
          {isLoggedIn ? (
            <Link to="/dashboard" className="btn-primary">Go to Dashboard</Link>
          ) : (
            <>
              <Link to="/login" className="btn-outline">Login</Link>
              <Link to="/register" className="btn-primary">Get Started</Link>
            </>
          )}
        </div>
      </header>

      {/* Hero */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">✨ Powered by Google Gemini AI</div>
          <h1 className="hero-title">
            Study Smarter,<br />
            <span className="hero-highlight">Not Harder</span>
          </h1>
          <p className="hero-subtitle">
            Let AI create the perfect study plan for your exams. Enter your subjects,
            exam date, and available hours — get a detailed schedule instantly.
          </p>
          <div className="hero-actions">
            <Link to="/register" className="btn-primary btn-lg">
              Start Planning for Free →
            </Link>
            <Link to="/login" className="btn-outline btn-lg">
              I have an account
            </Link>
          </div>
          <div className="hero-stats">
            <div className="stat"><strong>AI-Powered</strong><span>Plan Generation</span></div>
            <div className="stat-divider" />
            <div className="stat"><strong>100%</strong><span>Free to Use</span></div>
            <div className="stat-divider" />
            <div className="stat"><strong>Instant</strong><span>Results</span></div>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-card">
            <div className="hero-card-header">
              <span>📋 Generated Study Plan</span>
              <span className="badge badge-green">Ready</span>
            </div>
            <div className="hero-card-body">
              <div className="plan-preview-item">
                <strong>Week 1:</strong> Mathematics — Algebra & Calculus (3h/day)
              </div>
              <div className="plan-preview-item">
                <strong>Week 2:</strong> Physics — Mechanics & Thermodynamics (3h/day)
              </div>
              <div className="plan-preview-item">
                <strong>Week 3:</strong> Chemistry — Organic & Inorganic (3h/day)
              </div>
              <div className="plan-preview-item">
                <strong>Final Week:</strong> Full Revision + Mock Tests
              </div>
            </div>
            <div className="progress-section" style={{ marginTop: '12px' }}>
              <div className="progress-label"><span>Overall Progress</span><span>65%</span></div>
              <div className="progress-bar-bg"><div className="progress-bar-fill" style={{ width: '65%' }} /></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features-section">
        <div className="section-header">
          <h2>Everything You Need to Succeed</h2>
          <p>A complete toolkit for exam preparation</p>
        </div>
        <div className="features-grid">
          {features.map((f, i) => (
            <div key={i} className="feature-card">
              <div className="feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="how-section">
        <div className="section-header">
          <h2>How It Works</h2>
          <p>Get your AI study plan in 4 simple steps</p>
        </div>
        <div className="steps-grid">
          {steps.map((s, i) => (
            <div key={i} className="step-card">
              <div className="step-number">{s.step}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <h2>Ready to Ace Your Exams?</h2>
        <p>Join thousands of students using AI to study smarter.</p>
        <Link to="/register" className="btn-primary btn-lg">
          Create Your Free Account →
        </Link>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <p>📚 AI Study Planner — Built with React, Node.js, MongoDB & Gemini AI</p>
      </footer>
    </div>
  );
}
