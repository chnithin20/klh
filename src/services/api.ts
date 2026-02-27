const API_BASE = '/api';

export interface Topic {
  name: string;
  subject: string;
  correct: number;
  attempted: number;
  score: number;
}

export interface AnalysisResult {
  weak_topics: Topic[];
  strong_topics: Topic[];
  overall_score: number;
}

export interface PlanDay {
  day: number;
  title: string;
  focus: string;
  tasks: string[];
  time: string;
  mcqs: number;
  color: string;
  light: string;
}

export interface AnalyzeRequest {
  topics: Topic[];
  exam: string;
}

export interface ChatRequest {
  message: string;
}

export interface OCRResult {
  success: boolean;
  extracted_text: string;
  answers: Record<number, string>;
  total_questions: number;
  score: {
    correct: number;
    wrong: number;
    unanswered: number;
    total: number;
    score: number;
  };
  exam_type: string;
  message: string;
}

/**
 * Helper function to log requests for debugging
 */
const logRequest = (endpoint: string, data: any) => {
  console.log(`[API] ${endpoint} request:`, JSON.stringify(data, null, 2));
};

/**
 * Helper function to handle responses
 */
const handleResponse = async (response: Response, endpoint: string) => {
  console.log(`[API] ${endpoint} response status:`, response.status);
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error(`[API] ${endpoint} error:`, errorText);
    throw new Error(`HTTP ${response.status}: ${errorText}`);
  }
  
  return response.json();
};

export const api = {
  /**
   * Analyze topics - sends student topics for AI analysis
   * 
   * JSON body format:
   * {
   *   "topics": [
   *     {"name": "Thermodynamics", "subject": "Physics", "attempted": 10, "correct": 6, "score": 60},
   *     ...
   *   ],
   *   "exam": "JEE Mains"
   * }
   */
  async analyze(data: AnalyzeRequest): Promise<AnalysisResult> {
    logRequest('/analyze', data);
    
    const response = await fetch(`${API_BASE}/analyze`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(data),
    });
    
    return handleResponse(response, '/analyze');
  },

  /**
   * Generate study plan - creates personalized 7-day plan
   * 
   * JSON body format (same as analyze):
   * {
   *   "topics": [...],
   *   "exam": "JEE Mains"
   * }
   */
  async generatePlan(data: AnalyzeRequest): Promise<{ plan: PlanDay[] }> {
    logRequest('/plan', data);
    
    const response = await fetch(`${API_BASE}/plan`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(data),
    });
    
    return handleResponse(response, '/plan');
  },

  /**
   * Chat with AI - sends message and gets AI response
   * 
   * JSON body format:
   * {
   *   "message": "Explain thermodynamics"
   * }
   */
  async chat(message: string): Promise<{ reply: string }> {
    const payload = { message };
    logRequest('/chat', payload);
    
    const response = await fetch(`${API_BASE}/chat`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload),
    });
    
    return handleResponse(response, '/chat');
  },

  /**
   * OCR - Upload OMR/answer sheet image to extract answers
   * 
   * Form data format:
   * - file: image file (PNG, JPG, JPEG)
   * - exam_type: string (optional, default: "JEE Mains")
   */
  async ocr(file: File, examType: string = "JEE Mains"): Promise<OCRResult> {
    console.log(`[API] /ocr request:`, file.name, examType);
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('exam_type', examType);
    
    const response = await fetch(`${API_BASE}/ocr`, {
      method: 'POST',
      body: formData,
    });
    
    return handleResponse(response, '/ocr');
  },
};
