"""
Smart Task Prioritizer — AI Service
FastAPI backend for priority scoring, scheduling, and habit learning.
"""

from fastapi import FastAPI, Depends, HTTPException, Security
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import APIKeyHeader
import os

from models import (
    PredictPriorityRequest,
    PredictPriorityResponse,
    GenerateScheduleRequest,
    GenerateScheduleResponse,
    LearnHabitsRequest,
    LearnHabitsResponse,
    DetectProcrastinationRequest,
    DetectProcrastinationResponse,
    DailySummaryRequest,
    DailySummaryResponse,
    BurnoutCheckRequest,
    BurnoutCheckResponse,
)
from priority_engine import predict_priority
from schedule_engine import generate_schedule
from habit_engine import learn_habits

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


# ============================================================
# Task 37 — Priority Prediction
# ============================================================

@app.post("/predict-priority", response_model=PredictPriorityResponse)
async def predict_priority_endpoint(
    request: PredictPriorityRequest,
    api_key: str = Depends(verify_api_key),
):
    """Predict priority score for a task using Weighted Scoring Algorithm."""
    return predict_priority(request)


# ============================================================
# Task 38 — Schedule Generation
# ============================================================

@app.post("/generate-schedule", response_model=GenerateScheduleResponse)
async def generate_schedule_endpoint(
    request: GenerateScheduleRequest,
    api_key: str = Depends(verify_api_key),
):
    """Generate a smart daily schedule with energy-aware time blocking."""
    return generate_schedule(request)


# ============================================================
# Task 39 — Habit Learning
# ============================================================

@app.post("/learn-habits", response_model=LearnHabitsResponse)
async def learn_habits_endpoint(
    request: LearnHabitsRequest,
    api_key: str = Depends(verify_api_key),
):
    """Analyze user habits using K-Means clustering + time-series analysis."""
    return learn_habits(request)


# ============================================================
# Tasks 40–42 — Placeholder endpoints (next session)
# ============================================================

@app.post("/detect-procrastination")
async def detect_procrastination_endpoint(
    request: DetectProcrastinationRequest,
    api_key: str = Depends(verify_api_key),
):
    """Detect procrastination patterns. (To be implemented)"""
    return {"message": "Not yet implemented", "endpoint": "/detect-procrastination"}


@app.post("/daily-summary")
async def daily_summary_endpoint(
    request: DailySummaryRequest,
    api_key: str = Depends(verify_api_key),
):
    """Generate daily AI summary. (To be implemented)"""
    return {"message": "Not yet implemented", "endpoint": "/daily-summary"}


@app.post("/burnout-check")
async def burnout_check_endpoint(
    request: BurnoutCheckRequest,
    api_key: str = Depends(verify_api_key),
):
    """Check for burnout risk. (To be implemented)"""
    return {"message": "Not yet implemented", "endpoint": "/burnout-check"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
