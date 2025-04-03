from fastapi import APIRouter, UploadFile, File, HTTPException
import shutil
import os
from utils.file_parser import parse_pdf, parse_docx
from utils.section_extractor import extract_sections
from services.gemini_service import analyze_resume_with_gemini
from pymongo import MongoClient
from dotenv import load_dotenv
import os

router = APIRouter()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)  # Ensure uploads folder exists

# Load environment variables
load_dotenv()
MONGO_URI = os.getenv("MONGO_URI")
client = MongoClient(MONGO_URI)
db = client['resume_analyzer']
collection = db['parsed_resumes']

@router.post("/api/parse_resume/")
async def parse_resume(file: UploadFile = File(...)):
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file uploaded.")

    if not (file.filename.endswith(".pdf") or file.filename.endswith(".docx")):
        raise HTTPException(status_code=400, detail="Unsupported file type. Only PDF and DOCX allowed.")

    file_path = os.path.join(UPLOAD_DIR, file.filename)

    try:
        # Save uploaded file temporarily
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Detect file type and parse
        if file.filename.endswith(".pdf"):
            extracted_text = parse_pdf(file_path)
        elif file.filename.endswith(".docx"):
            extracted_text = parse_docx(file_path)

        # Extract sections
        sections = extract_sections(extracted_text)

        # Call Gemini to analyze sections
        gemini_response = analyze_resume_with_gemini(sections)

        # Save to MongoDB
        resume_data = {
            "filename": file.filename,
            "sections": sections,
            "ai_analysis": gemini_response['analysis']
        }
        collection.insert_one(resume_data)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")

    finally:
        # Clean up uploaded file
        if os.path.exists(file_path):
            os.remove(file_path)

    return {
        "filename": file.filename,
        "sections": sections,
        "ai_analysis": gemini_response['analysis'],
        "preview_text": extracted_text[:500]  # Optional preview
    }
