# Base Python image
FROM python:3.9-slim

# Set work directory
WORKDIR /app

# Copy all backend files to /app inside container
COPY . .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Expose port
EXPOSE 8000

# Run FastAPI server
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
