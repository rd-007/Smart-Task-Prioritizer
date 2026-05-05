"""
Task 37 — Weighted Scoring Algorithm for priority prediction.
Combines multiple signals into a 0–100 priority score.
"""

from datetime import datetime, timezone
from models import (
    PredictPriorityRequest,
    PredictPriorityResponse,
    TaskPriority,
    TaskCategory,
    EnergyLevel,
)

# Weight configuration (tunable)
WEIGHTS = {
    "deadline_urgency": 0.30,
    "user_priority": 0.20,
    "category_importance": 0.10,
    "duration_factor": 0.10,
    "energy_match": 0.05,
    "procrastination_penalty": 0.15,
    "aging_bonus": 0.10,
}


def _deadline_urgency_score(deadline_str: str | None) -> float:
    """Score 0–100 based on how close the deadline is. Closer = higher."""
    if not deadline_str:
        return 30.0  # No deadline → moderate baseline

    try:
        deadline = datetime.fromisoformat(deadline_str.replace("Z", "+00:00"))
        now = datetime.now(timezone.utc)
        hours_remaining = (deadline - now).total_seconds() / 3600

        if hours_remaining <= 0:
            return 100.0  # Overdue
        elif hours_remaining <= 6:
            return 95.0
        elif hours_remaining <= 24:
            return 85.0
        elif hours_remaining <= 48:
            return 70.0
        elif hours_remaining <= 72:
            return 55.0
        elif hours_remaining <= 168:  # 1 week
            return 40.0
        else:
            return 20.0
    except (ValueError, TypeError):
        return 30.0


def _user_priority_score(priority: TaskPriority) -> float:
    """Map user-set priority to score."""
    mapping = {
        TaskPriority.LOW: 20.0,
        TaskPriority.MEDIUM: 50.0,
        TaskPriority.HIGH: 80.0,
        TaskPriority.CRITICAL: 100.0,
    }
    return mapping.get(priority, 50.0)


def _category_score(category: TaskCategory) -> float:
    """Category-based importance weighting."""
    mapping = {
        TaskCategory.WORK: 70.0,
        TaskCategory.STUDY: 60.0,
        TaskCategory.PERSONAL: 40.0,
    }
    return mapping.get(category, 50.0)


def _duration_factor(estimated_duration: int) -> float:
    """Shorter tasks get a slight boost (quick wins). Longer tasks are weighted fairly."""
    if estimated_duration <= 15:
        return 75.0  # Quick win bonus
    elif estimated_duration <= 30:
        return 65.0
    elif estimated_duration <= 60:
        return 50.0
    elif estimated_duration <= 120:
        return 40.0
    else:
        return 30.0


def _energy_match_score(energy_level: EnergyLevel) -> float:
    """Higher energy tasks might need prime time → score them higher for scheduling priority."""
    mapping = {
        EnergyLevel.HIGH: 70.0,
        EnergyLevel.MEDIUM: 50.0,
        EnergyLevel.LOW: 35.0,
    }
    return mapping.get(energy_level, 50.0)


def _procrastination_penalty(rescheduled_count: int) -> float:
    """More reschedules → higher penalty → gets pushed up in priority."""
    if rescheduled_count == 0:
        return 0.0
    elif rescheduled_count == 1:
        return 30.0
    elif rescheduled_count == 2:
        return 55.0
    elif rescheduled_count == 3:
        return 75.0
    else:
        return 90.0


def _aging_bonus(days_since_creation: float) -> float:
    """Tasks that have been sitting around get a priority boost."""
    if days_since_creation <= 1:
        return 10.0
    elif days_since_creation <= 3:
        return 30.0
    elif days_since_creation <= 7:
        return 50.0
    elif days_since_creation <= 14:
        return 70.0
    else:
        return 85.0


def predict_priority(request: PredictPriorityRequest) -> PredictPriorityResponse:
    """Calculate weighted priority score from multiple factors."""

    factors = {
        "deadline_urgency": _deadline_urgency_score(request.deadline),
        "user_priority": _user_priority_score(request.priority),
        "category_importance": _category_score(request.category),
        "duration_factor": _duration_factor(request.estimated_duration),
        "energy_match": _energy_match_score(request.energy_level),
        "procrastination_penalty": _procrastination_penalty(request.rescheduled_count),
        "aging_bonus": _aging_bonus(request.days_since_creation),
    }

    # Weighted sum
    score = sum(
        factors[key] * WEIGHTS[key]
        for key in WEIGHTS
    )

    # Clamp to 0-100
    score = max(0.0, min(100.0, round(score, 2)))

    # Generate recommendation
    if score >= 80:
        recommendation = "🔴 Do this immediately — it's your top priority right now."
    elif score >= 60:
        recommendation = "🟠 High priority — schedule this in your next available focus block."
    elif score >= 40:
        recommendation = "🟡 Moderate priority — plan for later today or tomorrow."
    elif score >= 20:
        recommendation = "🟢 Low priority — can be deferred, but don't forget it."
    else:
        recommendation = "⚪ Minimal urgency — handle when you have free time."

    return PredictPriorityResponse(
        priority_score=score,
        factors={k: round(v, 1) for k, v in factors.items()},
        recommendation=recommendation,
    )
