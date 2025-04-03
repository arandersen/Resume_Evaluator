import fitz  # PyMuPDF
from docx import Document

# --------- PDF Parsing ---------
def parse_pdf(file_path: str) -> str:
    """Extract text from PDF file."""
    text = ""
    try:
        doc = fitz.open(file_path)
        for page in doc:
            text += page.get_text()
        doc.close()
    except Exception as e:
        print(f"Error reading PDF: {e}")
    return text


# --------- DOCX Parsing ---------
def parse_docx(file_path: str) -> str:
    """Extract text from DOCX file."""
    text = ""
    try:
        doc = Document(file_path)
        for para in doc.paragraphs:
            text += para.text + "\n"
    except Exception as e:
        print(f"Error reading DOCX: {e}")
    return text
