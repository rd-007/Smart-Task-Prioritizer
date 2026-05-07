"""
Task 42 — Burnout Detection Engine
Evaluates workload signals and flags burnout risk with actionable suggestions.
"""

from models import (
    BurnoutCheckRequest,
    BurnoutCheckResponse,
)


def check_burnout(request: BurnoutCheckRequest) -> BurnoutCheckResponse:
    """
    Evaluate burnout risk from multiple signals:
    - Scheduled hours today
    - Number of tasks
    - Consecutive heavy days
    - Average daily hours this week
    """

    score = 0.0
    suggestions = []

    # --- Factor 1: Daily hours (max 35 points) ---
    if request.scheduled_hours >= 10:
        score += 35
        suggestions.append("You have 10+ hours scheduled. Remove or defer at least 2 low-priority tasks.")
    elif request.scheduled_hours >= 8:
        score += 25
        suggestions.append("Full 8-hour day ahead. Make sure to take proper breaks.")
    elif request.scheduled_hours >= 6:
        score += 15
    elif request.scheduled_hours >= 4:
        score += 8

    # --- Factor 2: Task count (max 25 points) ---
    if request.tasks_count >= 12:
        score += 25
        suggestions.append(f"You have {request.tasks_count} tasks today — that's a lot of context switching. Consider batching similar tasks.")
    elif request.tasks_count >= 8:
        score += 18
        suggestions.append("Lots of tasks today. Focus on your top 3-5 and defer the rest.")
    elif request.tasks_count >= 5:
        score += 10

    # --- Factor 3: Consecutive heavy days (max 25 points) ---
    if request.consecutive_heavy_days >= 5:
        score += 25
        suggestions.append(f"You've had {request.consecutive_heavy_days} consecutive heavy days. Schedule a lighter day or take a break.")
    elif request.consecutive_heavy_days >= 3:
        score += 18
        suggestions.append("Multiple heavy days in a row. Consider a recovery block tomorrow.")
    elif request.consecutive_heavy_days >= 2:
        score += 10

    # --- Factor 4: Weekly average (max 15 points) ---
    if request.avg_daily_hours_this_week >= 9:
        score += 15
        suggestions.append(f"Averaging {request.avg_daily_hours_this_week:.1f} hrs/day this week — above sustainable levels.")
    elif request.avg_daily_hours_this_week >= 7:
        score += 10
    elif request.avg_daily_hours_this_week >= 5:
        score += 5

    # Clamp score
    score = min(100.0, round(score, 1))

    # Determine risk level
    if score >= 70:
        risk_level = "high"
        message = "🔴 High burnout risk detected. Your workload is unsustainable. Please reduce your schedule and take a real break today."
    elif score >= 45:
        risk_level = "medium"
        message = "🟠 Moderate burnout risk. You're pushing hard — consider lightening tomorrow's load and adding recovery time."
    elif score >= 25:
        risk_level = "low"
        message = "🟡 Mild stress signals. You're managing well, but keep an eye on your energy levels."
    else:
        risk_level = "none"
        message = "🟢 Looking good! Your workload is sustainable. Keep up the healthy balance."
        suggestions = ["Keep maintaining this pace — it's working well for you."]

    return BurnoutCheckResponse(
        is_at_risk=score >= 45,
        risk_level=risk_level,
        risk_score=score,
        message=message,
        suggestions=suggestions,
    )
