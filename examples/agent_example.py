"""
AI Study Agent - Complete Example
This file demonstrates the AI Agent with sample input data and shows
the complete analysis and revision plan generation.
"""

from services.study_agent import StudyAgent, analyze_and_plan

# ============================================================
# SAMPLE INPUT DATA - Mock Test Results
# ============================================================

SAMPLE_MOCK_TEST_DATA = {
    "student_id": "rahul_sharma_001",
    "exam_type": "JEE Mains",
    "questions": [
        # PHYSICS - Thermodynamics (Weak)
        {
            "question_id": "P1",
            "topic": "Thermodynamics",
            "subtopic": "Laws of Thermodynamics",
            "subject": "Physics",
            "correct_answer": "A",
            "student_answer": "B",
            "is_correct": False,
            "time_spent_seconds": 180,
            "difficulty": "medium"
        },
        {
            "question_id": "P2",
            "topic": "Thermodynamics",
            "subtopic": "Heat Transfer",
            "subject": "Physics",
            "correct_answer": "C",
            "student_answer": "D",
            "is_correct": False,
            "time_spent_seconds": 150,
            "difficulty": "medium"
        },
        {
            "question_id": "P3",
            "topic": "Thermodynamics",
            "subtopic": "Kinetic Theory",
            "subject": "Physics",
            "correct_answer": "A",
            "student_answer": "A",
            "is_correct": True,
            "time_spent_seconds": 90,
            "difficulty": "easy"
        },
        # PHYSICS - Electrodynamics (Strong)
        {
            "question_id": "P4",
            "topic": "Current Electricity",
            "subtopic": "Ohm's Law",
            "subject": "Physics",
            "correct_answer": "B",
            "student_answer": "B",
            "is_correct": True,
            "time_spent_seconds": 60,
            "difficulty": "easy"
        },
        {
            "question_id": "P5",
            "topic": "Current Electricity",
            "subtopic": "Circuit Analysis",
            "subject": "Physics",
            "correct_answer": "D",
            "student_answer": "D",
            "is_correct": True,
            "time_spent_seconds": 120,
            "difficulty": "hard"
        },
        # CHEMISTRY - Organic (Weak)
        {
            "question_id": "C1",
            "topic": "Organic Chemistry",
            "subtopic": "Reaction Mechanisms",
            "subject": "Chemistry",
            "correct_answer": "A",
            "student_answer": "C",
            "is_correct": False,
            "time_spent_seconds": 210,
            "difficulty": "hard"
        },
        {
            "question_id": "C2",
            "topic": "Organic Chemistry",
            "subtopic": "Isomerism",
            "subject": "Chemistry",
            "correct_answer": "B",
            "student_answer": "B",
            "is_correct": True,
            "time_spent_seconds": 100,
            "difficulty": "medium"
        },
        {
            "question_id": "C3",
            "topic": "Organic Chemistry",
            "subtopic": "Biomolecules",
            "subject": "Chemistry",
            "correct_answer": "C",
            "student_answer": "A",
            "is_correct": False,
            "time_spent_seconds": 180,
            "difficulty": "medium"
        },
        # CHEMISTRY - Inorganic (Moderate)
        {
            "question_id": "C4",
            "topic": "Chemical Bonding",
            "subtopic": "VSEPR Theory",
            "subject": "Chemistry",
            "correct_answer": "D",
            "student_answer": "D",
            "is_correct": True,
            "time_spent_seconds": 80,
            "difficulty": "easy"
        },
        {
            "question_id": "C5",
            "topic": "Chemical Bonding",
            "subtopic": "Molecular Orbital Theory",
            "subject": "Chemistry",
            "correct_answer": "A",
            "student_answer": "B",
            "is_correct": False,
            "time_spent_seconds": 200,
            "difficulty": "hard"
        },
        # MATHEMATICS - Calculus (Weak)
        {
            "question_id": "M1",
            "topic": "Integration",
            "subtopic": "Integration Methods",
            "subject": "Mathematics",
            "correct_answer": "B",
            "student_answer": "D",
            "is_correct": False,
            "time_spent_seconds": 240,
            "difficulty": "hard"
        },
        {
            "question_id": "M2",
            "topic": "Integration",
            "subtopic": "Definite Integrals",
            "subject": "Mathematics",
            "correct_answer": "C",
            "student_answer": "C",
            "is_correct": True,
            "time_spent_seconds": 150,
            "difficulty": "medium"
        },
        {
            "question_id": "M3",
            "topic": "Integration",
            "subtopic": "Applications",
            "subject": "Mathematics",
            "correct_answer": "A",
            "student_answer": "B",
            "is_correct": False,
            "time_spent_seconds": 180,
            "difficulty": "medium"
        },
        # MATHEMATICS - Algebra (Strong)
        {
            "question_id": "M4",
            "topic": "Quadratic Equations",
            "subtopic": "Nature of Roots",
            "subject": "Mathematics",
            "correct_answer": "D",
            "student_answer": "D",
            "is_correct": True,
            "time_spent_seconds": 45,
            "difficulty": "easy"
        },
        {
            "question_id": "M5",
            "topic": "Permutation & Combination",
            "subtopic": "Fundamental Principles",
            "subject": "Mathematics",
            "correct_answer": "B",
            "student_answer": "B",
            "is_correct": True,
            "time_spent_seconds": 90,
            "difficulty": "medium"
        }
    ]
}


def run_example():
    """Run the complete analysis example"""
    
    print("=" * 70)
    print("AI STUDY AGENT - COMPLETE ANALYSIS EXAMPLE")
    print("=" * 70)
    print()
    
    # Generate full report
    print("📊 Analyzing mock test results...")
    print()
    
    result = analyze_and_plan(SAMPLE_MOCK_TEST_DATA)
    
    # ============================================================
    # PART A: STRUCTURED JSON OUTPUT
    # ============================================================
    print("=" * 70)
    print("PART A: STRUCTURED JSON OUTPUT")
    print("=" * 70)
    print()
    
    import json
    
    # Summary
    print("📈 SUMMARY:")
    print(json.dumps(result["summary"], indent=2))
    print()
    
    # Weak Topics
    print("🎯 WEAK TOPICS:")
    for topic in result["weak_topics"]:
        print(f"  • {topic['topic']} ({topic['subject']})")
        print(f"    Accuracy: {topic['accuracy']}% - {topic['strength']}")
        if topic['error_patterns']:
            print(f"    Issues: {', '.join(topic['error_patterns'])}")
        print()
    
    # Study Resources
    print("📚 STUDY RESOURCES (Trusted Sources Only):")
    for topic_name, resources in result["study_resources"].items():
        print(f"\n  📖 {topic_name}:")
        for res in resources:
            print(f"    • {res['title']}")
            print(f"      Source: {res['source']} | Type: {res['type']}")
            print(f"      Time: {res['time']}")
            print(f"      Link: {res['link']}")
    print()
    
    # 7-Day Plan
    print("📅 7-DAY REVISION PLAN:")
    for day in result["revision_plan"]:
        print(f"\n  Day {day['day']}: {day['title']}")
        print(f"  Focus: {day['focus_subject']} - {', '.join(day['topics'])}")
        print(f"  Total Hours: {day['total_hours']} | MCQs: {day['mcq_practice']}")
        print("  Activities:")
        for activity in day["activities"]:
            print(f"    ✓ {activity['type']}: {activity['description']} ({activity['duration']})")
    
    print()
    print("=" * 70)
    print("PART B: HUMAN-READABLE SUMMARY")
    print("=" * 70)
    print()
    
    # Print human-readable summary
    print(result["human_readable"])
    
    print()
    print("=" * 70)
    print("✅ ANALYSIS COMPLETE!")
    print("=" * 70)


if __name__ == "__main__":
    run_example()
