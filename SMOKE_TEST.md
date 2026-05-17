# 🧪 Production Smoke Test Checklist

Run through these checks after each deployment to verify core functionality.

## Authentication
- [ ] Sign up with new account
- [ ] Sign in with existing account
- [ ] Sign out and verify redirect to login
- [ ] Protected routes redirect to sign-in when not authenticated

## Dashboard
- [ ] Dashboard loads with greeting and stat cards
- [ ] AI Priority Queue shows top tasks
- [ ] Productivity score and focus time display correctly
- [ ] Schedule timeline renders blocks
- [ ] AI Insights card visible

## Task Management
- [ ] Create a new task (all fields)
- [ ] Edit an existing task
- [ ] Mark task as complete (checkbox + strikethrough)
- [ ] Delete a task
- [ ] Task filters work (status, category, search)
- [ ] Sort by priority score and deadline

## Schedule
- [ ] Calendar page loads with date navigation
- [ ] "Generate Schedule" creates AI schedule blocks
- [ ] Fallback works when AI service is down
- [ ] Schedule summary sidebar shows correct stats

## AI Features
- [ ] AI Priorities page shows ranked queue
- [ ] "AI Says Do This Next" hero card renders
- [ ] Procrastination nudge banner appears for delayed tasks
- [ ] Burnout alert dialog triggers when overloaded
- [ ] Focus timer starts/pauses/resets correctly
- [ ] Timer auto-switches between focus and break

## Analytics & Habits
- [ ] Analytics page loads with 4 stat cards
- [ ] Charts render (completion, donut, on-time, heatmap)
- [ ] Habits page shows hourly productivity
- [ ] AI insights card visible

## Settings
- [ ] Profile fields editable
- [ ] Dark/Light/System theme toggle works
- [ ] Notification toggle switches function
- [ ] Save button shows loading state

## Mobile
- [ ] Bottom navigation visible on mobile
- [ ] Sidebar hidden on mobile, opens via hamburger
- [ ] All pages scroll correctly with bottom nav padding
- [ ] Touch targets are large enough (min 44px)

## Performance
- [ ] First Contentful Paint < 1.5s
- [ ] No layout shifts on page load
- [ ] Smooth animations (no jank)
- [ ] No console errors

## Dark Mode
- [ ] All pages render correctly in dark mode
- [ ] All pages render correctly in light mode
- [ ] No contrast issues with text
