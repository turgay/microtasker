
# MicroTasker – Web App Specification

## **Project Summary**
MicroTasker is a **web-first productivity app** designed to help users capture micro-tasks quickly, refine them later, and execute them efficiently without feeling overwhelmed. The app focuses on replacing idle time (scrolling social media, waiting, etc.) with **tiny, meaningful tasks** that compound into big achievements over time. It is not just a task manager; it’s a **micro-tasking system** for consistent progress.

---

## **Core Principles**
- **Quick Capture → Plan → Execute** flow.
- Micro-tasks are small, lightweight, and actionable within a few minutes.
- The system encourages **daily progress** through small wins, not heavy planning.
- Easy for busy people to pick up and act in spare moments.

---

## **Primary Features**
### **1. Quick Capture**
- Ultra-fast way to add tasks with **minimum friction**.
- Add tasks via:
  - Text input (one line)
  - Optional: Voice input
- Default behavior: All new tasks go to **Backlog**.
- Optional categorization at capture, but not required.

---

### **2. Backlog (Formerly Inbox)**
- All open tasks live here (uncategorized or categorized).
- Filters:
  - Uncategorized
  - By Category (Read, Write, Speak, Learn, Pray, Break, Build)
  - By Priority
- From Backlog, user can **refine tasks**:
  - Assign Category
  - Add Time Estimate (2–5 min, 5–10 min, 10+ min)
  - Set Priority (High/Medium/Low)
  - Schedule (Today, Future Date)
  - Make it Recurring (Daily, Weekly, Custom)
- Tasks can remain unscheduled if the user doesn’t plan them yet.

---

### **3. Today Dashboard**
- Displays **only planned tasks for Today**.
- Sections:
  - **Quick Actions Bar**:
    - ✅ Complete
    - ➡ Defer +1 day
    - 📅 Move to Tomorrow
  - **Suggestions**:
    - Based on category, time estimate, or priority.
  - **Estimated Time Indicator**:
    - Shows total time for today’s planned tasks.
  - **Done Section**:
    - Completed tasks remain visible for dopamine hit (with Undo option).
- Tasks added today **without a date remain in Backlog**, not in Today Dashboard.

---

### **4. Planning**
- From Backlog, user can **plan tasks for today or any future date**.
- Drag & drop or quick action buttons (e.g., “Plan for Today”).
- User can **see all scheduled tasks for a specific day** in a calendar view.

---

### **5. Categories (Pillars)**
- Default categories: Read, Write, Speak, Learn, Pray, Break, Build.
- User can **filter tasks** by these categories.
- Categories used for:
  - **Suggestions**
  - **Progress Tracking**
- Categories are optional; tasks can remain general.

---

### **6. Progress & Analytics**
- Show user streaks for **planned tasks completed daily**.
- Simple **weekly summary** (e.g., tasks done, time spent, top category).
- Heatmap/calendar for task completion (optional, future feature).

---

## **Entities / Data Model**
### **Task**
```json
{
  "id": "uuid",
  "title": "string",
  "category": "Read | Write | Speak | Learn | Pray | Break | Build | null",
  "tags": ["string"],
  "completed": false,
  "repeat": "daily | weekly | custom | none",
  "time_estimate": "2-5 min | 5-10 min | 10+ min",
  "created_at": "timestamp",
  "due_date": "timestamp | optional",
  "priority": "high | medium | low | none"
}
```

### **Category (optional table)**
```json
{
  "name": "string",
  "icon": "string",
  "color": "string"
}
```

---

## **Core Workflow**
1. **Add task → Backlog**
2. **Refine task → Add category, estimate, schedule**
3. **Plan task → Assign Today or Future Date**
4. **Execute → Complete from Today Dashboard**
5. **Recurring tasks auto-reschedule**

---

## **UX Highlights**
- **Quick Capture Bar**: Always available.
- **Backlog**: All tasks visible; refine and schedule here.
- **Today Dashboard**:
  - Estimated time for today’s tasks.
  - Quick actions for defer, reschedule.
  - Done section for completed tasks (with Undo).
- **Progress Screen**:
  - Streaks, totals, and simple visuals.

---

## **Key Design Goals**
- **Ultra-simple and frictionless** for task addition.
- **Fast refinement** (one tap to categorize or schedule).
- **Not overwhelming** – focus on **micro tasks**, not big projects.
- **One-click execution**.

---
