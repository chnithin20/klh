import os
from google import genai
from config import settings
import logging

logger = logging.getLogger(__name__)

# Check if API key is available
if not settings.GEMINI_API_KEY:
    logger.warning("GEMINI_API_KEY not found in environment variables!")
    print("WARNING: GEMINI_API_KEY is not set. Please add it to backend/.env file")

# Create Gemini client (NEW SDK)
try:
    client = genai.Client(api_key=settings.GEMINI_API_KEY)
except Exception as e:
    logger.error(f"Failed to create Gemini client: {e}")
    client = None

# Use the correct stable model for the new Google GenAI SDK
# gemini-2.0-flash is the latest stable model that works with the new SDK
GEMINI_MODEL = "gemini-2.0-flash"


def generate_plan(weak_topics, exam):
    """
    Generate a personalized 7-day study plan using Gemini AI.
    Returns structured JSON data that the frontend can parse.
    """
    if not client:
        raise Exception("Gemini client not initialized - check API key")
    
    topics = ", ".join([t["name"] for t in weak_topics]) if weak_topics else "General revision"

    prompt = f"""You are an expert entrance exam coach for {exam}.

Generate a personalized 7-day revision plan based on these weak topics: {topics}

Return ONLY a valid JSON array (no other text) with exactly 7 objects, each having these keys:
- day: number (1-7)
- title: string (short day title)
- focus: string (main topic focus)
- tasks: array of strings (3-4 study tasks)
- time: string (e.g., "2 hours")
- mcqs: number (practice questions count)
- color: string (hex color like "#ff6b35")
- light: string (light rgba like "rgba(255,107,53,0.08)")

Example format:
[
  {{"day": 1, "title": "Foundation Day", "focus": "Topic Name", "tasks": ["Task 1", "Task 2"], "time": "2 hours", "mcqs": 10, "color": "#ff6b35", "light": "rgba(255,107,53,0.08)"}}
]

JSON:"""

    try:
        response = client.models.generate_content(
            model=GEMINI_MODEL,
            contents=prompt
        )
        
        # Extract the text response
        text = response.text
        
        # Try to parse as JSON
        import json
        import re
        
        # Look for array pattern [...]
        match = re.search(r'\[.*\]', text, re.DOTALL)
        if match:
            plan_data = json.loads(match.group())
            return plan_data
        else:
            # If no array found, try parsing whole response
            return json.loads(text)
    except Exception as e:
        logger.error(f"Error generating plan: {e}")
        raise Exception(f"Failed to generate plan: {str(e)}")


def chat_with_ai(message, weak_topics=None):
    """
    Chat with Gemini AI. Returns a text response.
    """
    if not client:
        raise Exception("Gemini client not initialized - check API key")
    
    context = ""
    if weak_topics:
        context = "Student weak topics: " + ", ".join([t["name"] for t in weak_topics])

    prompt = f"""{context}

You are a helpful AI exam coach. Answer the student's question clearly and concisely:

Student question: {message}

Provide a helpful, educational response."""

    try:
        response = client.models.generate_content(
            model=GEMINI_MODEL,
            contents=prompt
        )
        return response.text
    except Exception as e:
        logger.error(f"Error in chat: {e}")
        raise Exception(f"Failed to get chat response: {str(e)}")
