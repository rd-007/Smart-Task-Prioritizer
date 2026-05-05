"""
Task 39 — Habit Learning Engine
Uses K-Means clustering + statistical analysis on completion data.
"""

import numpy as np
from sklearn.cluster import KMeans
from collections import defaultdict
from models import (
    LearnHabitsRequest,
    LearnHabitsResponse,
    TaskCategory,
)


def learn_habits(request: LearnHabitsRequest) -> LearnHabitsResponse:
    """Analyze historical task completion data to discover productivity patterns."""

    records = request.completion_records

    if len(records) < 3:
        return LearnHabitsResponse(
            best_productive_hours={"start": "09:00", "end": "13:00"},
            avg_completion_speed=30.0,
            delay_patterns={},
            productivity_clusters=[],
            insights=["Not enough data yet. Complete more tasks to unlock habit insights!"],
        )

    # --- Best Productive Hours ---
    hours = [r.hour_of_day for r in records]
    hour_counts = defaultdict(int)
    for h in hours:
        hour_counts[h] += 1

    # Find the 3-hour window with most completions
    best_start = 9
    best_count = 0
    for start in range(6, 22):
        window_count = sum(hour_counts.get(start + i, 0) for i in range(3))
        if window_count > best_count:
            best_count = window_count
            best_start = start

    best_productive_hours = {
        "start": f"{best_start:02d}:00",
        "end": f"{min(best_start + 3, 23):02d}:00",
    }

    # --- Avg Completion Speed ---
    durations = []
    for r in records:
        if r.actual_duration is not None:
            durations.append(r.actual_duration)
        else:
            durations.append(r.estimated_duration)

    avg_completion_speed = round(float(np.mean(durations)), 1) if durations else 30.0

    # --- Delay Patterns by Category ---
    category_durations = defaultdict(list)
    for r in records:
        if r.actual_duration and r.estimated_duration:
            delay_ratio = r.actual_duration / max(r.estimated_duration, 1)
            category_durations[r.category.value].append(delay_ratio)

    delay_patterns = {
        cat: round(float(np.mean(ratios)), 2)
        for cat, ratios in category_durations.items()
    }

    # --- K-Means Clustering on Productivity Patterns ---
    productivity_clusters = []
    if len(records) >= 6:
        try:
            features = np.array([
                [r.hour_of_day, r.day_of_week, r.estimated_duration]
                for r in records
            ])

            n_clusters = min(3, len(records))
            kmeans = KMeans(n_clusters=n_clusters, random_state=42, n_init=10)
            labels = kmeans.fit_predict(features)

            for i in range(n_clusters):
                cluster_records = [r for r, l in zip(records, labels) if l == i]
                if cluster_records:
                    avg_hour = np.mean([r.hour_of_day for r in cluster_records])
                    avg_day = np.mean([r.day_of_week for r in cluster_records])
                    days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
                    productivity_clusters.append({
                        "cluster_id": i,
                        "size": len(cluster_records),
                        "avg_hour": round(float(avg_hour), 1),
                        "avg_day": days[int(round(avg_day))],
                        "dominant_category": max(
                            set(r.category.value for r in cluster_records),
                            key=lambda c: sum(1 for r in cluster_records if r.category.value == c)
                        ),
                    })
        except Exception:
            pass  # Clustering may fail with too few data points

    # --- Insights ---
    insights = []

    insights.append(
        f"Your most productive window is {best_productive_hours['start']}–{best_productive_hours['end']} "
        f"with {best_count} tasks typically completed."
    )

    insights.append(f"Average task completion time: {avg_completion_speed} minutes.")

    for cat, ratio in delay_patterns.items():
        if ratio > 1.5:
            insights.append(
                f"⚠️ {cat} tasks take {ratio}x longer than estimated. Consider adding buffer time."
            )
        elif ratio < 0.8:
            insights.append(
                f"✨ {cat} tasks are completed faster than estimated ({ratio}x). You're efficient here!"
            )

    if len(productivity_clusters) > 0:
        insights.append(
            f"Found {len(productivity_clusters)} distinct work patterns in your history."
        )

    return LearnHabitsResponse(
        best_productive_hours=best_productive_hours,
        avg_completion_speed=avg_completion_speed,
        delay_patterns=delay_patterns,
        productivity_clusters=productivity_clusters,
        insights=insights,
    )
