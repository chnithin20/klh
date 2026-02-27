# ExamCoach AI - Personalized Entrance Exam Coach

A full-stack web application for personalized exam preparation with interactive AI coaching, progress tracking, and detailed performance analysis.

![ExamCoach](https://img.shields.io/badge/ExamCoach-v1.0-blue)
![React](https://img.shields.io/badge/React-v18.2-blue)
![Flask](https://img.shields.io/badge/Flask-v2.3-green)
![Python](https://img.shields.io/badge/Python-3.7+-blue)

## Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [File Structure](#file-structure)
- [API Documentation](#api-documentation)
- [Frontend Components](#frontend-components)
- [Design Features](#design-features)
- [Future Enhancements](#future-enhancements)

## Features

### Frontend (React.js)
- **Interactive Chat Interface**: AI-powered exam coach for personalized guidance
- **Dashboard**: Comprehensive overview of exam preparation progress
- **Progress Tracking**: Real-time progress bars and metrics
- **Performance Analysis**: Detailed analysis of weak areas and strengths
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Modern UI**: Professional gradient design with smooth animations

### Backend (Python/Flask)
- **RESTful API**: Clean and scalable API architecture
- **Exam Management**: CRUD operations for exams
- **Chat Service**: Real-time chat message handling
- **Analysis Engine**: Performance analysis and recommendations
- **CORS Enabled**: Secure cross-origin requests from frontend

## Project Structure

```
klh/
├── frontend/                    # React.js frontend
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── index.js
│   │   ├── App.js
│   │   ├── components/
│   │   │   ├── ChatLayout.js
│   │   │   ├── Sidebar.js
│   │   │   ├── ExamCard.js
│   │   │   ├── ProgressBar.js
│   │   │   └── AnalysisSection.js
│   │   ├── pages/
│   │   │   └── Dashboard.js
│   │   └── styles/
│   │       ├── index.css
│   │       ├── App.css
│   │       ├── Sidebar.css
│   │       ├── ChatLayout.css
│   │       ├── Dashboard.css
│   │       ├── ExamCard.css
│   │       ├── ProgressBar.css
│   │       └── Analysis.css
│   ├── package.json
│   ├── .gitignore
│   └── README.md
├── backend/                     # Python/Flask backend
│   ├── app.py                   # Main Flask application
│   ├── config.py                # Configuration settings
│   ├── requirements.txt          # Python dependencies
│   ├── .env                     # Environment variables
│   ├── api/
│   │   └── routes.py            # API endpoints
│   ├── models/
│   │   └── models.py            # Data models
│   ├── utils/
│   │   └── utils.py             # Utility functions
│   ├── __init__.py
│   ├── README.md
│   └── .gitignore
├── exam_coach_demo.html         # Original HTML design reference
├── README.md                    # This file
└── SETUP.md                     # Setup instructions
```

## Tech Stack

### Frontend
- **React** 18.2.0 - UI library
- **React Router** 6.8.0 - Navigation
- **Axios** 1.3.0 - HTTP client
- **CSS3** - Styling with Grid and Flexbox

### Backend
- **Flask** 2.3.0 - Web framework
- **Flask-CORS** 4.0.0 - Cross-origin support
- **Python** 3.7+ - Programming language

### DevOps
- **Node.js** - Frontend tooling
- **npm** - Package manager
- **pip** - Python package manager

## Installation

### Prerequisites

- Node.js 14+ and npm
- Python 3.7+
- Git

### Backend Setup

1. **Navigate to backend folder:**
```bash
cd backend
```

2. **Create virtual environment:**
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

3. **Install dependencies:**
```bash
pip install -r requirements.txt
```

4. **Configure environment:**
   Create or update `.env` file with your settings

### Frontend Setup

1. **Navigate to frontend folder:**
```bash
cd frontend
```

2. **Install dependencies:**
```bash
npm install
```

## Running the Application

### Start Backend Server

```bash
cd backend
python app.py
```

Backend will run on: `http://localhost:5000`

### Start Frontend Server

In a new terminal:

```bash
cd frontend
npm start
```

Frontend will run on: `http://localhost:3000`

The application will automatically open in your default browser.

## API Documentation

### Base URL
`http://localhost:5000/api`

### Endpoints

#### Exams
- `GET /exams` - List all exams
- `GET /exams/<id>` - Get specific exam
- `POST /exams` - Create new exam

#### Chat
- `POST /chat` - Send message
- `GET /chat/history` - Get chat history

#### Analysis
- `GET /analysis` - Get performance analysis

#### Progress
- `GET /progress` - Get overall progress

#### Health
- `GET /health` - API status

### Example Requests

**Get all exams:**
```bash
curl http://localhost:5000/api/exams
```

**Send chat message:**
```bash
curl -X POST http://localhost:5000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Help me with math"}'
```

## Frontend Components

### Sidebar
- Navigation menu with chat, dashboard, analysis options
- Logo and branding
- Responsive mobile navigation

### ChatLayout
- Message display area
- Input field for user messages
- Real-time message updates
- Auto-scrolling functionality
- Loading states

### Dashboard
- Progress overview
- Exam cards with individual tracking
- Performance statistics
- Analysis section

### ExamCard
- Exam information display
- Progress bar visualization
- Quick action buttons
- Hover animations

### ProgressBar
- Customizable progress indicator
- Label and percentage display
- Gradient visual effect

### AnalysisSection
- Weak areas display
- Strengths highlight
- Recommended topics
- Study time tracking

## Design Features

### Color Scheme
- Primary Gradient: #667eea to #764ba2 (Purple-Blue)
- Background: #f5f7fa to #c3cfe2 (Light Gray-Blue)
- Text: #333333 (Dark Gray)
- Accent: #999999 (Medium Gray)

### Typography
- System fonts for optimal performance
- Responsive font sizes
- Clear visual hierarchy

### Animations
- Smooth transitions (0.3s ease)
- Slide-in effects for messages
- Pulse animation for loading states
- Transform effects on hover

### Layout
- Flexbox for navigation
- CSS Grid for content layouts
- Mobile-first responsive design
- Fixed sidebar with flexible main content

## File Reference

**Frontend Files:**
- `src/App.js` - Main application component
- `src/components/ChatLayout.js` - Chat interface
- `src/components/Sidebar.js` - Navigation
- `src/pages/Dashboard.js` - Dashboard page
- `src/styles/*.css` - Component styling

**Backend Files:**
- `app.py` - Flask application entry point
- `api/routes.py` - API endpoint definitions
- `models/models.py` - Data structures
- `config.py` - Application configuration

## Troubleshooting

### Frontend Issues

**Port 3000 already in use:**
```bash
npx kill-port 3000
npm start
```

**CORS errors:**
- Ensure backend is running
- Check API_BASE_URL in App.js

### Backend Issues

**Port 5000 already in use:**
```bash
# Find and kill process on port 5000
```

**Import errors:**
```bash
pip install -r requirements.txt
```

## Development Workflow

1. **Make changes** to React components or Flask routes
2. **Test locally** with hot reload enabled
3. **Check API responses** in browser DevTools
4. **Commit changes** with meaningful messages
5. **Deploy** when ready

## Future Enhancements

- [ ] User authentication and authorization
- [ ] Database integration (SQLAlchemy/PostgreSQL)
- [ ] Real AI integration (GPT, LLM)
- [ ] Advanced analytics dashboard
- [ ] File upload support for study materials
- [ ] Multi-language support
- [ ] Dark mode theme
- [ ] Mobile app (React Native)
- [ ] Real-time notifications
- [ ] Collaborative features

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

MIT License - see LICENSE file for details

## Support

For issues, questions, or suggestions, please open an issue on GitHub or contact the development team.

---

**Version:** 1.0.0  
**Last Updated:** February 2026  
**Status:** Active Development
