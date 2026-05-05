"""
Pydantic models for request/response validation across all AI endpoints.
"""

from pydantic import BaseModel, Field
from typing import Optional
from enum import Enum


# ============================================================
# Enums (matching Prisma schema)
# ============================================================

class TaskCategory(str, Enum):
    WORK = "WORK"
    STUDY = "STUDY"
    PERSONAL = "PERSONAL"


class TaskPriority(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"


class EnergyLevel(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"


class ScheduleBlockType(str, Enum):
    DEEP_WORK = "DEEP_WORK"
    MEETING = "MEETING"
    BREAK = "BREAK"
    PERSONAL = "PERSONAL"


# ============================================================
# /predict-priority
# ============================================================

class PredictPriorityRequest(BaseModel):
    title: str
    category: TaskCategory = TaskCategory.PERSONAL
    priority: TaskPriority = TaskPriority.MEDIUM
    deadline: Optional[str] = None  # ISO datetime string
    estimated_duration: int = Field(default=30, ge=1, description="Minutes")
    energy_level: EnergyLevel = EnergyLevel.MEDIUM
    rescheduled_count: int = Field(default=0, ge=0)
    days_since_creation: float = Field(default=0, ge=0)


class PredictPriorityResponse(BaseModel):
    priority_score: float = Field(ge=0, le=100)
    factors: dict
    recommendation: str


# ============================================================
# /generate-schedule
# ============================================================

class TaskForScheduling(BaseModel):
    id: str
    title: str
    category: TaskCategory = TaskCategory.PERSONAL
    priority: TaskPriority = TaskPriority.MEDIUM
    priority_score: Optional[float] = None
    estimated_duration: int = Field(default=30, ge=1)
    energy_level: EnergyLevel = EnergyLevel.MEDIUM
    deadline: Optional[str] = None


class UserPreferences(BaseModel):
    work_start: str = "09:00"
    work_end: str = "17:00"
    break_duration: int = Field(default=15, ge=5)
    timezone: str = "UTC"


class HabitDataPoint(BaseModel):
    productive_hours_start: Optional[str] = None
    productive_hours_end: Optional[str] = None
    avg_completion_speed: Optional[float] = None


class GenerateScheduleRequest(BaseModel):
    tasks: list[TaskForScheduling]
    user_preferences: UserPreferences = UserPreferences()
    habit_data: list[HabitDataPoint] = []
    date: str  # YYYY-MM-DD


class ScheduleBlockOutput(BaseModel):
    task_id: Optional[str] = Field(default=None, alias="taskId")
    start_time: str = Field(alias="startTime")
    end_time: str = Field(alias="endTime")
    type: ScheduleBlockType = ScheduleBlockType.DEEP_WORK
    title: Optional[str] = None

    model_config = {"populate_by_name": True}


class GenerateScheduleResponse(BaseModel):
    blocks: list[ScheduleBlockOutput]
    insights: list[str] = []


# ============================================================
# /learn-habits
# ============================================================

class TaskCompletionRecord(BaseModel):
    completed_at: str  # ISO datetime
    created_at: str
    category: TaskCategory
    estimated_duration: int
    actual_duration: Optional[int] = None
    energy_level: EnergyLevel
    hour_of_day: int = Field(ge=0, le=23)
    day_of_week: int = Field(ge=0, le=6)  # 0=Monday


class LearnHabitsRequest(BaseModel):
    completion_records: list[TaskCompletionRecord]


class LearnHabitsResponse(BaseModel):
    best_productive_hours: dict  # {"start": "10:00", "end": "13:00"}
    avg_completion_speed: float  # minutes per task
    delay_patterns: dict  # {"WORK": 2.1, "STUDY": 1.5, ...}
    productivity_clusters: list[dict]
    insights: list[str]


# ============================================================
# /detect-procrastination
# ============================================================

class TaskProcrastinationCheck(BaseModel):
    id: str
    title: str
    rescheduled_count: int = Field(default=0, ge=0)
    days_since_creation: float = Field(default=0, ge=0)
    estimated_duration: int = Field(default=30, ge=1)
    status: str = "TODO"


class DetectProcrastinationRequest(BaseModel):
    tasks: list[TaskProcrastinationCheck]


class ProcrastinationResult(BaseModel):
    task_id: str
    is_procrastinated: bool
    severity: str  # "low", "medium", "high"
    nudge_message: str
    suggestion: str


class DetectProcrastinationResponse(BaseModel):
    results: list[ProcrastinationResult]
    overall_score: float  # 0-100 (higher = more procrastination)


# ============================================================
# /daily-summary
# ============================================================

class TaskForSummary(BaseModel):
    id: str
    title: str
    priority_score: Optional[float] = None
    category: TaskCategory = TaskCategory.PERSONAL
    deadline: Optional[str] = None
    estimated_duration: int = 30
    energy_level: EnergyLevel = EnergyLevel.MEDIUM


class DailySummaryRequest(BaseModel):
    tasks: list[TaskForSummary]
    habit_data: list[HabitDataPoint] = []
    scheduled_hours: float = 0
    date: str


class DailySummaryResponse(BaseModel):
    top_tasks: list[dict]
    best_work_window: dict  # {"start": "10:00", "end": "13:00"}
    predicted_busy_zones: list[dict]
    motivation_message: str
    total_estimated_minutes: int


# ============================================================
# /burnout-check
# ============================================================

class BurnoutCheckRequest(BaseModel):
    scheduled_hours: float = Field(ge=0)
    tasks_count: int = Field(default=0, ge=0)
    consecutive_heavy_days: int = Field(default=0, ge=0)
    avg_daily_hours_this_week: float = Field(default=0, ge=0)


class BurnoutCheckResponse(BaseModel):
    is_at_risk: bool
    risk_level: str  # "none", "low", "medium", "high"
    risk_score: float  # 0-100
    message: str
    suggestions: list[str]
