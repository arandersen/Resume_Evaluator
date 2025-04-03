# AI Resume Analyzer (Backend)

## 📄 Project Overview

AI Resume Analyzer is a backend application that allows users to upload their resumes (PDF/DOCX), parse and extract key sections, and receive AI-generated feedback and analysis to improve their resumes for ATS (Applicant Tracking System) compatibility and recruiter preferences. All analyzed resumes are stored and can be retrieved for review.

---

## 🚀 Features

- **Upload Resume (PDF/DOCX)**
- **Parse and Extract Resume Sections** (Summary, Experience, Education, Skills, Projects, Certifications)
- **AI-based Resume Analysis** using Gemini API
- **Store Parsed Data in MongoDB**
- **Retrieve All Parsed Resumes**
- **Fully Dockerized Setup**

---

## 🛠️ Tech Stack

- **Backend Framework**: FastAPI (Python)
- **AI Service**: Gemini API
- **Database**: MongoDB (Dockerized)
- **Containerization**: Docker & Docker Compose

---

## 📦 Installation & Setup

### 1. **Clone the Repository**

```bash
git clone https://github.com/your-username/AI_Resume_Evaluator.git
cd AI_Resume_Evaluator
```

### 2. **Environment Setup**

Create a `.env` file in the `/backend` directory with the following content:

```ini
GEMINI_API_KEY=your-gemini-api-key
MONGO_URI=mongodb://mongodb:27017
```

> ⚠️ Replace `your-gemini-api-key` with your actual Gemini API key.

---

## 🐳 Dockerized Setup (Recommended)

### 1. **Run Backend and MongoDB using Docker Compose**

From the root directory:

```bash
docker-compose up --build
```

This will:

- Build and run FastAPI backend on `http://localhost:8000`
- Run MongoDB on `mongodb://localhost:27017`

### 2. **Access API Docs**

FastAPI Swagger UI available at:

```
http://localhost:8000/docs
```

### 3. **Access MongoDB**

- Connect using MongoDB Compass:
  
```
mongodb://localhost:27017
```

Database: `resume_analyzer`  
Collections: `parsed_resumes`

---

## ⚙️ Local Setup with Virtual Environment (Optional)

### 1. **Set up Virtual Environment**

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
```

### 2. **Install Dependencies**

```bash
pip install -r requirements.txt
```

### 3. **Run Backend**

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Ensure MongoDB is running either via Docker or locally.

---

## 📡 API Endpoints

### 1. **Health Check**

```http
GET /
```
_Response:_ `{ "message": "Smart Resume Analyzer API is working!" }`

### 2. **Upload and Parse Resume**

```http
POST /api/parse_resume/
```

- **Body (form-data):**
  - `file`: PDF or DOCX file

_Response:_
```json
{
  "filename": "resume.pdf",
  "sections": { ... },
  "ai_analysis": "AI-generated analysis",
  "preview_text": "First 500 chars of resume text"
}
```

### 3. **Retrieve All Parsed Resumes**

```http
GET /api/resumes/
```

_Response:_
```json
[
  {
    "filename": "resume.pdf",
    "sections": { ... },
    "ai_analysis": "..."
  }
]
```

---

## 🗄️ Project Structure

```bash
AI_Resume_Evaluator/
├── backend/
│   ├── api/
│   │   └── resume_routes.py  # API endpoints
│   ├── utils/
│   │   ├── file_parser.py    # PDF/DOCX parsing
│   │   └── section_extractor.py  # Section extraction
│   ├── services/
│   │   └── gemini_service.py  # AI analysis service
│   ├── main.py              # FastAPI app
│   ├── Dockerfile           # Backend Dockerfile
│   └── .env                 # Environment variables
├── docker-compose.yml       # Docker orchestration
└── README.md                # Project documentation
```

---

## ✅ Completed Steps

- [x] FastAPI Backend Setup
- [x] Resume Parsing (PDF/DOCX)
- [x] Section Extraction
- [x] Gemini AI Analysis
- [x] MongoDB Integration (Insert and Retrieve)
- [x] Dockerized Backend & Database
- [x] API Testing via Swagger UI
- [x] Error Handling (File Types, Parsing Errors)

---

## 🙌 Contributing

1. Fork this repository
2. Create a new branch (`git checkout -b feature-name`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature-name`)
5. Create a Pull Request

---

## 📬 Contact

For questions or support, contact:

- **Arthur Andersen**
- Email: arandersen@ucsd.edu
- LinkedIn: [LinkedIn Profile](#)

---

## ⚖️ License

MIT License

---

> ⭐ Don't forget to give this repo a star if you find it helpful!

