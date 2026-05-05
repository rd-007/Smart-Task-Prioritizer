"""
Task 38 — Greedy Schedule Generator with energy-aware time-block assignments.
"""

from models import (
    GenerateScheduleRequest,
    GenerateScheduleResponse,
    ScheduleBlockOutput,
    ScheduleBlockType,
    EnergyLevel,
)


def _parse_time(t: str) -> int:
    """Convert HH:mm to minutes since midnight."""
    h, m = t.split(":")
    return int(h) * 60 + int(m)


def _format_time(minutes: int) -> str:
    """Convert minutes since midnight to HH:mm."""
    return f"{minutes // 60:02d}:{minutes % 60:02d}"


def _get_peak_hours(habit_data: list) -> tuple[int, int]:
    """Determine user's peak productive hours from habit data."""
    if not habit_data:
        return (540, 780)  # Default: 09:00 - 13:00

    starts = []
    ends = []
    for h in habit_data:
        if h.productive_hours_start and h.productive_hours_end:
            starts.append(_parse_time(h.productive_hours_start))
            ends.append(_parse_time(h.productive_hours_end))

    if not starts:
        return (540, 780)

    return (int(sum(starts) / len(starts)), int(sum(ends) / len(ends)))


def _energy_score_at_time(current_time: int, peak_start: int, peak_end: int) -> str:
    """Determine energy level at a given time based on peak hours."""
    if peak_start <= current_time <= peak_end:
        return "HIGH"
    elif abs(current_time - peak_start) <= 60 or abs(current_time - peak_end) <= 60:
        return "MEDIUM"
    else:
        return "LOW"


def generate_schedule(request: GenerateScheduleRequest) -> GenerateScheduleResponse:
    """
    Greedy scheduler:
    1. Sort tasks by priority score (desc), with energy matching
    2. Place high-energy tasks during peak hours
    3. Insert breaks between blocks
    4. Respect work hour boundaries
    """

    work_start = _parse_time(request.user_preferences.work_start)
    work_end = _parse_time(request.user_preferences.work_end)
    break_dur = request.user_preferences.break_duration

    # Determine peak hours from habit data
    peak_start, peak_end = _get_peak_hours(request.habit_data)

    # Sort tasks: priority score desc, then deadline urgency
    tasks = sorted(
        request.tasks,
        key=lambda t: (t.priority_score or 50.0),
        reverse=True,
    )

    # Separate into energy buckets
    high_energy = [t for t in tasks if t.energy_level == EnergyLevel.HIGH]
    medium_energy = [t for t in tasks if t.energy_level == EnergyLevel.MEDIUM]
    low_energy = [t for t in tasks if t.energy_level == EnergyLevel.LOW]

    # Build schedule
    blocks: list[ScheduleBlockOutput] = []
    current_time = work_start
    scheduled_ids = set()
    insights = []

    # Phase 1: Schedule high-energy tasks during peak hours
    if peak_start >= work_start:
        # Fill pre-peak with low/medium energy tasks
        for task in low_energy + medium_energy:
            if current_time >= peak_start or current_time + task.estimated_duration > peak_start:
                break
            if task.id in scheduled_ids:
                continue

            end = current_time + task.estimated_duration
            blocks.append(ScheduleBlockOutput(
                taskId=task.id,
                startTime=_format_time(current_time),
                endTime=_format_time(end),
                type=ScheduleBlockType.DEEP_WORK,
                title=task.title,
            ))
            scheduled_ids.add(task.id)
            current_time = end + break_dur

    # Schedule high-energy tasks during peak
    current_time = max(current_time, peak_start)
    for task in high_energy:
        if task.id in scheduled_ids:
            continue
        if current_time + task.estimated_duration > work_end:
            break

        end = current_time + task.estimated_duration
        blocks.append(ScheduleBlockOutput(
            taskId=task.id,
            startTime=_format_time(current_time),
            endTime=_format_time(end),
            type=ScheduleBlockType.DEEP_WORK,
            title=task.title,
        ))
        scheduled_ids.add(task.id)
        current_time = end

        # Add break after deep work
        if current_time + break_dur < work_end:
            blocks.append(ScheduleBlockOutput(
                taskId=None,
                startTime=_format_time(current_time),
                endTime=_format_time(current_time + break_dur),
                type=ScheduleBlockType.BREAK,
                title="Break",
            ))
            current_time += break_dur

    # Phase 2: Fill remaining time with unscheduled tasks
    remaining = [t for t in tasks if t.id not in scheduled_ids]
    for task in remaining:
        if current_time + task.estimated_duration > work_end:
            break

        end = current_time + task.estimated_duration
        blocks.append(ScheduleBlockOutput(
            taskId=task.id,
            startTime=_format_time(current_time),
            endTime=_format_time(end),
            type=ScheduleBlockType.DEEP_WORK,
            title=task.title,
        ))
        scheduled_ids.add(task.id)
        current_time = end

        # Add break
        if current_time + break_dur < work_end:
            blocks.append(ScheduleBlockOutput(
                taskId=None,
                startTime=_format_time(current_time),
                endTime=_format_time(current_time + break_dur),
                type=ScheduleBlockType.BREAK,
                title="Break",
            ))
            current_time += break_dur

    # Generate insights
    total_work_mins = sum(
        t.estimated_duration for t in tasks if t.id in scheduled_ids
    )
    unscheduled = len(tasks) - len(scheduled_ids)

    insights.append(f"Scheduled {len(scheduled_ids)} of {len(tasks)} tasks ({total_work_mins} min of focused work).")

    if unscheduled > 0:
        insights.append(f"{unscheduled} tasks couldn't fit in today's work window. Consider extending your hours or deferring lower-priority tasks.")

    if peak_start < work_end:
        insights.append(f"Your peak productive hours are {_format_time(peak_start)}–{_format_time(peak_end)}. High-energy tasks are scheduled there.")

    return GenerateScheduleResponse(blocks=blocks, insights=insights)
