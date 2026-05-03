"""
Smart Task Prioritizer — AI Service
FastAPI backend for priority scoring, scheduling, and habit learning.
"""

from fastapi import FastAPI, Depends, HTTPException, Security
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import APIKeyHeader
import os

app = FastAPI(
    title="Smart Task Prioritizer AI Service",
    description="AI engine for priority scoring, smart scheduling, habit learning, and productivity insights.",
    version="0.1.0",
)

# --- CORS ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- API Key Auth ---
API_KEY = os.getenv("AI_SERVICE_API_KEY", "dev-api-key-change-in-production")
api_key_header = APIKeyHeader(name="X-API-Key", auto_error=False)


async def verify_api_key(api_key: str = Security(api_key_header)):
    if api_key != API_KEY:
        raise HTTPException(status_code=403, detail="Invalid API key")
    return api_key


# --- Health Check ---
@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "ai-engine", "version": "0.1.0"}


# --- Placeholder endpoints (to be implemented in Phase 5) ---

@app.post("/predict-priority")
async def predict_priority(api_key: str = Depends(verify_api_key)):
    """Predict priority score for a task. (Phase 5 - Task 37)"""
    return {"message": "Not yet implemented", "endpoint": "/predict-priority"}


@app.post("/generate-schedule")
async def generate_schedule(api_key: str = Depends(verify_api_key)):
    """Generate a smart daily schedule. (Phase 5 - Task 38)"""
    return {"message": "Not yet implemented", "endpoint": "/generate-schedule"}


@app.post("/learn-habits")
async def learn_habits(api_key: str = Depends(verify_api_key)):
    """Analyze user habits and productivity patterns. (Phase 5 - Task 39)"""
    return {"message": "Not yet implemented", "endpoint": "/learn-habits"}


@app.post("/detect-procrastination")
async def detect_procrastination(api_key: str = Depends(verify_api_key)):
    """Detect procrastination patterns. (Phase 5 - Task 40)"""
    return {"message": "Not yet implemented", "endpoint": "/detect-procrastination"}


@app.post("/daily-summary")
async def daily_summary(api_key: str = Depends(verify_api_key)):
    """Generate daily AI summary. (Phase 5 - Task 41)"""
    return {"message": "Not yet implemented", "endpoint": "/daily-summary"}


@app.post("/burnout-check")
async def burnout_check(api_key: str = Depends(verify_api_key)):
    """Check for burnout risk. (Phase 5 - Task 42)"""
    return {"message": "Not yet implemented", "endpoint": "/burnout-check"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
