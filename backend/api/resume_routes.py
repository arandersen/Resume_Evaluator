from fastapi import APIRouter, UploadFile, File
import shutil
import os
from utils.file_parser import parse_pdf, parse_docx
from utils.section_extractor import extract_sections
from services.gemini_service import analyze_resume_with_gemini  # Import the Gemini service
from pymongo import MongoClient
from dotenv import load_dotenv

# Load env vars
load_dotenv()

router = APIRouter()

# MongoDB connection
client = MongoClient(os.getenv("MONGO_URI"))
db = client['resume_analyzer']
collection = db['parsed_resumes']

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/api/parse_resume/")
async def parse_resume(file: UploadFile = File(...)):
    file_path = os.path.join(UPLOAD_DIR, file.filename)

    # Save uploaded file temporarily
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Detect file type and parse
    if file.filename.endswith(".pdf"):
        extracted_text = parse_pdf(file_path)
    elif file.filename.endswith(".docx"):
        extracted_text = parse_docx(file_path)
    else:
        return {"error": "Unsupported file type. Only PDF and DOCX allowed."}

    # Clean up uploaded file
    os.remove(file_path)

    # Extract sections
    sections = extract_sections(extracted_text)

    # Call Gemini to analyze sections
    gemini_response = analyze_resume_with_gemini(sections)

    # Prepare data to insert
    resume_data = {
        "filename": file.filename,
        "sections": sections,
        "ai_analysis": gemini_response['analysis'],
    }

    # Insert into MongoDB
    collection.insert_one(resume_data)
    print(f"Inserted resume for {file.filename} into MongoDB")

    return {
        "filename": file.filename,
        "sections": sections,
        "ai_analysis": gemini_response['analysis'],
        "preview_text": extracted_text[:500]  # Optional preview
    }
    
@router.get("/api/resumes/")
def get_resumes():
    try:
        resumes = list(collection.find({}, {"_id": 0}))  # Exclude _id for frontend use
        return {"resumes": resumes}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching resumes: {str(e)}")

