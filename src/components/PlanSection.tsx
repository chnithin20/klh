import React from 'react';
import { STUDENTS } from '../data/students';
import { PLANS } from '../data/plans';
import { PlanDay } from '../services/api';

interface PlanSectionProps {
  studentId: string;
  planData: PlanDay[] | null;
  onTrackProgress: () => void;
  onAskAI: () => void;
}

const PlanSection: React.FC<PlanSectionProps> = ({ studentId, planData, onTrackProgress, onAskAI }) => {
  // Handle uploaded student case
  const isUploaded = studentId === 'uploaded';
  const s = isUploaded ? null : STUDENTS[studentId as keyof typeof STUDENTS];
  
  // Use API data if available, otherwise fallback to static plan data
  const plan = planData || (isUploaded ? null : PLANS[studentId as keyof typeof PLANS]);

  // Default plan for uploaded data if no AI plan generated
  const defaultPlan: PlanDay[] = [
    { day: 1, title: "Foundation Day", focus: "Weak Topics Basics", tasks: ["Review weak topics fundamentals", "Practice basic questions", "Take notes"], time: "2 hours", mcqs: 10, color: "#ff6b35", light: "rgba(255,107,53,0.08)" },
    { day: 2, title: "Deep Dive", focus: "Weak Topics Advanced", tasks: ["Solve advanced problems", "Focus on difficult concepts", "Practice MCQs"], time: "2.5 hours", mcqs: 12, color: "#6c47ff", light: "rgba(108,71,255,0.08)" },
    { day: 3, title: "Problem Solving", focus: "Mixed Practice", tasks: ["Solve mixed questions", "Time yourself", "Review mistakes"], time: "2 hours", mcqs: 15, color: "#00c896", light: "rgba(0,200,150,0.08)" },
    { day: 4, title: "Full Mock", focus: "Test Your Knowledge", tasks: ["Take full mock test", "Analyze results", "Identify gaps"], time: "3 hours", mcqs: 25, color: "#ff6b35", light: "rgba(255,107,53,0.08)" },
    { day: 5, title: "Rapid Revision", focus: "Quick Recap", tasks: ["Quick revision", "Solve previous year questions", "Clarify doubts"], time: "2 hours", mcqs: 20, color: "#6c47ff", light: "rgba(108,71,255,0.08)" },
    { day: 6, title: "Final Prep", focus: "Last Minute Tips", tasks: ["Important formulas", "Stress management", "Exam strategy"], time: "1.5 hours", mcqs: 10, color: "#00c896", light: "rgba(0,200,150,0.08)" },
    { day: 7, title: "Rest & Revise", focus: "Light Review", tasks: ["Light revision", "Stay calm", "Get ready for exam"], time: "1 hour", mcqs: 5, color: "#ff6b35", light: "rgba(255,107,53,0.08)" }
  ];

  const finalPlan = plan || defaultPlan;

  // Student info
  const studentName = isUploaded ? 'Your Uploaded Results' : (s?.name || 'Student');
  const studentExam = isUploaded ? 'Custom Mock Test' : (s?.exam || 'Exam');
  const aiMsg = isUploaded ? "I've created a personalized 7-day plan based on your uploaded mock test results. Focus on your weak areas and practice regularly!" : (s?.aiMsg || "Here's your personalized study plan!");

  return (
    <div className="section">
      <div className="section-label">Your 7-Day Revision Plan</div>
      <div className="section-sub">Personalized for {studentName} · {studentExam}</div>

      <div className="plan-intro">
        <div className="big-emoji">🤖</div>
        <div>
          <h3>AI Coach Says:</h3>
          <p>{aiMsg}</p>
        </div>
      </div>

      <div className="days-grid">
        {finalPlan.map((d, i) => (
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
