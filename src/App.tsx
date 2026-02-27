import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import UploadSection from './components/UploadSection';
import AnalysisSection from './components/AnalysisSection';
import PlanSection from './components/PlanSection';
import ProgressSection from './components/ProgressSection';
import ChatSection from './components/ChatSection';
import Loader from './components/Loader';

import './styles/globals.css';
import './styles/layout.css';
import './styles/components.css';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('upload');
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [activeStudentId, setActiveStudentId] = useState<string>('rahul');
  const [loading, setLoading] = useState<{ show: boolean; text: string; sub: string }>({
    show: false,
    text: '',
    sub: '',
  });

  const handleRunAnalysis = () => {
    if (!selectedStudentId) return;
    setLoading({ show: true, text: 'Analyzing Mock Test...', sub: 'Identifying weak topics using AI' });
    
    // Simulate analysis steps
    const steps = [
      { text: 'Parsing mock test data...', sub: 'Extracting topic-wise results' },
      { text: 'Calculating weakness scores...', sub: 'Using adaptive scoring algorithm' },
      { text: 'Generating AI insights...', sub: 'Identifying improvement patterns' },
      { text: 'Building your profile...', sub: 'Almost ready!' }
    ];

    steps.forEach((step, i) => {
      setTimeout(() => {
        setLoading(prev => ({ ...prev, text: step.text, sub: step.sub }));
      }, (i + 1) * 500);
    });

    setTimeout(() => {
      setLoading({ show: false, text: '', sub: '' });
      setActiveStudentId(selectedStudentId);
      setActiveTab('analysis');
    }, 2200);
  };

  const handleGeneratePlan = () => {
    setLoading({ show: true, text: 'Generating Your 7-Day Plan...', sub: 'AI is personalizing your revision schedule' });
    setTimeout(() => {
      setLoading({ show: false, text: '', sub: '' });
      setActiveTab('plan');
    }, 1800);
  };

  return (
    <div className="app-container">
      {loading.show && <Loader text={loading.text} sub={loading.sub} />}
      
      <Navbar />
      
      <Hero activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === 'upload' && (
        <UploadSection 
          selectedStudentId={selectedStudentId} 
          onSelectStudent={setSelectedStudentId} 
          onRunAnalysis={handleRunAnalysis} 
        />
      )}

      {activeTab === 'analysis' && (
        <AnalysisSection 
          studentId={activeStudentId} 
          onGeneratePlan={handleGeneratePlan} 
          onBack={() => setActiveTab('upload')} 
        />
      )}

      {activeTab === 'plan' && (
        <PlanSection 
          studentId={activeStudentId} 
          onTrackProgress={() => setActiveTab('progress')} 
          onAskAI={() => setActiveTab('chat')} 
        />
      )}

      {activeTab === 'progress' && (
        <ProgressSection 
          studentId={activeStudentId} 
          onStudentChange={setActiveStudentId} 
        />
      )}

      {activeTab === 'chat' && (
        <ChatSection studentId={activeStudentId} />
      )}
    </div>
  );
};

export default App;
