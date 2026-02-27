import React, { useState, useRef } from 'react';
import { STUDENTS } from '../data/students';
import { api, Topic } from '../services/api';

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
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadMode, setUploadMode] = useState<'file' | 'ocr'>('file');
  const [ocrResult, setOcrResult] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const ocrInputRef = useRef<HTMLInputElement>(null);

  const selectedStudent = selectedStudentId ? STUDENTS[selectedStudentId as keyof typeof STUDENTS] : null;

  // Handle file selection for CSV/JSON
  const handleFileSelect = async (file: File) => {
    if (!file.name.endsWith('.csv') && !file.name.endsWith('.json')) {
      setUploadError('Please upload a CSV or JSON file');
      return;
    }

    setUploading(true);
    setUploadError(null);

    try {
      // Parse CSV file
      const text = await file.text();
      const topics = parseCSV(text);
      
      if (topics.length === 0) {
        setUploadError('No valid topics found in the file');
        setUploading(false);
        return;
      }

      // Call backend to analyze uploaded data
      const result = await api.analyze({ topics, exam: 'JEE Mains' });
      
      // Store analysis result in sessionStorage for next step
      sessionStorage.setItem('uploadedAnalysis', JSON.stringify(result));
      sessionStorage.setItem('uploadedTopics', JSON.stringify(topics));
      
      // Select uploaded student and trigger analysis
      onSelectStudent('uploaded');
      
      // Store result directly for immediate use
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('uploadedAnalysisReady', { 
          detail: result 
        }));
      }, 100);
      
    } catch (error) {
      console.error('Upload failed:', error);
      setUploadError('Failed to analyze file. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  // Handle OCR image upload
  const handleOcrSelect = async (file: File) => {
    if (!file.name.match(/\.(jpg|jpeg|png|gif|bmp)$/i)) {
      setUploadError('Please upload an image file (JPG, PNG, etc.)');
      return;
    }

    setUploading(true);
    setUploadError(null);
    setOcrResult(null);

    try {
      // Call OCR API
      const result = await api.ocr(file, 'JEE Mains');
      setOcrResult(result);
      
      if (result.success && result.score) {
        // Convert OCR score to topics for analysis
        const topics = convertOcrToTopics(result);
        
        // Store for analysis
        sessionStorage.setItem('uploadedAnalysis', JSON.stringify({
          weak_topics: topics.filter((t: Topic) => t.score < 60),
          strong_topics: topics.filter((t: Topic) => t.score >= 60),
          overall_score: result.score.score
        }));
        sessionStorage.setItem('uploadedTopics', JSON.stringify(topics));
        
        onSelectStudent('uploaded');
        
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('uploadedAnalysisReady', { 
            detail: {
              weak_topics: topics.filter((t: Topic) => t.score < 60),
              strong_topics: topics.filter((t: Topic) => t.score >= 60),
              overall_score: result.score.score
            }
          }));
        }, 100);
      }
      
    } catch (error) {
      console.error('OCR failed:', error);
      setUploadError('Failed to process image. Please try again with a clearer image.');
    } finally {
      setUploading(false);
    }
  };

  // Convert OCR result to topics format
  const convertOcrToTopics = (ocrResult: any): Topic[] => {
    const { score } = ocrResult;
    const topics: Topic[] = [];
    
    // Create topics based on score
    const correctCount = score.correct;
    const wrongCount = score.wrong;
    
    // Split into topics (simulated for demo)
    if (correctCount + wrongCount > 0) {
      topics.push({
        name: 'Physics',
        subject: 'Physics',
        correct: Math.floor(correctCount * 0.4),
        attempted: Math.floor((correctCount + wrongCount) * 0.4),
        score: Math.floor(40 + Math.random() * 40)
      });
      topics.push({
        name: 'Chemistry',
        subject: 'Chemistry',
        correct: Math.floor(correctCount * 0.3),
        attempted: Math.floor((correctCount + wrongCount) * 0.3),
        score: Math.floor(40 + Math.random() * 40)
      });
      topics.push({
        name: 'Mathematics',
        subject: 'Mathematics',
        correct: Math.floor(correctCount * 0.3),
        attempted: Math.floor((correctCount + wrongCount) * 0.3),
        score: Math.floor(40 + Math.random() * 40)
      });
    }
    
    return topics;
  };

  // Parse CSV text into topics
  const parseCSV = (csvText: string): Topic[] => {
    const lines = csvText.trim().split('\n');
    const topics: Topic[] = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const parts = line.split(',').map(p => p.trim());
      if (parts.length >= 4) {
        topics.push({
          name: parts[0],
          subject: parts[1],
          correct: parseInt(parts[2]) || 0,
          attempted: parseInt(parts[3]) || 0,
          score: parts.length >= 5 ? parseInt(parts[4]) : 0
        });
      }
    }

    return topics;
  };

  // Handle drag events
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      if (uploadMode === 'ocr') {
        handleOcrSelect(file);
      } else {
        handleFileSelect(file);
      }
    }
  };

  // Handle click on upload zone
  const handleUploadClick = () => {
    if (uploadMode === 'ocr') {
      ocrInputRef.current?.click();
    } else {
      fileInputRef.current?.click();
    }
  };

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  // Handle OCR file input change
  const handleOcrFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleOcrSelect(file);
    }
  };

  // Try Demo - loads Rahul's data and runs analysis
  const handleTryDemo = async () => {
    setUploading(true);
    setUploadError(null);
    
    try {
      const student = STUDENTS.rahul;
      const allTopics = [...student.weak, ...student.strong];
      
      // Call backend API
      const result = await api.analyze({ topics: allTopics, exam: student.exam });
      
      // Store for later use
      sessionStorage.setItem('demoAnalysis', JSON.stringify(result));
      sessionStorage.setItem('demoStudent', 'rahul');
      
      onSelectStudent('rahul');
      
      // Trigger analysis immediately
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('demoAnalysisReady', { 
          detail: { ...result, studentId: 'rahul' }
        }));
      }, 100);
      
    } catch (error) {
      console.error('Demo failed:', error);
      setUploadError('Demo failed. Please check backend connection.');
      onSelectStudent('rahul');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="section active">
      <div className="upload-grid">
        <div>
          <div className="section-label">Upload Mock Test</div>
          <div className="section-sub">
            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
              <button 
                className={`tab ${uploadMode === 'file' ? 'active' : ''}`}
                onClick={() => { setUploadMode('file'); setUploadError(null); setOcrResult(null); }}
              >
                📄 CSV/JSON
              </button>
              <button 
                className={`tab ${uploadMode === 'ocr' ? 'active' : ''}`}
                onClick={() => { setUploadMode('ocr'); setUploadError(null); setOcrResult(null); }}
              >
                📷 Scan OMR
              </button>
            </div>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".csv,.json"
            style={{ display: 'none' }}
          />
          
          <input
            type="file"
            ref={ocrInputRef}
            onChange={handleOcrFileChange}
            accept="image/*"
            style={{ display: 'none' }}
          />

          <div 
            className={`upload-zone ${isDragging ? 'dragging' : ''} ${uploading ? 'uploading' : ''}`}
            onClick={handleUploadClick}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {uploading ? (
              <>
                <div className="upload-icon">⏳</div>
                <h3>{uploadMode === 'ocr' ? 'Scanning your answer sheet...' : 'Analyzing your file...'}</h3>
                <p>Please wait...</p>
              </>
            ) : uploadMode === 'ocr' ? (
              <>
                <div className="upload-icon">📷</div>
                <h3>Drop OMR/Answer Sheet Image</h3>
                <p>or click to browse · Supports JPG, PNG formats</p>
              </>
            ) : (
              <>
                <div className="upload-icon">📄</div>
                <h3>Drop CSV / JSON file here</h3>
                <p>or click to browse · Supports JEE, NEET, UPSC formats</p>
              </>
            )}
          </div>

          {uploadError && (
            <div style={{ color: 'var(--danger)', marginTop: '10px', fontSize: '0.9rem' }}>
              {uploadError}
            </div>
          )}

          {/* OCR Result Display */}
          {ocrResult && ocrResult.success && (
            <div className="card" style={{ marginTop: '16px', padding: '16px' }}>
              <div style={{ fontWeight: '600', marginBottom: '8px' }}>📊 Scan Results</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.9rem' }}>
                <div>Total Questions: <strong>{ocrResult.score?.total || 0}</strong></div>
                <div>Correct: <strong style={{ color: 'var(--success)' }}>{ocrResult.score?.correct || 0}</strong></div>
                <div>Wrong: <strong style={{ color: 'var(--danger)' }}>{ocrResult.score?.wrong || 0}</strong></div>
                <div>Unanswered: <strong>{ocrResult.score?.unanswered || 0}</strong></div>
              </div>
              <div style={{ marginTop: '12px', fontSize: '1.2rem', fontWeight: '700', textAlign: 'center' }}>
                Score: <span style={{ color: 'var(--accent)' }}>{ocrResult.score?.score || 0}%</span>
              </div>
            </div>
          )}

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
              disabled={!selectedStudentId || uploading}
              style={{ opacity: (selectedStudentId && !uploading) ? 1 : 0.5, cursor: (selectedStudentId && !uploading) ? 'pointer' : 'not-allowed' }}
            >
              ⚡ Analyze Results
            </button>
            <button 
              className="btn btn-secondary" 
              onClick={handleTryDemo}
              disabled={uploading}
            >
              {uploading ? '⏳ Loading...' : 'Try Demo'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadSection;
