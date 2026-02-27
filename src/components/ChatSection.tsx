import React, { useState, useRef, useEffect } from 'react';
import { STUDENTS } from '../data/students';
import { AI_RESPONSES } from '../data/aiResponses';
import { api } from '../services/api';

interface Message {
  id: string;
  role: 'user' | 'ai';
  text: string;
}

interface ChatSectionProps {
  studentId: string;
}

const ChatSection: React.FC<ChatSectionProps> = ({ studentId }) => {
  // Handle uploaded student case
  const isUploaded = studentId === 'uploaded';
  const s = isUploaded ? null : STUDENTS[studentId as keyof typeof STUDENTS];
  
  // Student name for greeting
  const studentName = isUploaded ? 'there' : (s?.name?.split(' ')[0] || 'there');
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'ai',
      text: `Hey ${studentName}! 👋 I'm your AI Coach. I've analyzed your mock test and I know exactly where you're struggling. Ask me anything — I'll explain concepts simply, give you practice questions, or adjust your study plan. What's on your mind?`,
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages, isTyping]);

  const getAIResponse = (text: string) => {
    const lower = text.toLowerCase();
    if (lower.includes('thermodynamics') || lower.includes('thermo')) return AI_RESPONSES.thermodynamics;
    if (lower.includes('carnot')) return AI_RESPONSES.carnot;
    if (lower.includes('organic') || lower.includes('sn1') || lower.includes('sn2')) return AI_RESPONSES.organic;
    if (lower.includes('hour') || (lower.includes('study') && lower.includes('how'))) return AI_RESPONSES.hours;
    if (lower.includes('practice') || lower.includes('question') || lower.includes('mcq')) return AI_RESPONSES.practice;
    return AI_RESPONSES.default;
  };

  const handleSend = async (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { id: Date.now().toString(), role: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const result = await api.chat(text);
      const aiMsg: Message = { id: (Date.now() + 1).toString(), role: 'ai', text: result.reply };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error('Chat failed:', error);
      const errorMsg: Message = { id: (Date.now() + 1).toString(), role: 'ai', text: 'Sorry, I couldn\'t process your message. Please try again.' };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const quickQs = [
    "Why do I keep getting Thermodynamics wrong?",
    "Explain Carnot cycle simply",
    "Best trick for Organic Chemistry reactions?",
    "How many hours should I study today?",
    "Give me 3 practice questions on my weakest topic",
  ];

  return (
    <div className="section">
      <div className="section-label">AI Coach</div>
      <div className="section-sub">Ask anything about your weak topics, get instant explanations</div>

      <div className="chat-layout">
        <div className="chat-sidebar">
          <div className="card">
            <div className="card-title">Quick Questions</div>
            <div className="quick-qs">
              {quickQs.map((q, i) => (
                <div key={i} className="quick-q" onClick={() => handleSend(q)}>{q}</div>
              ))}
            </div>
          </div>
        </div>

        <div className="chat-main">
          <div className="chat-messages">
            {messages.map((m) => (
              <div key={m.id} className={`msg ${m.role}`}>
                <div 
                  className="msg-avatar" 
                  style={{ 
                    background: m.role === 'ai' ? 'rgba(108,71,255,0.2)' : 'rgba(255,107,53,0.2)',
                    color: m.role === 'ai' ? 'var(--accent)' : 'var(--accent2)'
                  }}
                >
                  {m.role === 'ai' ? '🤖' : '👤'}
                </div>
                <div className="msg-bubble" style={{ whiteSpace: 'pre-line' }}>{m.text}</div>
              </div>
            ))}
            {isTyping && (
              <div className="msg ai">
                <div className="msg-avatar" style={{ background: 'rgba(108,71,255,0.2)', color: 'var(--accent)' }}>🤖</div>
                <div className="msg-bubble">
                  <div className="typing">
                    <div className="dot" style={{ animationDelay: '0s' }}></div>
                    <div className="dot" style={{ animationDelay: '0.2s' }}></div>
                    <div className="dot" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
          <div className="chat-input-bar">
            <input 
              className="chat-input" 
              placeholder="Ask your AI coach..." 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
            />
            <button className="send-btn" onClick={() => handleSend(input)}>➤</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatSection;
