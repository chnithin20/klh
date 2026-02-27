import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import UploadSection from './components/UploadSection';
import AnalysisSection from './components/AnalysisSection';
import PlanSection from './components/PlanSection';
import ProgressSection from './components/ProgressSection';
import ChatSection from './components/ChatSection';
import Loader from './components/Loader';
import { api, Topic } from './services/api';
import { STUDENTS } from './data/students';

import './styles/globals.css';
import './styles/layout.css';
import './styles/components.css';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('upload');
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [activeStudentId, setActiveStudentId] = useState<string>('rahul');
  const [analysisData, setAnalysisData] = useState<{ weak: Topic[]; strong: Topic[]; score: number } | null>(null);
  const [planData, setPlanData] = useState<any[] | null>(null);
  const [loading, setLoading] = useState<{ show: boolean; text: string; sub: string }>({
    show: false,
    text: '',
    sub: '',
  });

  // Listen for custom events from UploadSection
  useEffect(() => {
    // Handle uploaded analysis ready
    const handleUploadedAnalysis = (e: CustomEvent) => {
      const result = e.detail;
      setActiveStudentId('uploaded');
      setAnalysisData({
        weak: result.weak_topics,
        strong: result.strong_topics,
        score: result.overall_score
      });
      setActiveTab('analysis');
      // Clear stored data
      sessionStorage.removeItem('uploadedAnalysis');
      sessionStorage.removeItem('uploadedTopics');
    };

    // Handle demo analysis ready
    const handleDemoAnalysis = (e: CustomEvent) => {
      const { studentId, ...result } = e.detail;
      setActiveStudentId(studentId || 'rahul');
      setAnalysisData({
        weak: result.weak_topics,
        strong: result.strong_topics,
        score: result.overall_score
      });
      setActiveTab('analysis');
      // Clear stored data
      sessionStorage.removeItem('demoAnalysis');
      sessionStorage.removeItem('demoStudent');
    };

    window.addEventListener('uploadedAnalysisReady', handleUploadedAnalysis as EventListener);
    window.addEventListener('demoAnalysisReady', handleDemoAnalysis as EventListener);

    return () => {
      window.removeEventListener('uploadedAnalysisReady', handleUploadedAnalysis as EventListener);
      window.removeEventListener('demoAnalysisReady', handleDemoAnalysis as EventListener);
    };
  }, []);

  // Check for stored data on mount (for page refresh scenarios)
  useEffect(() => {
    const checkStoredData = async () => {
      // Check for demo data
      const demoAnalysis = sessionStorage.getItem('demoAnalysis');
      const demoStudent = sessionStorage.getItem('demoStudent');
      
      if (demoAnalysis && demoStudent) {
        try {
          const parsed = JSON.parse(demoAnalysis);
          setActiveStudentId(demoStudent);
          setAnalysisData({
            weak: parsed.weak_topics,
            strong: parsed.strong_topics,
            score: parsed.overall_score
          });
          // Clear stored data
          sessionStorage.removeItem('demoAnalysis');
          sessionStorage.removeItem('demoStudent');
        } catch (e) {
          console.error('Error parsing demo data:', e);
        }
      }

      // Check for uploaded data
      const uploadedAnalysis = sessionStorage.getItem('uploadedAnalysis');
      if (uploadedAnalysis) {
        try {
          const parsed = JSON.parse(uploadedAnalysis);
          setActiveStudentId('uploaded');
          setAnalysisData({
            weak: parsed.weak_topics,
            strong: parsed.strong_topics,
            score: parsed.overall_score
          });
          // Clear stored data
          sessionStorage.removeItem('uploadedAnalysis');
          sessionStorage.removeItem('uploadedTopics');
        } catch (e) {
          console.error('Error parsing uploaded data:', e);
        }
      }
    };

    checkStoredData();
  }, []);

  const handleRunAnalysis = async () => {
    if (!selectedStudentId) return;
    
    // If uploaded data exists in session, use it
    const uploadedAnalysis = sessionStorage.getItem('uploadedAnalysis');
    if (uploadedAnalysis && selectedStudentId === 'uploaded') {
      try {
        const parsed = JSON.parse(uploadedAnalysis);
        setActiveStudentId('uploaded');
        setAnalysisData({
          weak: parsed.weak_topics,
          strong: parsed.strong_topics,
          score: parsed.overall_score
        });
        setActiveTab('analysis');
        sessionStorage.removeItem('uploadedAnalysis');
        sessionStorage.removeItem('uploadedTopics');
        return;
      } catch (e) {
        console.error('Error using uploaded data:', e);
      }
    }

    const student = STUDENTS[selectedStudentId as keyof typeof STUDENTS];
    if (!student) return;
    
    const allTopics = [...student.weak, ...student.strong];
    
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

    try {
      // Call backend API
      const result = await api.analyze({ topics: allTopics, exam: student.exam });
      
      setTimeout(() => {
        setLoading({ show: false, text: '', sub: '' });
        setActiveStudentId(selectedStudentId);
        setAnalysisData({
          weak: result.weak_topics,
          strong: result.strong_topics,
          score: result.overall_score
        });
        setActiveTab('analysis');
      }, 2200);
    } catch (error) {
      console.error('Analysis failed:', error);
      // Fallback to local data on error
      setTimeout(() => {
        setLoading({ show: false, text: '', sub: '' });
        setActiveStudentId(selectedStudentId);
        setAnalysisData({
          weak: student.weak,
          strong: student.strong,
          score: student.score
        });
        setActiveTab('analysis');
      }, 2200);
    }
  };

  const handleGeneratePlan = async () => {
    if (!activeStudentId) return;

    // Check if we have uploaded topics
    const uploadedTopics = sessionStorage.getItem('uploadedTopics');
    let topics: Topic[] = [];
    let exam = 'JEE Mains';

    if (activeStudentId === 'uploaded' && uploadedTopics) {
      try {
        topics = JSON.parse(uploadedTopics);
      } catch (e) {
        console.error('Error parsing uploaded topics:', e);
      }
    } else if (activeStudentId !== 'uploaded') {
      const student = STUDENTS[activeStudentId as keyof typeof STUDENTS];
      if (!student) return;
      topics = [...student.weak, ...student.strong];
      exam = student.exam;
    }
    
    setLoading({ show: true, text: 'Generating Your 7-Day Plan...', sub: 'AI is personalizing your revision schedule' });
    
    try {
      // Call backend API
      const result = await api.generatePlan({ topics, exam });
      
      setTimeout(() => {
        setLoading({ show: false, text: '', sub: '' });
        setPlanData(result.plan);
        setActiveTab('plan');
      }, 1800);
    } catch (error) {
      console.error('Plan generation failed:', error);
      setTimeout(() => {
        setLoading({ show: false, text: '', sub: '' });
        setActiveTab('plan');
      }, 1800);
    }
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
          analysisData={analysisData}
          onGeneratePlan={handleGeneratePlan} 
          onBack={() => setActiveTab('upload')} 
        />
      )}

      {activeTab === 'plan' && (
        <PlanSection 
          studentId={activeStudentId}
          planData={planData}
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
