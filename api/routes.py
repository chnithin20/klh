from fastapi import APIRouter, HTTPException, UploadFile, File
from models.schemas import AnalyzeRequest, ChatRequest
from services.analyzer import analyze_topics
from services.gemini_service import generate_plan, chat_with_ai
from services.ocr_service import process_omr_image
from services.study_agent import analyze_and_plan
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()

# Static fallback plan data (used when Gemini API is unavailable)
FALLBACK_PLAN = [
    {"day": 1, "title": "Foundation Day", "focus": "Thermodynamics Basics", "tasks": ["Learn laws of thermodynamics", "Solve 10 MCQs", "Review formulas"], "time": "2 hours", "mcqs": 10, "color": "#ff6b35", "light": "rgba(255,107,53,0.08)"},
    {"day": 2, "title": "Deep Dive", "focus": "Organic Chemistry Fundamentals", "tasks": ["Study reaction mechanisms", "Practice named reactions", "Solve 8 MCQs"], "time": "2.5 hours", "mcqs": 8, "color": "#6c47ff", "light": "rgba(108,71,255,0.08)"},
    {"day": 3, "title": "Problem Solving", "focus": "Calculus Integration", "tasks": ["Learn integration techniques", "Practice problems", "Take quiz"], "time": "2 hours", "mcqs": 12, "color": "#00c896", "light": "rgba(0,200,150,0.08)"},
    {"day": 4, "title": "Mixed Practice", "focus": "Weak Topics Review", "tasks": ["Revise all weak topics", "Solve mixed MCQs", "Review mistakes"], "time": "3 hours", "mcqs": 15, "color": "#ff6b35", "light": "rgba(255,107,53,0.08)"},
    {"day": 5, "title": "Full Mock", "focus": "Simulate Exam", "tasks": ["Take full mock test", "Analyze results", "Note improvements"], "time": "3 hours", "mcqs": 25, "color": "#6c47ff", "light": "rgba(108,71,255,0.08)"},
    {"day": 6, "title": "Rapid Revision", "focus": "Quick Recap", "tasks": ["Quick revision of all topics", "Solve previous year questions", "Clarify doubts"], "time": "2 hours", "mcqs": 20, "color": "#00c896", "light": "rgba(0,200,150,0.08)"},
    {"day": 7, "title": "Final Prep", "focus": "Last Minute Tips", "tasks": ["Important formulas recap", "Stress management", "Exam strategy"], "time": "1.5 hours", "mcqs": 10, "color": "#ff6b35", "light": "rgba(255,107,53,0.08)"}
]

# Smart fallback responses for common questions
FALLBACK_RESPONSES = {
    "thermodynamics": "Thermodynamics is all about heat, work, and energy. Key concepts:\n\n• First Law: Energy can be transformed but not created/destroyed\n• Second Law: Entropy always increases in spontaneous processes\n• Key formulas: ΔU = Q - W, ΔH = ΔU + PΔV\n\nFocus on understanding the laws and practice problems involving heat capacity!",
    
    "carnot": "The Carnot cycle is an ideal reversible cycle:\n\n1. Isothermal Expansion (heat absorbed)\n2. Adiabatic Expansion (temp drops)\n3. Isothermal Compression (heat rejected)\n\nEfficiency = 1 - Tc/Th (cold temp / hot temp). It's the most efficient heat engine possible!",
    
    "organic": "Organic Chemistry tips:\n\n• Focus on reaction mechanisms (curly arrows!)\n• Know the functional groups and their properties\n• Practice named reactions: SN1, SN2, E1, E2\n\nStart with mechanism basics - electron flow is key!",
    
    "hours": "For JEE/NEET preparation, aim for:\n\n• 6-8 hours daily during study phase\n• Focus on weak topics first\n• Take short breaks every 45 minutes\n\nQuality over quantity - it's not about how long you study, but how effectively!",
    
    "practice": "Here are 3 practice tips:\n\n1. Start with easier questions to build confidence\n2. Time yourself - aim for 2 min per question\n3. Review mistakes immediately - don't let them accumulate\n\nConsistent practice is the key to success!",
    
    "default": "Great question! Here are some general tips:\n\n1. Focus on your weak topics first\n2. Practice regularly with mock tests\n3. Review mistakes and understand concepts\n4. Stay consistent with your study schedule\n\nKeep pushing forward - every step counts towards your goal! 💪"
}

def get_fallback_response(message):
    """Get a smart fallback response based on keywords."""
    lower = message.lower()
    
    if "thermodynamics" in lower or "thermo" in lower:
        return FALLBACK_RESPONSES["thermodynamics"]
    elif "carnot" in lower:
        return FALLBACK_RESPONSES["carnot"]
    elif "organic" in lower or "sn1" in lower or "sn2" in lower:
        return FALLBACK_RESPONSES["organic"]
    elif "hour" in lower or ("study" in lower and "how" in lower):
        return FALLBACK_RESPONSES["hours"]
    elif "practice" in lower or "question" in lower or "mcq" in lower:
        return FALLBACK_RESPONSES["practice"]
    else:
        return FALLBACK_RESPONSES["default"]

@router.post("/analyze")
def analyze(data: AnalyzeRequest):
    """
    Analyze topics endpoint
    """
    logger.info(f"Received analyze request with {len(data.topics)} topics for exam: {data.exam}")
    
    try:
        analysis = analyze_topics(data.topics)
        logger.info(f"Analysis result: {analysis}")
        return analysis
    except Exception as e:
        logger.error(f"Error in analyze endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/plan")
def plan(data: AnalyzeRequest):
    """
    Generate study plan endpoint
    """
    logger.info(f"Received plan request with {len(data.topics)} topics for exam: {data.exam}")
    
    try:
        analysis = analyze_topics(data.topics)
        
        try:
            plan = generate_plan(analysis["weak_topics"], data.exam)
            logger.info(f"Plan generated successfully from AI")
            return {"plan": plan}
        except Exception as e:
            logger.warning(f"Gemini API failed, using fallback plan: {str(e)}")
            return {"plan": FALLBACK_PLAN}
            
    except Exception as e:
        logger.error(f"Error in plan endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/chat")
def chat(data: ChatRequest):
    """
    Chat with AI endpoint
    """
    logger.info(f"Received chat request: {data.message}")
    
    try:
        reply = chat_with_ai(data.message)
        logger.info(f"Chat reply generated")
        return {"reply": reply}
    except Exception as e:
        logger.error(f"Error in chat endpoint: {str(e)}")
        # Use smart fallback based on message content
        fallback_reply = get_fallback_response(data.message)
        return {"reply": fallback_reply}

@router.post("/ocr")
async def ocr_upload(file: UploadFile = File(...), exam_type: str = "JEE Mains"):
    """
    OCR endpoint to extract answers from OMR/answer sheet images
    """
    logger.info(f"Received OCR request for file: {file.filename}")
    
    try:
        # Read the uploaded file
        image_data = await file.read()
        
        # Process the image
        result = process_omr_image(image_data, exam_type)
        logger.info(f"OCR processed successfully: {result.get('total_questions')} questions found")
        
        return result
        
    except Exception as e:
        logger.error(f"Error in OCR endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/ai-agent/analyze")
def ai_agent_analyze(data: AnalyzeRequest):
    """
    AI Agent endpoint - Full analysis with error patterns, weak topics,
    study resources from trusted sources, and 7-day personalized plan.
    """
    logger.info(f"Received AI Agent analyze request with {len(data.topics)} topics")
    
    try:
        # Convert to agent format
        questions_data = []
        for topic in data.topics:
            # Generate questions from topic data
            if topic.attempted > 0:
                is_correct = topic.correct > (topic.attempted / 2)
                questions_data.append({
                    "question_id": f"Q_{topic.name}",
                    "topic": topic.name,
                    "subtopic": "General",
                    "subject": topic.subject,
                    "correct_answer": "A",
                    "student_answer": "B" if not is_correct else "A",
                    "is_correct": is_correct,
                    "time_spent_seconds": topic.attempted * 60,
                    "difficulty": "medium"
                })
        
        agent_data = {
            "student_id": "student_001",
            "exam_type": data.exam,
            "questions": questions_data
        }
        
        # Generate full analysis report
        result = analyze_and_plan(agent_data)
        logger.info(f"AI Agent analysis complete")
        
        return result
        
    except Exception as e:
        logger.error(f"Error in AI Agent endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
