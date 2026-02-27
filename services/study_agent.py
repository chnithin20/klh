"""
ExamCoach.ai - AI Study Agent
An intelligent AI mentor for competitive exam students.

Features:
- Robust error analysis with OCR failure handling
- Weak topic classification
- Trusted study material recommendations
- Personalized 7-day revision plan
- Adaptive learning based on performance
"""

from typing import List, Dict, Any, Optional
from dataclasses import dataclass, field
from enum import Enum
import json
import logging

logger = logging.getLogger(__name__)


class TopicStrength(Enum):
    VERY_WEAK = "Very Weak"
    WEAK = "Weak"
    MODERATE = "Moderate"
    STRONG = "Strong"


class ErrorPattern(Enum):
    CONCEPTUAL_GAP = "Conceptual Gap"
    CALCULATION_MISTAKE = "Calculation Mistake"
    TIME_MANAGEMENT = "Time Management"
    MISREAD_QUESTION = "Misread Question"
    FORMULA_FORGOTTEN = "Formula Forgotten"
    APPLICATION_ERROR = "Application Error"


# Trusted educational sources (STRICTLY from allowed list)
TRUSTED_SOURCES = {
    "NCERT": {
        "name": "NCERT",
        "base_url": "https://ncert.nic.in/textbook",
        "types": ["PDF", "Textbook"],
        "description": "Official CBSE textbooks"
    },
    "Khan Academy": {
        "name": "Khan Academy",
        "base_url": "https://www.khanacademy.org/science",
        "types": ["Video", "Practice", "Article"],
        "description": "Free world-class education"
    },
    "Physics Wallah": {
        "name": "Physics Wallah",
        "base_url": "https://www.pw.live/study",
        "types": ["Video", "Notes", "Practice"],
        "description": "Free IIT-JEE preparation"
    },
    "Unacademy": {
        "name": "Unacademy",
        "base_url": "https://unacademy.com",
        "types": ["Video", "Notes", "Test Series"],
        "description": "India's largest learning platform"
    },
    "Vedantu": {
        "name": "Vedantu",
        "base_url": "https://www.vedantu.com",
        "types": ["Video", "Notes", "Live Classes"],
        "description": "Personalized learning"
    },
    "MIT OCW": {
        "name": "MIT OpenCourseWare",
        "base_url": "https://ocw.mit.edu/courses",
        "types": ["Video", "Lecture Notes"],
        "description": "Free MIT materials"
    }
}

# Exam weightage (higher = more important for JEE/NEET)
EXAM_WEIGHTAGE = {
    "JEE Mains": {
        "Physics": {
            "Mechanics": 25, "Electrodynamics": 20, "Modern Physics": 15,
            "Thermodynamics": 15, "Waves & Optics": 15, "SHM & Waves": 10
        },
        "Chemistry": {
            "Physical Chemistry": 30, "Organic Chemistry": 35, "Inorganic Chemistry": 35
        },
        "Mathematics": {
            "Calculus": 30, "Algebra": 25, "Coordinate Geometry": 20,
            "Trigonometry": 15, "Vectors & 3D": 10
        }
    },
    "JEE Advanced": {
        "Physics": {
            "Mechanics": 30, "Electrodynamics": 25, "Modern Physics": 15,
            "Thermodynamics": 10, "Optics": 10, "Waves": 10
        },
        "Chemistry": {
            "Physical Chemistry": 25, "Organic Chemistry": 40, "Inorganic Chemistry": 35
        },
        "Mathematics": {
            "Calculus": 35, "Algebra": 30, "Coordinate Geometry": 20,
            "Trigonometry": 10, "Vectors": 5
        }
    },
    "NEET": {
        "Physics": {
            "Mechanics": 20, "Electrodynamics": 18, "Modern Physics": 16,
            "Thermodynamics": 12, "Waves & Optics": 10, "Fluid Mechanics": 8,
            "SHM & Waves": 8, "Properties of Matter": 8
        },
        "Chemistry": {
            "Physical Chemistry": 25, "Organic Chemistry": 28, "Inorganic Chemistry": 27
        },
        "Biology": {
            "Human Physiology": 25, "Genetics": 20, "Ecology": 15,
            "Cell Biology": 15, "Plant Diversity": 10, "Animal Diversity": 10,
            "Biotechnology": 5
        }
    }
}

DEFAULT_WEIGHTAGE = {
    "Physics": 15, "Chemistry": 15, "Mathematics": 15, "Biology": 15
}


@dataclass
class Question:
    """Represents a question from the mock test"""
    question_id: str
    topic: str
    subtopic: str
    subject: str
    correct_answer: str
    student_answer: Optional[str] = None
    is_correct: bool = False
    time_spent_seconds: int = 0
    difficulty: str = "medium"


@dataclass 
class TopicAnalysis:
    """Analysis results for a single topic"""
    topic_name: str
    subject: str
    subtopics: Dict[str, Dict] = field(default_factory=dict)
    total_questions: int = 0
    correct_count: int = 0
    accuracy_percentage: float = 0.0
    strength_level: TopicStrength = TopicStrength.MODERATE
    error_patterns: List[ErrorPattern] = field(default_factory=list)
    avg_time_per_question: float = 0.0


@dataclass
class StudyResource:
    """Recommended study resource from trusted source"""
    topic: str
    title: str
    source: str
    resource_type: str
    estimated_time: str
    url: str


@dataclass
class DayPlan:
    """Single day's revision plan"""
    day: int
    title: str
    focus_subject: str
    topics: List[str]
    activities: List[Dict[str, str]]
    total_hours: float
    mcq_practice: int
    expected_outcome: str


class StudyAgent:
    """
    ExamCoach.ai - AI Study Agent
    
    Analyzes student mock-test performance and generates
    personalized revision plans with trusted resources.
    """

    def __init__(self, exam_type: str = "JEE Mains"):
        self.exam_type = exam_type
        self.weightage = EXAM_WEIGHTAGE.get(exam_type, DEFAULT_WEIGHTAGE)
        self.questions: List[Question] = []
        self.topic_analysis: Dict[str, TopicAnalysis] = {}
        self.student_name: str = "Student"
        self.mock_test_id: str = ""
        self.ocr_available: bool = True

    def load_data(
        self,
        mock_test_data: Dict[str, Any],
        student_name: str = "Student",
        ocr_text: Optional[str] = None
    ) -> None:
        """
        Load mock test data with OCR handling.
        
        If OCR fails or is incomplete, uses structured data.
        """
        self.student_name = student_name
        self.exam_type = mock_test_data.get('exam_type', self.exam_type)
        self.mock_test_id = mock_test_data.get('mock_test_id', '')
        self.weightage = EXAM_WEIGHTAGE.get(self.exam_type, DEFAULT_WEIGHTAGE)
        
        # Check OCR availability
        self.ocr_available = bool(ocr_text and len(ocr_text.strip()) > 50)
        
        if not self.ocr_available and ocr_text:
            logger.warning("OCR text incomplete, using structured data only")
        
        # Parse questions
        self.questions = []
        for q in mock_test_data.get('questions', []):
            question = Question(
                question_id=q.get('question_id', ''),
                topic=q.get('topic', 'General'),
                subtopic=q.get('subtopic', 'General'),
                subject=q.get('subject', 'General'),
                correct_answer=q.get('correct_answer', ''),
                student_answer=q.get('student_answer'),
                is_correct=q.get('is_correct', False),
                time_spent_seconds=q.get('time_spent_seconds', 0),
                difficulty=q.get('difficulty', 'medium')
            )
            self.questions.append(question)
        
        logger.info(f"Loaded {len(self.questions)} questions for {self.exam_type}")

    def analyze_errors(self) -> Dict[str, TopicAnalysis]:
        """
        Analyze errors by Subject → Topic → Subtopic.
        Detects mistake patterns and calculates accuracy.
        """
        topic_data: Dict[str, Dict] = {}
        
        for question in self.questions:
            topic_key = f"{question.subject}:{question.topic}"
            
            if topic_key not in topic_data:
                topic_data[topic_key] = {
                    'subject': question.subject,
                    'topic': question.topic,
                    'subtopics': {},
                    'total': 0,
                    'correct': 0,
                    'time_spent': 0,
                    'errors': []
                }
            
            topic_data[topic_key]['total'] += 1
            topic_data[topic_key]['time_spent'] += question.time_spent_seconds
            
            if question.is_correct:
                topic_data[topic_key]['correct'] += 1
            else:
                topic_data[topic_key]['errors'].append(question)
            
            # Track subtopic
            subtopic_key = question.subtopic
            if subtopic_key not in topic_data[topic_key]['subtopics']:
                topic_data[topic_key]['subtopics'][subtopic_key] = {'total': 0, 'correct': 0}
            
            topic_data[topic_key]['subtopics'][subtopic_key]['total'] += 1
            if question.is_correct:
                topic_data[topic_key]['subtopics'][subtopic_key]['correct'] += 1
        
        # Convert to TopicAnalysis
        self.topic_analysis = {}
        
        for topic_key, data in topic_data.items():
            accuracy = (data['correct'] / data['total'] * 100) if data['total'] > 0 else 0
            avg_time = data['time_spent'] / data['total'] if data['total'] > 0 else 0
            
            # Classify strength
            if accuracy <= 40:
                strength = TopicStrength.VERY_WEAK
            elif accuracy <= 60:
                strength = TopicStrength.WEAK
            elif accuracy <= 75:
                strength = TopicStrength.MODERATE
            else:
                strength = TopicStrength.STRONG
            
            # Detect error patterns
            error_patterns = self._detect_patterns(data['errors'])
            
            analysis = TopicAnalysis(
                topic_name=data['topic'],
                subject=data['subject'],
                subtopics=data['subtopics'],
                total_questions=data['total'],
                correct_count=data['correct'],
                accuracy_percentage=accuracy,
                strength_level=strength,
                error_patterns=error_patterns,
                avg_time_per_question=avg_time
            )
            
            self.topic_analysis[topic_key] = analysis
        
        return self.topic_analysis

    def _detect_patterns(self, errors: List[Question]) -> List[ErrorPattern]:
        """Detect mistake patterns in errors"""
        patterns = []
        
        if not errors:
            return patterns
        
        # Time management issues
        slow = [e for e in errors if e.time_spent_seconds > 180]
        if len(slow) >= len(errors) * 0.3:
            patterns.append(ErrorPattern.TIME_MANAGEMENT)
        
        # Conceptual gaps (mostly hard questions wrong)
        hard_errors = [e for e in errors if e.difficulty == 'hard']
        if len(hard_errors) >= len(errors) * 0.5:
            patterns.append(ErrorPattern.CONCEPTUAL_GAP)
        
        # Calculation mistakes (formula-based topics)
        formula_topics = ['mechanics', 'thermodynamics', 'electrodynamics', 'calculus', 'physical chemistry']
        if any(ft in ' '.join([e.topic.lower() for e in errors]) for ft in formula_topics):
            patterns.append(ErrorPattern.CALCULATION_MISTAKE)
        
        return patterns[:3]

    def identify_weak_topics(self, max_topics: int = 10) -> List[TopicAnalysis]:
        """Identify weak topics prioritizing accuracy + exam weightage"""
        weak = []
        
        for topic_key, analysis in self.topic_analysis.items():
            if analysis.strength_level in [TopicStrength.VERY_WEAK, TopicStrength.WEAK]:
                weightage = self._get_weightage(analysis.subject, analysis.topic_name)
                priority = (100 - analysis.accuracy_percentage) * (weightage / 100)
                weak.append({'topic': analysis, 'priority': priority, 'weightage': weightage})
        
        weak.sort(key=lambda x: x['priority'], reverse=True)
        return [w['topic'] for w in weak[:max_topics]]

    def _get_weightage(self, subject: str, topic: str) -> float:
        """Get topic weightage for exam"""
        if self.exam_type in EXAM_WEIGHTAGE:
            return EXAM_WEIGHTAGE[self.exam_type].get(subject, {}).get(topic, 10)
        return 10

    def get_resources(self, weak_topics: List[TopicAnalysis]) -> Dict[str, List[StudyResource]]:
        """Get study materials from trusted sources only"""
        resources = {}
        
        topic_url_map = {
            "Thermodynamics": "thermodynamics",
            "Mechanics": "mechanics",
            "Electrodynamics": "electrodynamics",
            "Modern Physics": "modern-physics",
            "Organic Chemistry": "organic-chemistry",
            "Inorganic Chemistry": "inorganic-chemistry",
            "Physical Chemistry": "physical-chemistry",
            "Calculus": "calculus",
            "Integration": "integral-calculus",
            "Differentiation": "differential-calculus",
            "Algebra": "algebra",
            "Coordinate Geometry": "coordinate-geometry",
            "Current Electricity": "current-electricity",
            "Chemical Bonding": "chemical-bonding",
            "Human Physiology": "human-physiology",
            "Genetics": "genetics"
        }
        
        source_configs = [
            {"source": "Khan Academy", "base": "https://www.khanacademy.org/science", "type": "Video", "time": "15-20 min"},
            {"source": "Physics Wallah", "base": "https://www.pw.live/study", "type": "Video", "time": "25-30 min"},
            {"source": "Vedantu", "base": "https://www.vedantu.com", "type": "Notes", "time": "20 min"},
            {"source": "Unacademy", "base": "https://unacademy.com", "type": "Practice", "time": "30 min"}
        ]
        
        for topic in weak_topics:
            topic_name = topic.topic_name
            slug = topic_url_map.get(topic_name, topic_name.lower().replace(" ", "-"))
            
            resources[topic_name] = []
            for i, cfg in enumerate(source_configs[:3]):
                resources[topic_name].append(StudyResource(
                    topic=topic_name,
                    title=f"{topic_name} - {cfg['type']} Lesson",
                    source=cfg['source'],
                    resource_type=cfg['type'],
                    estimated_time=cfg['time'],
                    url=f"{cfg['base']}/{topic.subject.lower()}/{slug}"
                ))
        
        return resources

    def generate_7day_plan(
        self,
        weak_topics: List[TopicAnalysis],
        resources: Dict[str, List[StudyResource]]
    ) -> List[DayPlan]:
        """Generate personalized 7-day revision plan"""
        
        # Get subjects and topics
        subjects = list(set(t.subject for t in weak_topics)) or ["General"]
        topic_names = [t.topic_name for t in weak_topics]
        
        if not topic_names:
            topic_names = ["General Revision"]
        
        # Day themes
        day_themes = [
            ("Foundation Day", "Build conceptual foundations"),
            ("Deep Dive", "Intensive topic coverage"),
            ("Mixed Practice", "Combine multiple topics"),
            ("Focus Weak Areas", "Target weak topics"),
            ("Full Mock Test", "Simulate exam conditions"),
            ("Rapid Revision", "Quick review of all topics"),
            ("Final Prep", "Last minute tips & strategy")
        ]
        
        plan = []
        
        for day in range(1, 8):
            title, subtitle = day_themes[day - 1]
            focus_subject = subjects[(day - 1) % len(subjects)]
            topic = topic_names[(day - 1) % len(topic_names)]
            
            # Build activities
            if day == 1:
                activities = [
                    {"type": "Warm-up", "desc": "Quick basics review", "time": "15 min"},
                    {"type": "Concept Learning", "desc": f"Learn {topic} fundamentals", "time": "45 min"},
                    {"type": "Video Lecture", "desc": "Watch recommended video", "time": "30 min"},
                    {"type": "MCQ Practice", "desc": f"Solve 10 MCQs on {topic}", "time": "30 min"}
                ]
            elif day == 2:
                activities = [
                    {"type": "Quick Review", "desc": "Revise previous topic", "time": "15 min"},
                    {"type": "Deep Dive", "desc": f"Advanced {topic} concepts", "time": "60 min"},
                    {"type": "Practice", "desc": f"Solve 15 problems on {topic}", "time": "45 min"},
                    {"type": "Doubt Clearing", "desc": "Clear doubts", "time": "20 min"}
                ]
            elif day == 3:
                second = topic_names[(day) % len(topic_names)]
                activities = [
                    {"type": "Topic Review", "desc": f"Review {topic}", "time": "30 min"},
                    {"type": "Mixed Practice", "desc": f"Practice {topic} and {second}", "time": "60 min"},
                    {"type": "Error Analysis", "desc": "Analyze mistakes", "time": "30 min"},
                    {"type": "MCQ Test", "desc": "Topic-wise test", "time": "30 min"}
                ]
            elif day == 4:
                activities = [
                    {"type": "Focus Practice", "desc": f"Intensive {topic} practice", "time": "60 min"},
                    {"type": "Timer Practice", "desc": "Timed questions (2 min each)", "time": "30 min"},
                    {"type": "Formula Review", "desc": "Key formulas", "time": "20 min"},
                    {"type": "Quick Quiz", "desc": "10 quick MCQs", "time": "20 min"}
                ]
            elif day == 5:
                activities = [
                    {"type": "Mock Test", "desc": "Full 25Q practice test", "time": "75 min"},
                    {"type": "Analysis", "desc": "Analyze results", "time": "30 min"},
                    {"type": "Error Review", "desc": "Review mistakes", "time": "25 min"},
                    {"type": "Planning", "desc": "Plan next focus", "time": "10 min"}
                ]
            elif day == 6:
                activities = [
                    {"type": "Rapid Review", "desc": "Quick revision of weak topics", "time": "45 min"},
                    {"type": "Key Concepts", "desc": "Important formulas & concepts", "time": "30 min"},
                    {"type": "Previous Errors", "desc": "Review past mistakes", "time": "30 min"},
                    {"type": "Confidence", "desc": "Easy questions for confidence", "time": "20 min"}
                ]
            else:
                activities = [
                    {"type": "Light Review", "desc": "Relaxed key topics revision", "time": "30 min"},
                    {"type": "Formula Sheet", "desc": "Quick formula revision", "time": "20 min"},
                    {"type": "Strategy", "desc": "Exam tips & time management", "time": "20 min"},
                    {"type": "Rest", "desc": "Stay calm and prepared", "time": "10 min"}
                ]
            
            total_min = sum(int(a['time'].split()[0]) for a in activities)
            
            plan.append(DayPlan(
                day=day,
                title=title,
                focus_subject=focus_subject,
                topics=[topic],
                activities=activities,
                total_hours=round(total_min / 60, 2),
                mcq_practice=10 + (day * 2),
                expected_outcome=f"Improved understanding of {topic}"
            ))
        
        return plan

    def generate_report(
        self,
        mock_test_data: Dict[str, Any],
        student_name: str = "Student",
        ocr_text: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Generate complete analysis report.
        Handles missing OCR gracefully.
        """
        # Load data
        self.load_data(mock_test_data, student_name, ocr_text)
        
        # Analyze
        self.analyze_errors()
        
        # Get weak topics
        weak_topics = self.identify_weak_topics(max_topics=10)
        
        # Get resources
        resources = self.get_resources(weak_topics)
        
        # Generate plan
        plan = self.generate_7day_plan(weak_topics, resources)
        
        # Calculate stats
        total_q = len(self.questions)
        correct_q = sum(1 for q in self.questions if q.is_correct)
        accuracy = round(correct_q / total_q * 100, 1) if total_q > 0 else 0
        
        # Build report
        report = {
            "student": self.student_name,
            "exam": self.exam_type,
            "mock_test_id": self.mock_test_id,
            "data_status": "complete" if self.ocr_available else "partial_ocr",
            "accuracy_stats": {
                "total_questions": total_q,
                "correct_answers": correct_q,
                "accuracy_percentage": accuracy,
                "weak_topic_count": len(weak_topics)
            },
            "weak_topics": self._format_weak(weak_topics),
            "recommended_resources": self._format_resources(resources),
            "revision_plan_7_days": self._format_plan(plan),
            "human_readable": self._generate_summary(weak_topics, plan, accuracy)
        }
        
        return report

    def _format_weak(self, topics: List[TopicAnalysis]) -> List[Dict]:
        """Format weak topics for JSON"""
        return [{
            "topic": t.topic_name,
            "subject": t.subject,
            "accuracy": round(t.accuracy_percentage, 1),
            "strength": t.strength_level.value,
            "questions_count": t.total_questions,
            "error_patterns": [p.value for p in t.error_patterns]
        } for t in topics]

    def _format_resources(self, resources: Dict[str, List[StudyResource]]) -> Dict:
        """Format resources for JSON"""
        formatted = {}
        for topic, res_list in resources.items():
            formatted[topic] = [{
                "topic": r.topic,
                "title": r.title,
                "source": r.source,
                "type": r.resource_type,
                "time": r.estimated_time,
                "link": r.url
            } for r in res_list]
        return formatted

    def _format_plan(self, plan: List[DayPlan]) -> List[Dict]:
        """Format plan for JSON"""
        return [{
            "day": p.day,
            "title": p.title,
            "focus_subject": p.focus_subject,
            "topics": p.topics,
            "activities": p.activities,
            "total_hours": p.total_hours,
            "mcq_practice": p.mcq_practice,
            "expected_outcome": p.expected_outcome
        } for p in plan]

    def _generate_summary(
        self,
        weak_topics: List[TopicAnalysis],
        plan: List[DayPlan],
        accuracy: float
    ) -> str:
        """Generate student-friendly summary"""
        lines = [
            "📊 ANALYSIS SUMMARY",
            f"Hi {self.student_name}! Based on your {self.exam_type} mock test:",
            "",
            f"🎯 You scored {accuracy}% accuracy across {len(self.questions)} questions.",
            "",
            "⚠️ AREAS NEEDING IMPROVEMENT:"
        ]
        
        for i, t in enumerate(weak_topics[:5], 1):
            emoji = "🔴" if t.strength_level == TopicStrength.VERY_WEAK else "🟠"
            lines.append(f"  {emoji} {t.topic_name} ({t.subject}) - {t.accuracy_percentage:.0f}% accuracy")
        
        lines.extend([
            "",
            "📚 STUDY RESOURCES:",
            "We've recommended videos and notes from trusted sources like",
            "Khan Academy, Physics Wallah, Vedantu, and Unacademy.",
            "",
            "📅 7-DAY REVISION PLAN:",
            f"Day 1-2: Foundation building",
            f"Day 3-4: Practice & focus on weak areas",
            f"Day 5: Full mock test simulation",
            f"Day 6-7: Revision & final prep",
            "",
            "💡 STUDY TIPS:",
            "• Focus on topics with lowest accuracy first",
            "• Practice consistently every day",
            "• Use recommended resources for better understanding",
            "• Take breaks every 45 minutes during study",
            "",
            f"Best of luck, {self.student_name}! You've got this! 💪"
        ])
        
        return "\n".join(lines)


# Main API function
def analyze_and_plan(
    mock_test_data: Dict[str, Any],
    student_name: str = "Student",
    ocr_text: Optional[str] = None
) -> Dict[str, Any]:
    """
    Main entry point for the AI Study Agent.
    
    Handles missing OCR gracefully - continues with structured data.
    """
    agent = StudyAgent(exam_type=mock_test_data.get('exam_type', 'JEE Mains'))
    return agent.generate_report(mock_test_data, student_name, ocr_text)
