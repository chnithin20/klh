import React from 'react';
import Tabs from './Tabs';

interface HeroProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Hero: React.FC<HeroProps> = ({ activeTab, onTabChange }) => (
  <div className="hero">
    <div className="hero-tag">🎓 AI-Powered Exam Prep</div>
    <h1>Your <em>Personal Coach</em><br />for JEE & NEET</h1>
    <p>Upload your mock test → AI finds your weak spots → Get a personalized 7-day revision plan. Built for 15L+ students who deserve better than generic advice.</p>
    <Tabs activeTab={activeTab} onTabChange={onTabChange} />
  </div>
);

export default Hero;
