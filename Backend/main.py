from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import os
import shutil
import pdfplumber

app = FastAPI()

# Allow frontend to connect later
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.get("/")
def home():
    return {"message": "Athena backend is running"}

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)

    #save file
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    #extract file
    extracted_text = ""

    with pdfplumber.open(file_path) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                extracted_text += page_text + "\n"

    # Required sections for validation
    required_sections = [
        "Financial",
        "Security",
        "Management",
        "Environmental",
        "Risk Rating"
    ]

    found_sections = []
    missing_sections = []

    lower_text = extracted_text.lower()

    for section in required_sections:
        if section.lower() in lower_text:
            found_sections.append(section)
        else:
            mising_sections.append(section)

    return {
        "filename": file.filename,
        "message": "File uploaded, processed, and validated",
        "found_sections": found_sections,
        "missing_sections": missing_sections,
        #"path": file_path,
        "text_preview": extracted_text[:1000] 
    }