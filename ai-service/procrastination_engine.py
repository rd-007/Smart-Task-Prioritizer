"""
Task 40 — Procrastination Detection Engine
Flags tasks showing procrastination patterns and generates nudge messages.
"""

from models import (
    DetectProcrastinationRequest,
    DetectProcrastinationResponse,
    ProcrastinationResult,
)


def _calculate_severity(rescheduled_count: int, days_since_creation: float) -> tuple[str, float]:
    """Calculate procrastination severity and a 0-100 score."""
    score = 0.0

    # Reschedule factor (max 60 points)
    if rescheduled_count >= 5:
        score += 60
    elif rescheduled_count >= 3:
        score += 45
    elif rescheduled_count >= 2:
        score += 30
    elif rescheduled_count >= 1:
        score += 15

    # Aging factor (max 40 points)
    if days_since_creation >= 14:
        score += 40
    elif days_since_creation >= 7:
        score += 30
    elif days_since_creation >= 3:
        score += 20
    elif days_since_creation >= 1:
        score += 10

    if score >= 70:
        return "high", score
    elif score >= 40:
        return "medium", score
    else:
        return "low", score


def _generate_nudge(title: str, severity: str, rescheduled_count: int, estimated_duration: int) -> tuple[str, str]:
    """Generate a personalized nudge message and actionable suggestion."""

    short_task = estimated_duration <= 15

    if severity == "high":
        nudge = f"You've delayed \"{title}\" {rescheduled_count} times. It's becoming a blocker — let's break the cycle today."
        if short_task:
            suggestion = f"This only takes ~{estimated_duration} min. Just start — you'll be done before you know it!"
        else:
            suggestion = f"Start with just 15 minutes. You don't have to finish — just begin."
    elif severity == "medium":
        nudge = f"\"{title}\" has been waiting for a while. A little momentum can go a long way."
        if short_task:
            suggestion = f"Quick win alert! Knock this out in {estimated_duration} minutes and feel the progress."
        else:
            suggestion = f"Try the 2-minute rule: commit to just 2 minutes. You'll likely keep going."
    else:
        nudge = f"\"{title}\" is still on your list. Consider scheduling it today."
        suggestion = "Block a specific time for this task to make sure it gets done."

    return nudge, suggestion


def detect_procrastination(request: DetectProcrastinationRequest) -> DetectProcrastinationResponse:
    """Analyze tasks for procrastination signals and generate nudges."""

    results = []
    total_score = 0.0

    for task in request.tasks:
        # Skip completed tasks
        if task.status == "DONE":
            continue

        severity, score = _calculate_severity(
            task.rescheduled_count,
            task.days_since_creation,
        )

        is_procrastinated = score >= 30  # Threshold for flagging

        nudge, suggestion = _generate_nudge(
            task.title,
            severity,
            task.rescheduled_count,
            task.estimated_duration,
        )

        results.append(ProcrastinationResult(
            task_id=task.id,
            is_procrastinated=is_procrastinated,
            severity=severity if is_procrastinated else "low",
            nudge_message=nudge if is_procrastinated else "",
            suggestion=suggestion if is_procrastinated else "",
        ))

        total_score += score

    # Overall procrastination score (average across all tasks)
    overall = round(total_score / max(len(results), 1), 1)

    return DetectProcrastinationResponse(
        results=results,
        overall_score=min(overall, 100.0),
    )
