export const STUDENTS = {
  rahul: {
    id: 'rahul',
    name: "Rahul Sharma", exam: "JEE Mains", mock: "Mock Test #3",
    score: 52, streak: 6, planDone: 71, fixed: "2/5",
    scoreUp: "↑ +8% this month",
    weak: [
      { name: "Thermodynamics", subject: "Physics", correct: 3, attempted: 10, score: 30 },
      { name: "Organic Chemistry", subject: "Chemistry", correct: 4, attempted: 12, score: 33 },
      { name: "Integration (Calculus)", subject: "Math", correct: 2, attempted: 8, score: 25 },
    ],
    strong: [
      { name: "Mechanics", subject: "Physics", correct: 9, attempted: 10, score: 90 },
      { name: "Inorganic Chemistry", subject: "Chemistry", correct: 7, attempted: 9, score: 78 },
      { name: "Algebra", subject: "Math", correct: 8, attempted: 10, score: 80 },
    ],
    trend: [38, 44, 48, 50, 52],
    subjects: [
      { name: "Physics", pct: 58, color: "#6c47ff" },
      { name: "Chemistry", pct: 47, color: "#ff6b35" },
      { name: "Mathematics", pct: 61, color: "#00c896" },
    ],
    aiMsg: "\"Rahul, your biggest weak spots are Thermodynamics and Organic Chemistry. I've front-loaded Days 1-4 to hammer these first, leaving Day 6 for a full mock and Day 7 for review. Stick to this and you'll gain 15-20 marks easily.\"",
    preview: `Student: Rahul Sharma | Exam: JEE Mains\nDate: Feb 20, 2025 | Total: 90 Qs\n\nTopic Results:\n• Mechanics        → 9/10  ✅\n• Thermodynamics   → 3/10  ❌\n• Electrostatics   → 6/10  ✅\n• Org. Chemistry   → 4/12  ❌\n• Inorg. Chemistry → 7/9   ✅\n• Algebra          → 8/10  ✅\n• Integration      → 2/8   ❌\n• Coord. Geometry  → 7/9   ✅\n\nAI Weakness Score: Thermodynamics 30%,\nOrganic Chemistry 33%, Integration 25%`
  },
  priya: {
    id: 'priya',
    name: "Priya Nair", exam: "NEET", mock: "Mock Test #5",
    score: 71, streak: 12, planDone: 86, fixed: "4/5",
    scoreUp: "↑ +14% this month",
    weak: [
      { name: "Genetics & Evolution", subject: "Biology", correct: 5, attempted: 12, score: 42 },
      { name: "Electrochemistry", subject: "Chemistry", correct: 3, attempted: 8, score: 38 },
    ],
    strong: [
      { name: "Human Physiology", subject: "Biology", correct: 18, attempted: 20, score: 90 },
      { name: "Organic Chemistry", subject: "Chemistry", correct: 8, attempted: 10, score: 80 },
      { name: "Physics (Optics)", subject: "Physics", correct: 7, attempted: 8, score: 88 },
    ],
    trend: [52, 58, 64, 68, 71],
    subjects: [
      { name: "Biology", pct: 82, color: "#00c896" },
      { name: "Chemistry", pct: 64, color: "#ff6b35" },
      { name: "Physics", pct: 76, color: "#6c47ff" },
    ],
    aiMsg: "\"Priya, you're doing great! Your main gaps are Genetics and Electrochemistry. Just 4-5 focused days on these and you could easily cross 80%. Your Biology is already NEET-ready!\"",
    preview: `Student: Priya Nair | Exam: NEET\nDate: Feb 22, 2025 | Total: 180 Qs\n\nTopic Results:\n• Human Physiology   → 18/20  ✅\n• Genetics & Evol.   → 5/12   ❌\n• Cell Biology       → 9/10   ✅\n• Electrochemistry   → 3/8    ❌\n• Org. Chemistry     → 8/10   ✅\n• Optics (Physics)   → 7/8    ✅\n\nAI Weakness Score: Genetics 42%,\nElectrochemistry 38%`
  },
  arjun: {
    id: 'arjun',
    name: "Arjun Mehta", exam: "JEE Advanced", mock: "Mock Test #2",
    score: 38, streak: 3, planDone: 43, fixed: "0/6",
    scoreUp: "↓ -2% vs last mock",
    weak: [
      { name: "Complex Numbers", subject: "Math", correct: 1, attempted: 8, score: 13 },
      { name: "Rotational Dynamics", subject: "Physics", correct: 2, attempted: 9, score: 22 },
      { name: "Electrochemistry", subject: "Chemistry", correct: 2, attempted: 8, score: 25 },
      { name: "Differential Equations", subject: "Math", correct: 2, attempted: 7, score: 29 },
    ],
    strong: [
      { name: "Coordinate Geometry", subject: "Math", correct: 7, attempted: 9, score: 78 },
      { name: "Mole Concept", subject: "Chemistry", correct: 6, attempted: 8, score: 75 },
    ],
    trend: [42, 40, 39, 40, 38],
    subjects: [
      { name: "Physics", pct: 34, color: "#6c47ff" },
      { name: "Chemistry", pct: 42, color: "#ff6b35" },
      { name: "Mathematics", pct: 38, color: "#00c896" },
    ],
    aiMsg: "\"Arjun, I can see you're in a rough patch — but don't panic. Your score is dropping because you're attempting everything without fundamentals. Let's slow down and rebuild. Complex Numbers and Rotational Dynamics first. One topic at a time.\"",
    preview: `Student: Arjun Mehta | Exam: JEE Advanced\nDate: Feb 18, 2025 | Total: 54 Qs\n\nTopic Results:\n• Complex Numbers       → 1/8   ❌\n• Rotational Dynamics   → 2/9   ❌\n• Electrochemistry      → 2/8   ❌\n• Differential Eqs      → 2/7   ❌\n• Coord. Geometry       → 7/9   ✅\n• Mole Concept          → 6/8   ✅\n\nAI Weakness Score: Complex Numbers 13%,\nRotational 22%, Electrochemistry 25%`
  }
};
