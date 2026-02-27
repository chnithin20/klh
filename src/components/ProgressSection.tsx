import React, { useEffect, useState } from 'react';
import { STUDENTS } from '../data/students';

interface ProgressSectionProps {
  studentId: string;
  onStudentChange: (id: string) => void;
}

const TrendChart: React.FC<{ data: number[] }> = ({ data }) => {
  const [w, setW] = useState(400);
  const H = 200;
  const pad = { top: 20, right: 20, bottom: 30, left: 40 };

  useEffect(() => {
    const handleResize = () => {
      const el = document.getElementById('trendChartContainer');
      if (el) setW(el.offsetWidth);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const cW = w - pad.left - pad.right;
  const cH = H - pad.top - pad.bottom;
  const minVal = Math.min(...data) - 10;
  const maxVal = Math.max(...data) + 5;
  const xStep = cW / (data.length - 1);
  const yScale = (v: number) => cH - ((v - minVal) / (maxVal - minVal)) * cH;

  const points = data.map((v, i) => [pad.left + i * xStep, pad.top + yScale(v)]);
  const pathD = points.map((p, i) => (i === 0 ? `M ${p[0]} ${p[1]}` : `L ${p[0]} ${p[1]}`)).join(' ');
  const areaD = pathD + ` L ${points[points.length - 1][0]} ${pad.top + cH} L ${points[0][0]} ${pad.top + cH} Z`;
  const labels = ['Test 1', 'Test 2', 'Test 3', 'Test 4', 'Test 5'];

  return (
    <svg width="100%" height={H} viewBox={`0 0 ${w} ${H}`}>
      <defs>
        <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6c47ff" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#6c47ff" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0, 0.25, 0.5, 0.75, 1].map((t) => {
        const y = pad.top + t * cH;
        const val = Math.round(maxVal - t * (maxVal - minVal));
        return (
          <React.Fragment key={t}>
            <line x1={pad.left} y1={y} x2={pad.left + cW} y2={y} stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
            <text x={pad.left - 6} y={y + 4} fill="#666" fontSize="10" textAnchor="end">{val}%</text>
          </React.Fragment>
        );
      })}
      <path d={areaD} fill="url(#grad)" />
      <path d={pathD} fill="none" stroke="#6c47ff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {points.map((p, i) => (
        <React.Fragment key={i}>
          <circle cx={p[0]} cy={p[1]} r="5" fill="#6c47ff" stroke="#0f0e17" strokeWidth="2" />
          <text x={p[0]} y={p[1] - 10} fill="#a7a9be" fontSize="10" textAnchor="middle">{data[i]}%</text>
          <text x={p[0]} y={H - 8} fill="#666" fontSize="9" textAnchor="middle">{labels[i]}</text>
        </React.Fragment>
      ))}
    </svg>
  );
};

const ProgressSection: React.FC<ProgressSectionProps> = ({ studentId, onStudentChange }) => {
  const s = STUDENTS[studentId as keyof typeof STUDENTS];
  const [barWidths, setBarWidths] = useState<string[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setBarWidths(s.subjects.map(sub => `${sub.pct}%`));
    }, 100);
    return () => clearTimeout(timer);
  }, [s.subjects]);

  return (
    <div className="section">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div className="section-label">Progress Dashboard</div>
          <div className="section-sub" style={{ marginBottom: 0 }}>Track improvement over time</div>
        </div>
        <select value={studentId} onChange={(e) => onStudentChange(e.target.value)}>
          <option value="rahul">Rahul Sharma — JEE</option>
          <option value="priya">Priya Nair — NEET</option>
          <option value="arjun">Arjun Mehta — JEE Adv</option>
        </select>
      </div>

      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-label">Overall Score</div>
          <div className="stat-value">{s.score}%</div>
          <div className="stat-up" style={{ color: s.scoreUp.includes('↑') ? 'var(--success)' : 'var(--danger)' }}>{s.scoreUp}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Weak Topics Fixed</div>
          <div className="stat-value">{s.fixed}</div>
          <div className="stat-sub">Topics above 60%</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Study Streak</div>
          <div className="stat-value">🔥 {s.streak}</div>
          <div className="stat-sub">Days in a row</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Plan Completion</div>
          <div className="stat-value">{s.planDone}%</div>
          <div className="stat-sub">5 of 7 days done</div>
        </div>
      </div>

      <div className="progress-grid">
        <div className="card">
          <div className="card-title">Score Trend (Last 5 Mocks)</div>
          <div className="chart-container" id="trendChartContainer">
            <TrendChart data={s.trend} />
          </div>
        </div>
        <div className="card">
          <div className="card-title">Subject-wise Strength</div>
          <div className="subject-bars" style={{ paddingTop: '12px' }}>
            {s.subjects.map((sub, i) => (
              <div key={i} className="sub-row">
                <div className="sub-label">
                  <span>{sub.name}</span>
                  <span className="sub-pct" style={{ color: sub.color }}>{sub.pct}%</span>
                </div>
                <div className="bar-track" style={{ height: '10px' }}>
                  <div className="bar-fill" style={{ width: barWidths[i] || '0%', background: sub.color, height: '10px', borderRadius: '5px' }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressSection;
