import React, { useEffect, useState } from 'react';
import { STUDENTS } from '../data/students';

interface AnalysisSectionProps {
  studentId: string;
  onGeneratePlan: () => void;
  onBack: () => void;
}

const TopicCard: React.FC<{ topic: any; isWeak: boolean }> = ({ topic, isWeak }) => {
  const [width, setWidth] = useState('0%');

  useEffect(() => {
    const timer = setTimeout(() => setWidth(`${topic.score}%`), 100);
    return () => clearTimeout(timer);
  }, [topic.score]);

  const color = isWeak
    ? (topic.score < 30 ? 'var(--danger)' : 'var(--warn)')
    : 'var(--success)';
  const bg = isWeak
    ? (topic.score < 30 ? 'rgba(255,64,96,0.08)' : 'rgba(255,184,48,0.08)')
    : 'rgba(0,200,150,0.08)';
  const badgeBg = isWeak
    ? (topic.score < 30 ? 'rgba(255,64,96,0.2)' : 'rgba(255,184,48,0.2)')
    : 'rgba(0,200,150,0.2)';
  const label = isWeak ? (topic.score < 30 ? '🔴 Critical' : '🟡 Weak') : '🟢 Strong';

  return (
    <div className="topic-card" style={{ background: bg }}>
      <div className="topic-header">
        <div>
          <div className="topic-name">{topic.name}</div>
          <div className="topic-subject">{topic.subject}</div>
        </div>
        <span className="weakness-badge" style={{ background: badgeBg, color: color }}>{label}</span>
      </div>
      <div className="bar-track">
        <div className="bar-fill" style={{ width, background: color }}></div>
      </div>
      <div className="topic-stats">
        <span>{topic.correct}/{topic.attempted} correct</span>
        <span style={{ color, fontWeight: 600 }}>{topic.score}% accuracy</span>
      </div>
    </div>
  );
};

const AnalysisSection: React.FC<AnalysisSectionProps> = ({ studentId, onGeneratePlan, onBack }) => {
  const s = STUDENTS[studentId as keyof typeof STUDENTS];
  const color = s.score >= 65 ? 'var(--success)' : s.score >= 50 ? 'var(--warn)' : 'var(--danger)';
  const pct = s.score;

  return (
    <div className="section">
      <div className="analysis-header">
        <div className="student-info">
          <div className="section-label">{s.name}</div>
          <p style={{ color: 'var(--muted)' }}>{s.exam} · {s.mock} · Feb 2025</p>
        </div>
        <div className="score-ring" style={{ background: `conic-gradient(${color} ${pct * 3.6}deg, rgba(255,255,255,0.06) ${pct * 3.6}deg)` }}>
          <span>{s.score}%</span>
          <small>Overall</small>
        </div>
      </div>

      <div className="section-label" style={{ fontSize: '1rem', marginBottom: '16px' }}>🔴 Weak Topics (Need Immediate Attention)</div>
      <div className="topics-grid">
        {s.weak.map((t, i) => <TopicCard key={i} topic={t} isWeak={true} />)}
      </div>

      <div className="section-label" style={{ fontSize: '1rem', marginBottom: '16px', marginTop: '32px' }}>🟢 Strong Topics (Keep Practising)</div>
      <div className="topics-grid">
        {s.strong.map((t, i) => <TopicCard key={i} topic={t} isWeak={false} />)}
      </div>

      <div className="cta-row">
        <button className="btn btn-primary" onClick={onGeneratePlan}>📅 Generate 7-Day Plan →</button>
        <button className="btn btn-secondary" onClick={onBack}>← Back</button>
      </div>
    </div>
  );
};

export default AnalysisSection;
