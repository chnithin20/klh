import io
import re
import json
import logging
from PIL import Image
import pytesseract

logger = logging.getLogger(__name__)

def extract_text_from_image(image_data: bytes) -> str:
    """
    Extract text from image using Tesseract OCR.
    """
    try:
        image = Image.open(io.BytesIO(image_data))
        text = pytesseract.image_to_string(image)
        return text
    except Exception as e:
        logger.error(f"OCR extraction failed: {e}")
        raise Exception(f"Failed to extract text from image: {str(e)}")

def parse_omr_answers(text: str) -> dict:
    """
    Parse OMR answer sheet text to extract question numbers and answers.
    Expected formats:
    - Q1 A Q2 B Q3 C...
    - 1. A 2. B 3. C...
    - Question 1: A, Question 2: B...
    """
    results = {
        "answers": {},
        "total_questions": 0,
        "extracted_raw": text
    }
    
    # Pattern 1: Q1 A Q2 B Q3 C format
    pattern1 = r'[Qq](\d+)\s*([A-Da-d])'
    matches = re.findall(pattern1, text)
    for q_num, answer in matches:
        results["answers"][int(q_num)] = answer.upper()
    
    # Pattern 2: 1. A 2. B format  
    pattern2 = r'^(\d+)\.\s*([A-Da-d])'
    for line in text.split('\n'):
        match = re.search(pattern2, line.strip())
        if match:
            q_num, answer = match.groups()
            results["answers"][int(q_num)] = answer.upper()
    
    # Pattern 3: Question X: Y format
    pattern3 = r'[Qq]uestion\s*(\d+)[:\s]+([A-Da-d])'
    matches = re.findall(pattern3, text)
    for q_num, answer in matches:
        results["answers"][int(q_num)] = answer.upper()
    
    results["total_questions"] = len(results["answers"])
    return results

def calculate_score(extracted_answers: dict, correct_answers: dict) -> dict:
    """
    Calculate score based on extracted answers and correct answers.
    """
    correct = 0
    wrong = 0
    unanswered = 0
    total = len(correct_answers)
    
    for q_num, correct_ans in correct_answers.items():
        if q_num not in extracted_answers:
            unanswered += 1
        elif extracted_answers[q_num] == correct_ans:
            correct += 1
        else:
            wrong += 1
    
    score = (correct / total * 100) if total > 0 else 0
    
    return {
        "correct": correct,
        "wrong": wrong,
        "unanswered": unanswered,
        "total": total,
        "score": round(score, 2)
    }

def process_omr_image(image_data: bytes, exam_type: str = "JEE Mains") -> dict:
    """
    Main function to process OMR image and extract answers.
    """
    # Extract text from image
    text = extract_text_from_image(image_data)
    
    # Parse answers from extracted text
    extracted = parse_omr_answers(text)
    
    # Define correct answers for demo (in production, this would come from a database)
    # For JEE Mains sample
    correct_answers_demo = {
        1: "A", 2: "B", 3: "C", 4: "D", 5: "A",
        6: "B", 7: "C", 8: "D", 9: "A", 10: "B",
        11: "C", 12: "D", 13: "A", 14: "B", 15: "C",
        16: "D", 17: "A", 18: "B", 19: "C", 20: "D",
        21: "A", 22: "B", 23: "C", 24: "D", 25: "A"
    }
    
    # Calculate score
    score_result = calculate_score(extracted["answers"], correct_answers_demo)
    
    return {
        "success": True,
        "extracted_text": text,
        "answers": extracted["answers"],
        "total_questions": extracted["total_questions"],
        "score": score_result,
        "exam_type": exam_type,
        "message": f"Extracted {extracted['total_questions']} answers from image"
    }
