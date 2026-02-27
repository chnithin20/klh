# AI Study Agent - Complete Documentation

## Overview

The AI Study Agent is an intelligent system that analyzes student mock-test errors, identifies weak topics, and generates personalized 7-day revision plans using trusted educational sources.

---

## Agent Workflow

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  1. INPUT DATA  │ -> │  2. ANALYSIS    │ -> │  3. IDENTIFY   │
│                 │    │                 │    │  WEAK TOPICS   │
│ - Mock test     │    │ - Group errors  │    │                 │
│ - Questions     │    │ - Calculate     │    │ - Prioritize   │
│ - Topics        │    │   accuracy      │    │ - Weightage    │
│ - Answers       │    │ - Detect        │    │ - Patterns     │
└─────────────────┘    │   patterns      │    └─────────────────┘
                       └─────────────────┘              │
                                                         v
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  6. OUTPUT      │ <- │  5. GENERATE   │ <- │  4. STUDY       │
│                 │    │  7-DAY PLAN    │    │  RESOURCES      │
│ - JSON report   │    │                 │    │                 │
│ - Human         │    │ - Day-wise     │    │ - NCERT         │
│   readable      │    │   schedule     │    │ - Khan Academy  │
│                 │    │ - Activities   │    │ - Physics Wallah│
└─────────────────┘    │ - Time balance │    │ - Unacademy     │
                       └─────────────────┘    │ - Vedantu       │
                                             │ - MIT OCW       │
                                             └─────────────────┘
```

---

## Input Data Format

### Expected JSON Structure

```
json
{
  "student_id": "student_123",
  "exam_type": "JEE Mains",
  "questions": [
    {
      "question_id": "Q1",
      "topic": "Thermodynamics",
      "subtopic": "Laws of Thermodynamics",
      "subject": "Physics",
      "correct_answer": "A",
      "student_answer": "B",
      "is_correct": false,
      "time_spent_seconds": 120,
      "difficulty": "medium"
    },
    {
      "question_id": "Q2",
      "topic": "Organic Chemistry",
      "subtopic": "Reaction Mechanisms",
      "subject": "Chemistry",
      "correct_answer": "C",
      "student_answer": "C",
      "is_correct": true,
      "time_spent_seconds": 90,
      "difficulty": "hard"
    }
  ]
}
```

### Field Descriptions

| Field | Type | Description |
|-------|------|-------------|
| `student_id` | string | Unique identifier for the student |
| `exam_type` | string | Exam name (JEE Mains, NEET, Boards) |
| `questions` | array | List of question objects |
| `question_id` | string | Unique identifier for the question |
| `topic` | string | Main topic name |
| `subtopic` | string | Specific subtopic |
| `subject` | string | Subject (Physics, Chemistry, Math, Biology) |
| `correct_answer` | string | Correct answer (A, B, C, D) |
| `student_answer` | string | Student's answer |
| `is_correct` | boolean | Whether answer is correct |
| `time_spent_seconds` | int | Time spent on question |
| `difficulty` | string | easy, medium, hard |

---

## Output Format

### Complete Analysis Report

```
json
{
  "student_id": "student_123",
  "exam_type": "JEE Mains",
  "summary": {
    "total_questions": 25,
    "correct_answers": 15,
    "accuracy": 60.0,
    "weak_topic_count": 5
  },
  "weak_topics": [
    {
      "topic": "Thermodynamics",
      "subject": "Physics",
      "accuracy": 30.0,
      "strength": "Very Weak",
      "total_questions": 10,
      "error_patterns": ["Calculation Mistake", "Time Management"],
      "recommended_time": "72 sec/question"
    },
    {
      "topic": "Organic Chemistry",
      "subject": "Chemistry",
      "accuracy": 45.0,
      "strength": "Weak",
      "total_questions": 8,
      "error_patterns": ["Conceptual Gap"],
      "recommended_time": "65 sec/question"
    }
  ],
  "study_resources": {
    "Thermodynamics": [
      {
        "title": "Thermodynamics - Video Lesson",
        "source": "Khan Academy",
        "type": "Video",
        "time": "15-20 minutes",
        "link": "https://www.khanacademy.org/science/physics/thermodynamics"
      },
      {
        "title": "Thermodynamics - Notes",
        "source": "Physics Wallah",
        "type": "Notes",
        "time": "25-30 minutes",
        "link": "https://www.pw.live/study/physics/thermodynamics"
      },
      {
        "title": "Thermodynamics - Practice Problems",
        "source": "Vedantu",
        "type": "Practice",
        "time": "30 minutes",
        "link": "https://www.vedantu.com/physics/thermodynamics"
      }
    ]
  },
  "revision_plan": [
    {
      "day": 1,
      "title": "Foundation Day",
      "focus_subject": "Physics",
      "topics": ["Thermodynamics"],
      "activities": [
        {"type": "Warm-up Review", "description": "Quick revision of previous topics", "duration": "15 min"},
        {"type": "Concept Learning", "description": "Learn Thermodynamics", "duration": "45 min"},
        {"type": "Practice", "description": "Practice questions on Thermodynamics", "duration": "60 min"},
        {"type": "MCQ Test", "description": "Mini test on Physics", "duration": "30 min"}
      ],
      "total_hours": 2.5,
      "mcq_practice": 17,
      "expected_outcome": "Better understanding of Thermodynamics"
    },
    {
      "day": 2,
      "title": "Deep Dive",
      "focus_subject": "Chemistry",
      "topics": ["Organic Chemistry"],
      "activities": [
        {"type": "Warm-up Review", "description": "Quick revision", "duration": "15 min"},
        {"type": "Concept Learning", "description": "Learn Organic Chemistry", "duration": "45 min"},
        {"type": "Practice", "description": "Practice reactions", "duration": "60 min"},
        {"type": "MCQ Test", "description": "Mini test on Chemistry", "duration": "30 min"}
      ],
      "total_hours": 2.5,
      "mcq_practice": 19,
      "expected_outcome": "Better understanding of Organic Chemistry"
    }
  ],
  "human_readable": "📊 ANALYSIS SUMMARY\nYou attempted 25 questions..."
}
```

---

## Trusted Educational Sources

The agent recommends resources from these verified platforms:

| Source | Type | Description |
|--------|------|-------------|
| **NCERT** | PDF, Textbook | Official CBSE textbooks |
| **Khan Academy** | Video, Practice | Free world-class education |
| **Physics Wallah** | Video, Notes | Free IIT-JEE preparation |
| **Unacademy** | Video, Test Series | India's largest learning platform |
| **Vedantu** | Video, Live Classes | Personalized learning |
| **MIT OCW** | Video, Lecture Notes | Free MIT course materials |

---

## Error Pattern Detection

The agent identifies these error patterns:

| Pattern | Description | Detection Method |
|---------|-------------|------------------|
| **Conceptual Gap** | Student doesn't understand the underlying concept | Many hard questions wrong |
| **Calculation Mistake** | Math/calculation errors | Formula-based topics wrong |
| **Time Management** | Too slow on questions | >3 min per question |
| **Misread Question** | Read question incorrectly | Random wrong answers |
| **Formula Forgotten** | Knew concept but not formula | Topic-specific errors |

---

## Topic Classification

Topics are classified into strength levels:

| Level | Accuracy Range | Color Code |
|-------|----------------|------------|
| **Very Weak** | 0-30% | 🔴 Red |
| **Weak** | 30-50% | 🟠 Orange |
| **Moderate** | 50-70% | 🟡 Yellow |
| **Strong** | 70-100% | 🟢 Green |

---

## Exam Weightage

### JEE Mains

| Physics | Weightage | Chemistry | Weightage | Math | Weightage |
|---------|-----------|-----------|-----------|------|-----------|
| Mechanics | 25 | Physical | 30 | Calculus | 30 |
| Electrodynamics | 20 | Organic | 35 | Algebra | 25 |
| Modern Physics | 15 | Inorganic | 35 | Coord. Geometry | 20 |
| Thermodynamics | 15 | | | Trigonometry | 15 |
| Waves & Optics | 15 | | | Vectors | 10 |

### NEET

Similar weightage for Physics/Chemistry, with Biology having its own distribution.

---

## API Integration

### Endpoint

```
POST /api/ai-agent/analyze
```

### Request

```
json
{
  "topics": [
    {"name": "Thermodynamics", "subject": "Physics", "correct": 3, "attempted": 10},
    {"name": "Organic Chemistry", "subject": "Chemistry", "correct": 4, "attempted": 12}
  ],
  "exam": "JEE Mains"
}
```

### Response

Returns the complete analysis report with weak topics, study resources, and 7-day plan.

---

## Adaptive Behavior

When new mock test data is provided:

1. **Re-evaluate** all topics for updated accuracy
2. **Update** priority based on new performance
3. **Adjust** the 7-day plan to focus on new weak areas
4. **Reduce** focus on topics that have improved
5. **Track** progress over multiple tests

---

## Suggestions for Improvement

### For Students:

1. **Daily Practice**: Complete all MCQs in the daily plan
2. **Time Management**: Practice with timers to improve speed
3. **Concept Clarity**: Use recommended videos to understand concepts
4. **Revision**: Review formula sheets daily
5. **Mock Tests**: Take full mock tests regularly

### For System Improvement:

1. **Track Progress**: Store historical data to show improvement graphs
2. **Personalization**: Learn from student behavior over time
3. **Difficulty Adaptation**: Adjust question difficulty based on performance
4. **Gamification**: Add streak tracking and achievements
5. **Parent Reports**: Send progress reports to parents

---

## Example Usage

### Python Example

```
python
from services.study_agent import analyze_and_plan

# Prepare mock test data
mock_test_data = {
    "student_id": "rahul_001",
    "exam_type": "JEE Mains",
    "questions": [
        {
            "question_id": "Q1",
            "topic": "Thermodynamics",
            "subtopic": "Laws",
            "subject": "Physics",
            "correct_answer": "A",
            "student_answer": "B",
            "is_correct": False,
            "time_spent_seconds": 150,
            "difficulty": "medium"
        }
    ]
}

# Generate full report
report = analyze_and_plan(mock_test_data)

# Access results
print(report["summary"]["accuracy"])
print(report["weak_topics"])
print(report["revision_plan"])
```

### cURL Example

```
bash
curl -X POST http://localhost:8000/api/ai-agent/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "topics": [
      {"name": "Thermodynamics", "subject": "Physics", "correct": 3, "attempted": 10},
      {"name": "Organic Chemistry", "subject": "Chemistry", "correct": 4, "attempted": 12}
    ],
    "exam": "JEE Mains"
  }'
```

---

## File Structure

```
backend/
├── services/
│   ├── study_agent.py      # Main AI Agent implementation
│   ├── analyzer.py         # Topic analysis
│   ├── gemini_service.py   # Gemini AI integration
│   └── ocr_service.py      # OMR scanning
├── api/
│   └── routes.py           # API endpoints
└── docs/
    └── AI_AGENT_DOCUMENTATION.md
```

---

## Dependencies

- Python 3.8+
- FastAPI
- Pydantic
- Python-dotenv
- google-generativeai

No additional ML libraries required - the agent uses rule-based logic for analysis.
