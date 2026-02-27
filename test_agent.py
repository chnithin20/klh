from services.study_agent import analyze_and_plan
import json

# Test with sample data (simulating OCR-based input)
test_data = {
    'student_id': 'rahul_001',
    'exam_type': 'JEE Mains',
    'mock_test_id': 'MOCK_001',
    'questions': [
        # Physics - Thermodynamics (Weak)
        {'question_id': 'P1', 'topic': 'Thermodynamics', 'subtopic': 'Laws', 'subject': 'Physics', 'correct_answer': 'A', 'student_answer': 'B', 'is_correct': False, 'time_spent_seconds': 180, 'difficulty': 'medium'},
        {'question_id': 'P2', 'topic': 'Thermodynamics', 'subtopic': 'Heat Transfer', 'subject': 'Physics', 'correct_answer': 'C', 'student_answer': 'D', 'is_correct': False, 'time_spent_seconds': 150, 'difficulty': 'medium'},
        {'question_id': 'P3', 'topic': 'Thermodynamics', 'subtopic': 'Kinetic Theory', 'subject': 'Physics', 'correct_answer': 'A', 'student_answer': 'A', 'is_correct': True, 'time_spent_seconds': 90, 'difficulty': 'easy'},
        # Physics - Current Electricity (Strong)
        {'question_id': 'P4', 'topic': 'Current Electricity', 'subtopic': 'Ohms Law', 'subject': 'Physics', 'correct_answer': 'B', 'student_answer': 'B', 'is_correct': True, 'time_spent_seconds': 60, 'difficulty': 'easy'},
        {'question_id': 'P5', 'topic': 'Current Electricity', 'subtopic': 'Circuit', 'subject': 'Physics', 'correct_answer': 'D', 'student_answer': 'D', 'is_correct': True, 'time_spent_seconds': 120, 'difficulty': 'hard'},
        # Chemistry - Organic (Weak)
        {'question_id': 'C1', 'topic': 'Organic Chemistry', 'subtopic': 'Mechanisms', 'subject': 'Chemistry', 'correct_answer': 'A', 'student_answer': 'C', 'is_correct': False, 'time_spent_seconds': 210, 'difficulty': 'hard'},
        {'question_id': 'C2', 'topic': 'Organic Chemistry', 'subtopic': 'Isomerism', 'subject': 'Chemistry', 'correct_answer': 'B', 'student_answer': 'B', 'is_correct': True, 'time_spent_seconds': 100, 'difficulty': 'medium'},
        {'question_id': 'C3', 'topic': 'Organic Chemistry', 'subtopic': 'Biomolecules', 'subject': 'Chemistry', 'correct_answer': 'C', 'student_answer': 'A', 'is_correct': False, 'time_spent_seconds': 180, 'difficulty': 'medium'},
        # Chemistry - Inorganic (Moderate)
        {'question_id': 'C4', 'topic': 'Chemical Bonding', 'subtopic': 'VSEPR', 'subject': 'Chemistry', 'correct_answer': 'D', 'student_answer': 'D', 'is_correct': True, 'time_spent_seconds': 80, 'difficulty': 'easy'},
        # Mathematics - Calculus (Weak)
        {'question_id': 'M1', 'topic': 'Integration', 'subtopic': 'Methods', 'subject': 'Mathematics', 'correct_answer': 'B', 'student_answer': 'D', 'is_correct': False, 'time_spent_seconds': 240, 'difficulty': 'hard'},
        {'question_id': 'M2', 'topic': 'Integration', 'subtopic': 'Definite', 'subject': 'Mathematics', 'correct_answer': 'C', 'student_answer': 'C', 'is_correct': True, 'time_spent_seconds': 150, 'difficulty': 'medium'},
        # Mathematics - Algebra (Strong)
        {'question_id': 'M3', 'topic': 'Quadratic Equations', 'subtopic': 'Roots', 'subject': 'Mathematics', 'correct_answer': 'D', 'student_answer': 'D', 'is_correct': True, 'time_spent_seconds': 45, 'difficulty': 'easy'},
    ]
}

# Test with complete data
print("=" * 60)
print("TEST 1: Complete Data")
print("=" * 60)
result = analyze_and_plan(test_data, student_name="Rahul Sharma")
print(json.dumps(result, indent=2))

# Test with OCR failure (empty OCR text)
print("\n" + "=" * 60)
print("TEST 2: OCR Failed - Using Structured Data Only")
print("=" * 60)
result2 = analyze_and_plan(test_data, student_name="Priya Patel", ocr_text="")
print(f"OCR Status: {result2.get('data_status')}")
print(f"Student: {result2.get('student')}")
print(f"Weak Topics: {len(result2.get('weak_topics', []))}")
print(f"7-Day Plan: {len(result2.get('revision_plan_7_days', []))} days")
