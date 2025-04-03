import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()  # Load API key from .env file

# Configure Gemini API
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

def analyze_resume_with_gemini(sections: dict) -> dict:
    """
    Send structured resume sections to Gemini and get analysis.
    """

    # Prepare a friendly, clear prompt for AI
    prompt = f"""
You are an AI resume analysis expert. Analyze the following resume and provide:

1. ATS Compatibility Score (out of 100)
2. Strengths and Weaknesses
3. Suggestions to improve the resume
4. Tailored advice if applying for a technical role

Resume Sections:

Summary:
{sections.get('summary', 'N/A')}

Experience:
{sections.get('experience', 'N/A')}

Skills:
{sections.get('skills', 'N/A')}

Education:
{sections.get('education', 'N/A')}

Projects:
{sections.get('projects', 'N/A')}

Be concise and organized in your feedback.
    """

    # Use Gemini 2.0 Flas free tier
    model = genai.GenerativeModel('gemini-2.0-flash')

    # Get response
    response = model.generate_content(prompt)

    # Return AI-generated response text
    return {"analysis": response.text}
