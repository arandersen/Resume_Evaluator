from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.resume_routes import router as resume_router

app = FastAPI()

# Allow frontend to connect later
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Smart Resume Analyzer API is working!"}

# Include resume parsing route
app.include_router(resume_router)
