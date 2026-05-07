/**
 * Smart Task Prioritizer — AI Service Integration Helper
 * Task 44: Typed wrapper functions for all Python FastAPI endpoints.
 * Handles errors, timeouts, and response parsing.
 */

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || "http://localhost:8000";
const AI_API_KEY = process.env.AI_SERVICE_API_KEY || "dev-api-key-change-in-production";
const DEFAULT_TIMEOUT = 15000; // 15 seconds

// ============================================================
// Types (matching Python Pydantic models)
// ============================================================

export interface PredictPriorityInput {
  title: string;
  category?: "WORK" | "STUDY" | "PERSONAL";
  priority?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  deadline?: string | null;
  estimated_duration?: number;
  energy_level?: "LOW" | "MEDIUM" | "HIGH";
  rescheduled_count?: number;
  days_since_creation?: number;
}

export interface PredictPriorityResult {
  priority_score: number;
  factors: Record<string, number>;
  recommendation: string;
}

export interface TaskForScheduling {
  id: string;
  title: string;
  category?: "WORK" | "STUDY" | "PERSONAL";
  priority?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  priority_score?: number | null;
  estimated_duration?: number;
  energy_level?: "LOW" | "MEDIUM" | "HIGH";
  deadline?: string | null;
}

export interface UserPreferences {
  work_start?: string;
  work_end?: string;
  break_duration?: number;
  timezone?: string;
}

export interface HabitDataPoint {
  productive_hours_start?: string | null;
  productive_hours_end?: string | null;
  avg_completion_speed?: number | null;
}

export interface GenerateScheduleInput {
  tasks: TaskForScheduling[];
  user_preferences?: UserPreferences;
  habit_data?: HabitDataPoint[];
  date: string;
}

export interface ScheduleBlock {
  taskId: string | null;
  startTime: string;
  endTime: string;
  type: "DEEP_WORK" | "MEETING" | "BREAK" | "PERSONAL";
  title?: string | null;
}

export interface GenerateScheduleResult {
  blocks: ScheduleBlock[];
  insights: string[];
}

export interface TaskCompletionRecord {
  completed_at: string;
  created_at: string;
  category: "WORK" | "STUDY" | "PERSONAL";
  estimated_duration: number;
  actual_duration?: number | null;
  energy_level: "LOW" | "MEDIUM" | "HIGH";
  hour_of_day: number;
  day_of_week: number;
}

export interface LearnHabitsResult {
  best_productive_hours: { start: string; end: string };
  avg_completion_speed: number;
  delay_patterns: Record<string, number>;
  productivity_clusters: Array<{
    cluster_id: number;
    size: number;
    avg_hour: number;
    avg_day: string;
    dominant_category: string;
  }>;
  insights: string[];
}

export interface TaskProcrastinationCheck {
  id: string;
  title: string;
  rescheduled_count?: number;
  days_since_creation?: number;
  estimated_duration?: number;
  status?: string;
}

export interface ProcrastinationResult {
  task_id: string;
  is_procrastinated: boolean;
  severity: "low" | "medium" | "high";
  nudge_message: string;
  suggestion: string;
}

export interface DetectProcrastinationResult {
  results: ProcrastinationResult[];
  overall_score: number;
}

export interface TaskForSummary {
  id: string;
  title: string;
  priority_score?: number | null;
  category?: "WORK" | "STUDY" | "PERSONAL";
  deadline?: string | null;
  estimated_duration?: number;
  energy_level?: "LOW" | "MEDIUM" | "HIGH";
}

export interface DailySummaryResult {
  top_tasks: Array<{
    id: string;
    title: string;
    priority_score: number | null;
    category: string;
    estimated_duration: number;
    energy_level: string;
  }>;
  best_work_window: { start: string; end: string };
  predicted_busy_zones: Array<{
    label: string;
    urgency: string;
    task_id: string;
  }>;
  motivation_message: string;
  total_estimated_minutes: number;
}

export interface BurnoutCheckInput {
  scheduled_hours: number;
  tasks_count?: number;
  consecutive_heavy_days?: number;
  avg_daily_hours_this_week?: number;
}

export interface BurnoutCheckResult {
  is_at_risk: boolean;
  risk_level: "none" | "low" | "medium" | "high";
  risk_score: number;
  message: string;
  suggestions: string[];
}

// ============================================================
// API Client
// ============================================================

class AIServiceError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public endpoint?: string
  ) {
    super(message);
    this.name = "AIServiceError";
  }
}

async function callAIService<T>(
  endpoint: string,
  body: unknown,
  timeout = DEFAULT_TIMEOUT
): Promise<T> {
  try {
    const response = await fetch(`${AI_SERVICE_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": AI_API_KEY,
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(timeout),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new AIServiceError(
        `AI service error: ${errorText}`,
        response.status,
        endpoint
      );
    }

    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof AIServiceError) throw error;

    if (error instanceof DOMException && error.name === "TimeoutError") {
      throw new AIServiceError(
        `AI service timeout after ${timeout}ms`,
        408,
        endpoint
      );
    }

    throw new AIServiceError(
      `Failed to reach AI service: ${error instanceof Error ? error.message : "Unknown error"}`,
      503,
      endpoint
    );
  }
}

// ============================================================
// Public API Functions
// ============================================================

/**
 * Predict priority score for a task (0–100).
 */
export async function predictPriority(
  input: PredictPriorityInput
): Promise<PredictPriorityResult> {
  return callAIService<PredictPriorityResult>("/predict-priority", input);
}

/**
 * Generate a smart daily schedule with energy-aware time blocking.
 */
export async function generateSchedule(
  input: GenerateScheduleInput
): Promise<GenerateScheduleResult> {
  return callAIService<GenerateScheduleResult>(
    "/generate-schedule",
    input,
    30000 // 30s timeout for schedule generation
  );
}

/**
 * Analyze historical completion data to discover productivity patterns.
 */
export async function learnHabits(
  records: TaskCompletionRecord[]
): Promise<LearnHabitsResult> {
  return callAIService<LearnHabitsResult>("/learn-habits", {
    completion_records: records,
  });
}

/**
 * Detect procrastination patterns and get nudge messages.
 */
export async function detectProcrastination(
  tasks: TaskProcrastinationCheck[]
): Promise<DetectProcrastinationResult> {
  return callAIService<DetectProcrastinationResult>("/detect-procrastination", {
    tasks,
  });
}

/**
 * Generate a daily briefing with top tasks and insights.
 */
export async function getDailySummary(input: {
  tasks: TaskForSummary[];
  habit_data?: HabitDataPoint[];
  scheduled_hours?: number;
  date: string;
}): Promise<DailySummaryResult> {
  return callAIService<DailySummaryResult>("/daily-summary", input);
}

/**
 * Check for burnout risk based on workload signals.
 */
export async function checkBurnout(
  input: BurnoutCheckInput
): Promise<BurnoutCheckResult> {
  return callAIService<BurnoutCheckResult>("/burnout-check", input);
}

/**
 * Health check — verify the AI service is running.
 */
export async function checkHealth(): Promise<{
  status: string;
  service: string;
  version: string;
}> {
  const response = await fetch(`${AI_SERVICE_URL}/health`, {
    signal: AbortSignal.timeout(5000),
  });
  return response.json();
}
