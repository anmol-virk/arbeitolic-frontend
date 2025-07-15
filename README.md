# Arbeitolic (Task management Platform)

A full-stack task and project management platform using React, Express, MongoDB, and JWT auth, featuring advanced task filtering, project grouping and visual reporting with Chart.js.

---

## Login

**Guest**
Username: `tony@email.com`
Password: `tony123`

---
## Quick Start

```
git clone https://github.com/anmol-virk/arbeitolic-frontend.git
cd <arbeitolic-frontend>
npm install
npm start
```

---

## Technologies
- React JS
- Node JS
- Express
- MongoDB
- JWT

---

## Features
**Landing Page**
- List of all the Projects and their basic details with a sidebar to navigate further.
- Buttons to add new Task and Project.

**Task Details**
- View all the details of a Task(Status, Tags, Time to Complete, Team, Owners etc.)
- Edit Task details Button.

**Authentication**
- User SignIn through JWT auth.
- Routes are protected with JWT.

**Task List**
- View all the task.
- Filter them accordingly (filter by Owner, Team, Tags, Status, Project).

**Project View**
- Select any Project to see Tasks related to that Project.
- Filter them by Tag and Owner

**Team View**
- Select any Team to see Tasks related to that Team.
- Filter them by Tag and Owner and Status.

**Reports**
- See visual reporting of Total work-done in last week, total days of work-pending and tasks closed by Team, Owner or Project.

---

## API Reference

### ***GET /api/tasks***
List of all Tasks created by User.

### ***POST /api/tasks***
Create a new Task.

### ***GET /api/tasks/:id***
Get Task by ID and see their full details.

### ***PUT /api/tasks/:id***
Edit and Update a Task by its ID.

### ***GET /api/report/last-week***
To See visual reporting of Total work-done in last week

### ***GET /api/report/pending***
To See visual reporting of total pending days for all tasks

### ***GET /api/report/closed-tasks***
To See visual reporting of tasks closed grouped by team, owner, or project

---

## Contact

For bugs or feature request, please reach out to anmolthisside@gmail.com