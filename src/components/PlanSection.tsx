import React from 'react';
import { STUDENTS } from '../data/students';
import { PLANS } from '../data/plans';

interface PlanSectionProps {
  studentId: string;
  onTrackProgress: () => void;
  onAskAI: () => void;
}

const PlanSection: React.FC<PlanSectionProps> = ({ studentId, onTrackProgress, onAskAI }) => {
  const s = STUDENTS[studentId as keyof typeof STUDENTS];
  const plan = PLANS[studentId as keyof typeof PLANS];

  return (
    <div className="section">
      <div className="section-label">Your 7-Day Revision Plan</div>
      <div className="section-sub">Personalized for {s.name} · {s.exam}</div>

      <div className="plan-intro">
        <div className="big-emoji">🤖</div>
        <div>
          <h3>AI Coach Says:</h3>
          <p>{s.aiMsg}</p>
        </div>
      </div>

      <div className="days-grid">
        {plan.map((d, i) => (
          <div key={i} className="day-card" style={{ background: d.light }}>
            <div className="day-header" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="day-number" style={{ background: d.color, color: '#fff' }}>D{d.day}</div>
              <div>
                <h4>{d.title}</h4>
                <p>{d.focus}</p>
              </div>
            </div>
            <div className="day-body">
              {d.tasks.map((task, idx) => (
                <div key={idx} className="task-item">
                  <div className="task-dot" style={{ background: d.color }}></div>
                  <span>{task}</span>
                </div>
              ))}
            </div>
            <div className="day-footer">
              <span>⏱ {d.time}</span>
              <span>📝 {d.mcqs} MCQs</span>
            </div>
          </div>
        ))}
      </div>

      <div className="cta-row">
        <button className="btn btn-primary" onClick={onTrackProgress}>📈 Track Progress →</button>
        <button className="btn btn-secondary" onClick={onAskAI}>🤖 Ask AI Coach</button>
      </div>
    </div>
  );
};

export default PlanSection;
