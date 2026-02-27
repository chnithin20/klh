import React from 'react';
import { STUDENTS } from '../data/students';

interface UploadSectionProps {
  selectedStudentId: string | null;
  onSelectStudent: (id: string) => void;
  onRunAnalysis: () => void;
}

const UploadSection: React.FC<UploadSectionProps> = ({
  selectedStudentId,
  onSelectStudent,
  onRunAnalysis,
}) => {
  const selectedStudent = selectedStudentId ? STUDENTS[selectedStudentId as keyof typeof STUDENTS] : null;

  return (
    <div className="section active">
      <div className="upload-grid">
        <div>
          <div className="section-label">Upload Mock Test</div>
          <div className="section-sub">Drop your result CSV or pick a sample student below</div>

          <div className="upload-zone" onClick={() => onSelectStudent('rahul')}>
            <div className="upload-icon">📄</div>
            <h3>Drop CSV / JSON file here</h3>
            <p>or click to browse · Supports JEE, NEET, UPSC formats</p>
          </div>

          <div style={{ textAlign: 'center', color: 'var(--muted)', margin: '20px 0', fontSize: '0.85rem' }}>
            — or pick a demo student —
          </div>

          <div className="student-cards">
            {Object.values(STUDENTS).map((s) => (
              <div
                key={s.id}
                className={`student-card ${selectedStudentId === s.id ? 'selected' : ''}`}
                onClick={() => onSelectStudent(s.id)}
              >
                <div 
                  className="avatar" 
                  style={{ 
                    background: s.id === 'rahul' ? 'rgba(108,71,255,0.2)' : s.id === 'priya' ? 'rgba(0,200,150,0.2)' : 'rgba(255,107,53,0.2)',
                    color: s.id === 'rahul' ? 'var(--accent)' : s.id === 'priya' ? 'var(--success)' : 'var(--accent2)'
                  }}
                >
                  {s.name[0]}
                </div>
                <div className="info">
                  <h4>{s.name}</h4>
                  <p>{s.exam} · {s.mock}</p>
                </div>
                <div 
                  className="score" 
                  style={{ color: s.score >= 70 ? 'var(--success)' : s.score >= 50 ? 'var(--warn)' : 'var(--danger)' }}
                >
                  {s.score}%
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="section-label">Test Preview</div>
          <div className="section-sub">Raw results before analysis</div>
          <div className="card" style={{ minHeight: '360px' }}>
            <div className="card-title">
              {selectedStudent ? `${selectedStudent.name} · ${selectedStudent.exam}` : 'Awaiting Input'}
            </div>
            <div style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: '1.8' }}>
              {selectedStudent ? (
                <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>{selectedStudent.preview}</pre>
              ) : (
                'Select a student or upload a file to preview mock test data here.'
              )}
            </div>
          </div>

          <div className="cta-row">
            <button
              className="btn btn-primary"
              onClick={onRunAnalysis}
              disabled={!selectedStudentId}
              style={{ opacity: selectedStudentId ? 1 : 0.5, cursor: selectedStudentId ? 'pointer' : 'not-allowed' }}
            >
              ⚡ Analyze Results
            </button>
            <button className="btn btn-secondary" onClick={() => onSelectStudent('rahul')}>Try Demo</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadSection;
