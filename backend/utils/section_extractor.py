import re

def cleanup_section_content(content: str) -> str:
    """
    Cleans up section content to ensure multi-line bullet points are merged properly.
    """
    lines = content.split('\n')
    cleaned_lines = []
    buffer = ""

    for line in lines:
        stripped = line.strip()
        if not stripped:  # skip empty lines
            continue
        if stripped.startswith('•'):  # New bullet point
            if buffer:
                cleaned_lines.append(buffer.strip())
            buffer = stripped  # Start new bullet
        else:
            buffer += " " + stripped  # Continue previous bullet

    if buffer:  # Add last buffer if exists
        cleaned_lines.append(buffer.strip())

    return '\n'.join(cleaned_lines)


def extract_sections(text: str) -> dict:
    """
    Extract structured sections from resume text and handle multi-line bullets.
    Only lines that contain solely a section header are considered headers.
    """
    # Define known section headers (add more variations if needed)
    section_headers = [
        'SUMMARY', 'PROFESSIONAL SUMMARY', 'EXPERIENCE', 'WORK EXPERIENCE', 'PROFESSIONAL EXPERIENCE',
        'EDUCATION', 'ACADEMIC PROJECTS', 'PROJECTS', 'SKILLS', 'TECHNICAL SKILLS',
        'CERTIFICATIONS', 'ACHIEVEMENTS'
    ]
    
    # Sort headers by descending length so longer headers are matched before their substrings
    sorted_headers = sorted(section_headers, key=len, reverse=True)
    
    # Build regex: match only if a header appears on a line by itself (with optional surrounding whitespace)
    pattern = r'^\s*(' + '|'.join(map(re.escape, sorted_headers)) + r')\s*$'
    regex = re.compile(pattern, re.IGNORECASE | re.MULTILINE)
    
    # Find all headers in the text
    matches = list(regex.finditer(text))
    
    sections = {}
    for i, match in enumerate(matches):
        header = match.group(1).upper().strip()
        start = match.end()
        end = matches[i + 1].start() if i + 1 < len(matches) else len(text)
        content = text[start:end].strip()
        cleaned_content = cleanup_section_content(content)
        sections[header] = cleaned_content

    # Ensure all defined headers are present; if a header wasn't found, mark it as 'N/A'
    final_sections = {header.lower(): sections.get(header.upper(), 'N/A') for header in section_headers}
    
    return final_sections
