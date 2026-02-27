from pydantic import BaseModel
from typing import List, Optional

class Topic(BaseModel):
    """Topic model matching frontend - includes score field"""
    name: str
    subject: str
    attempted: int
    correct: int
    score: Optional[float] = 0.0

class AnalyzeRequest(BaseModel):
    """Request body for analyze endpoint - matches frontend format exactly"""
    topics: List[Topic]
    exam: str

class ChatRequest(BaseModel):
    message: str
