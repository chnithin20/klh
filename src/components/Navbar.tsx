import React from 'react';

const Navbar: React.FC = () => (
  <nav>
    <div className="logo">Exam<span>Coach</span>.ai</div>
    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
      <span className="badge">#42 EDUCATION</span>
      <span style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>Hackathon Demo</span>
    </div>
  </nav>
);

export default Navbar;
