import React from 'react';

interface TabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Tabs: React.FC<TabsProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'upload', label: '📤 Upload Test' },
    { id: 'analysis', label: '📊 Analysis' },
    { id: 'plan', label: '📅 7-Day Plan' },
    { id: 'progress', label: '📈 Progress' },
    { id: 'chat', label: '🤖 AI Coach' },
  ];

  return (
    <div className="tabs">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`tab ${activeTab === tab.id ? 'active' : ''}`}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default Tabs;
