# GanttPro — Task & Project Management

GanttPro is a web-based task management application built with Vue.js and Vuetify. It provides a Gantt chart for visualizing project timelines, tracking task progress, and managing tasks and subtasks from a centralized interface.

The application supports task creation, editing, deletion, deadline tracking, and CSV/Excel imports. Task data is stored locally in the browser, allowing projects to persist across page refreshes.

## Features

### Dashboard & Gantt Chart
- Visualize tasks and subtasks on a Gantt chart.
- View project schedules across a dynamically generated timeline.
- Identify the current date on the timeline.
- Visualize task progress using progress indicators.
- Distinguish between task statuses using different colors.
- Display overdue durations as striped extensions on the timeline.
- Automatically extend the timeline to accommodate task dates.

### Task Management
- Create, edit, and delete tasks.
- Add subtasks to existing tasks.
- Edit and delete subtasks independently.
- Set start dates, end dates, status, and progress.
- Automatically constrain subtask dates to their parent task's date range.
- Track task completion and overdue status.

### Status & Progress Tracking

Tasks support the following statuses:

| Status | Description |
|---|---|
| Not Started | Work has not begun. |
| In Progress | Work is underway. |
| Completed | Work has been completed. |
| Overdue | The deadline has passed and the task is incomplete. |

Progress is represented as a percentage from 0% to 100%. Completing a parent task also marks its subtasks as completed.

Overdue indicators distinguish tasks that have exceeded their deadlines. The application can retain the overdue indicator after a task is completed, making it possible to identify tasks that finished late.

### CSV & Excel Import
- Import tasks and subtasks from CSV and Excel files.
- Support for `.csv`, `.xlsx`, and `.xls` file formats.
- Organize subtasks under their corresponding parent tasks.
- Replace the current task list with imported data.
- Display imported tasks on the Tasks page and Gantt chart.

### Local Data Persistence
- Store task data using browser `localStorage`.
- Preserve tasks across page refreshes and browser restarts.
- Save changes made through task management and imports.

## Tech Stack

| Technology | Purpose |
|---|---|
| [Vue.js 3](https://vuejs.org/) | Frontend framework and reactive user interface |
| [Vite](https://vite.dev/) | Development server and build tool |
| [Vuetify](https://vuetifyjs.com/) | Material Design UI components |
| [Pinia](https://pinia.vuejs.org/) | Centralized state management |
| [Vue Router](https://router.vuejs.org/) | Navigation between application pages |
| [Material Design Icons](https://pictogrammers.com/library/mdi/) | Icons |
| [SheetJS (`xlsx`)](https://sheetjs.com/) | Reading CSV and Excel files |
| Browser `localStorage` | Local data persistence |

## Getting Started

### Prerequisites

Install the following before running the project:

- [Node.js](https://nodejs.org/) — preferably a current LTS release.
- npm, which is included with Node.js.
- Git (optional, for version control).

### Installation

1. Clone the repository or download the project files.

   ```bash
   git clone <repository-url>
   cd ganttpro
   ```

   Replace `<repository-url>` with your repository's URL.

2. Install dependencies.

   ```bash
   npm install
   ```

3. Start the development server.

   ```bash
   npm run dev
   ```

4. Open the local URL displayed in the terminal, usually:

   ```text
   http://localhost:5173
   ```

### Production Build

To create an optimized production build:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

## Importing Tasks

GanttPro reads task information from the first worksheet of an Excel workbook or from a CSV file.

The file must contain these column headers:

| Column | Required | Description |
|---|---|---|
| `Type` | Yes | Either `Task` or `Subtask` |
| `Name` | Yes | Name of the task or subtask |
| `Parent` | No | Name of the parent task for a subtask |
| `Start` | Yes | Start date in `YYYY-MM-DD` format |
| `End` | Yes | End date in `YYYY-MM-DD` format |
| `Status` | No | Task status |
| `Progress` | No | Progress percentage from 0 to 100 |

### Example CSV

Save the following as `tasks.csv`:

```csv
Type,Name,Parent,Start,End,Status,Progress
Task,Mobile App Development,,2026-10-01,2026-11-15,In Progress,45
Subtask,Requirement Analysis,Mobile App Development,2026-10-01,2026-10-07,Completed,100
Subtask,UI UX Design,Mobile App Development,2026-10-08,2026-10-18,Completed,100
Subtask,Frontend Development,Mobile App Development,2026-10-19,2026-11-02,In Progress,60
Subtask,Backend Integration,Mobile App Development,2026-11-03,2026-11-12,Not Started,0
Subtask,Final Review,Mobile App Development,2026-11-13,2026-11-15,Not Started,0
Task,User Authentication,,2026-10-05,2026-10-25,In Progress,70
Subtask,Login Screen,User Authentication,2026-10-05,2026-10-10,Completed,100
Subtask,Registration Screen,User Authentication,2026-10-11,2026-10-16,Completed,100
Subtask,Password Recovery,User Authentication,2026-10-17,2026-10-25,In Progress,40
Task,Database Setup,,2026-10-03,2026-10-14,Completed,100
Subtask,Database Schema,Database Setup,2026-10-03,2026-10-08,Completed,100
Subtask,Database Testing,Database Setup,2026-10-09,2026-10-14,Completed,100
Task,Testing and Deployment,,2026-11-10,2026-11-25,Not Started,0
Subtask,Functional Testing,Testing and Deployment,2026-11-10,2026-11-17,Not Started,0
Subtask,Performance Testing,Testing and Deployment,2026-11-18,2026-11-21,Not Started,0
Subtask,App Release,Testing and Deployment,2026-11-22,2026-11-25,Not Started,0
```

### Import Instructions

1. Prepare your CSV or Excel file using the column headers above.
2. Set `Type` to `Task` for parent tasks and `Subtask` for subtasks.
3. Leave `Parent` empty for parent tasks.
4. For subtasks, enter the exact name of the parent task in the `Parent` column.
5. Open GanttPro and navigate to the **Tasks** page.
6. Select the **Import** button and choose your file.

**Important:** Importing replaces the existing task list rather than merging with it.

### Main Components

- **`Dashboard.vue`** — Displays the Gantt chart, timeline, task bars, progress, and subtask creation controls.
- **`Tasks.vue`** — Provides the task list, editing controls, task and subtask management, and file import.
- **`TaskInfo.vue`** — Reserved for displaying detailed information about an individual task.
- **`taskStore.js`** — Centralizes task data and task-management operations using Pinia.
- **`router/index.js`** — Defines application routes and navigation.
- **`App.vue`** — Provides the main application layout and navigation drawer.
- **`main.js`** — Initializes Vue, Vuetify, Pinia, and Vue Router.

## Future Improvements

- Add task dependencies and milestone markers.
- Support nested subtasks at multiple levels.
- Add drag-and-drop task scheduling.
- Add search, filtering, and sorting.
- Implement project-level organization.
- Add user authentication and cloud synchronization.
- Introduce automatic backups and data recovery.
- Adding task information pages

## Objectives

- Building reactive interfaces using Vue.js.
- Designing layouts with Vuetify.
- Managing shared application state with Pinia.
- Implementing client-side routing with Vue Router.
- Working with dates and dynamically generated timelines.
- Creating reusable task-management operations.
- Reading spreadsheet files in a web application.
- Persisting structured data using browser storage.

## Screenshots

<img width="1919" height="960" alt="image" src="https://github.com/user-attachments/assets/39b41616-f5dc-49f1-8935-df7dfbe98ee3" />
<img width="1919" height="953" alt="image" src="https://github.com/user-attachments/assets/9154566d-2fad-4b9f-ba68-5586fb015d18" />
<img width="640" height="704" alt="image" src="https://github.com/user-attachments/assets/db7da958-1f6c-45a0-8d85-89eaad1b2893" />
