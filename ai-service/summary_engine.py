"""
Task 41 — Daily Summary Generator
Produces a concise daily briefing: top tasks, best work window, busy zones.
"""

from datetime import datetime, timezone
from models import (
    DailySummaryRequest,
    DailySummaryResponse,
    EnergyLevel,
)


def _find_best_work_window(habit_data: list) -> dict:
    """Determine the best work window from habit data."""
    if not habit_data:
        return {"start": "09:00", "end": "12:00"}

    starts = []
    ends = []
    for h in habit_data:
        if h.productive_hours_start and h.productive_hours_end:
            starts.append(h.productive_hours_start)
            ends.append(h.productive_hours_end)

    if not starts:
        return {"start": "09:00", "end": "12:00"}

    # Use the most common start/end times
    from collections import Counter
    most_common_start = Counter(starts).most_common(1)[0][0]
    most_common_end = Counter(ends).most_common(1)[0][0]

    return {"start": most_common_start, "end": most_common_end}


def _predict_busy_zones(tasks: list) -> list[dict]:
    """Predict busy time zones based on deadlines and task density."""
    zones = []

    # Group by urgency
    urgent = [t for t in tasks if t.deadline]

    for task in urgent:
        try:
            deadline = datetime.fromisoformat(task.deadline.replace("Z", "+00:00"))
            now = datetime.now(timezone.utc)
            hours_left = (deadline - now).total_seconds() / 3600

            if 0 < hours_left <= 4:
                zones.append({
                    "label": f"🔴 Urgent: \"{task.title}\" due in {int(hours_left)}h",
                    "urgency": "critical",
                    "task_id": task.id,
                })
            elif 4 < hours_left <= 12:
                zones.append({
                    "label": f"🟠 Today: \"{task.title}\" due in {int(hours_left)}h",
                    "urgency": "high",
                    "task_id": task.id,
                })
            elif 12 < hours_left <= 24:
                zones.append({
                    "label": f"🟡 Soon: \"{task.title}\" due tomorrow",
                    "urgency": "medium",
                    "task_id": task.id,
                })
        except (ValueError, TypeError):
            continue

    return zones[:5]  # Cap at 5


def _get_motivation_message(task_count: int, total_minutes: int) -> str:
    """Generate a contextual motivation message."""
    if task_count == 0:
        return "🌿 Your plate is clear. Time to plan something meaningful or enjoy the calm."

    hours = total_minutes / 60

    if task_count <= 2 and hours <= 2:
        return "☀️ Light day ahead — you've got this. Knock them out and enjoy the rest!"
    elif task_count <= 5:
        return "💪 A productive day awaits. Focus on the top 3 and let momentum carry you."
    elif hours <= 6:
        return "🎯 Solid lineup today. Prioritize the urgent ones first, and take breaks."
    else:
        return "🧘 Packed schedule ahead. Remember: progress over perfection. Take it one task at a time."


def generate_daily_summary(request: DailySummaryRequest) -> DailySummaryResponse:
    """Generate a concise daily briefing."""

    tasks = request.tasks

    # --- Top 3 Tasks (by priority score) ---
    sorted_tasks = sorted(
        tasks,
        key=lambda t: (t.priority_score or 0),
        reverse=True,
    )

    top_tasks = []
    for t in sorted_tasks[:3]:
        top_tasks.append({
            "id": t.id,
            "title": t.title,
            "priority_score": t.priority_score,
            "category": t.category.value,
            "estimated_duration": t.estimated_duration,
            "energy_level": t.energy_level.value,
        })

    # --- Best Work Window ---
    best_window = _find_best_work_window(request.habit_data)

    # --- Predicted Busy Zones ---
    busy_zones = _predict_busy_zones(tasks)

    # --- Motivation ---
    total_minutes = sum(t.estimated_duration for t in tasks)
    motivation = _get_motivation_message(len(tasks), total_minutes)

    return DailySummaryResponse(
        top_tasks=top_tasks,
        best_work_window=best_window,
        predicted_busy_zones=busy_zones,
        motivation_message=motivation,
        total_estimated_minutes=total_minutes,
    )
