from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware

from google import genai
import os
import shutil
import pdfplumber


app = FastAPI()
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

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

def analyze_with_ai(text: str):
    try:
        prompt = f""" You are Athena, an AI assistant for finance and risk analytics.
        Analyze the following banking or risk-related document. 

        Return:
        1. document_type
        2. short_summary
        3. missing_sections
        4. risk_level (Low, Moderate, High)
        5. key_issues
        6. recommended_action

        Be concise. Return plain text with clear labels.

        Document:
        {text[:12000]}
        """ 
        response = client.models.generate_content(
            model = "gemini-2.5-flash",
            contents = prompt
        )

        return response.text 

    #debug
    except Exception as e:
        return f"AI analysis failed: {str(e)}"


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
            missing_sections.append(section)

    #completeness score
    total_sections = len(required_sections)
    found_count = len(found_sections)
    score = round((found_count / total_sections) * 100)

    #Sentinel alerts
    alerts = []

    if missing_sections:
        alerts.append(f"Missing sections: {', '.join(missing_sections)}")
    
    if score < 80:
        alerts.append("Document completeness is below recommended threshold")

    high_risk_terms = ["cautionary", "unsatisfactory", "unacceptable", "deteriorating", "weakening"]
    detected_risk_terms = []
    for term in high_risk_terms:
        if term in lower_text:
            detected_risk_terms.append(term)

    if detected_risk_terms:
        alerts.append(f"High-risk terms detected: {', '.join(detected_risk_terms)}")

    # Overall status
    if score >= 80 and len(detected_risk_terms) == 0:
        status = "Low Risk"
    elif score >= 60:
        status = "Needs Review"
    else:
        status = "High Risk"

    ai_result = analyze_with_ai(extracted_text)

    return {
    "filename": file.filename,
    "summary": {
        "completeness_score": score,
        "status": status,
        "found_sections": found_sections,
        "missing_sections": missing_sections
    },
    "sentinel": {
        "alerts": alerts
    },
    "ai_analysis": ai_result,
    "text_preview": extracted_text[:1000]
}