# MicroLearn LMS

MicroLearn LMS is a lightweight Learning Management System designed to help organizations deliver short, focused, and measurable corporate training. The platform supports Learning & Development teams in creating microlearning modules made up of lessons, quizzes, and learner reflections, while giving employees a flexible way to complete training without the burden of long-form courses.

The system centralizes training delivery, assignment, progress tracking, quiz performance, and analytics so organizations can better understand learning outcomes and improve workforce development with data-driven insights.

## Problem Statement

Many organizations invest heavily in employee training, but traditional long-form courses often lead to:

- Low training completion rates
- Poor knowledge retention
- Limited employee engagement
- Ineffective performance measurement
- Lack of actionable learning analytics
- High dependency on expensive third-party LMS platforms

MicroLearn LMS addresses these challenges with a cost-effective, scalable, and user-friendly microlearning platform.

## Project Goal

The goal of this project is to provide a secure and scalable platform that enables organizations to:

- Create and manage learning modules
- Deliver short-form learning content
- Assess knowledge through quizzes
- Capture learner reflections
- Assign training programs to employees
- Monitor learner progress and performance
- Generate actionable learning insights

## MVP Scope

### Included

- Authentication and authorization
- User management
- Learning module management
- Lesson management
- Quiz management
- Reflection submission
- Module assignment
- Progress tracking
- Analytics dashboard support

### Excluded

- AI features
- Certificates
- Badges
- Notifications
- Mobile application
- Department-based assignments
- Advanced reporting

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Tokens
- bcryptjs
- Multer
- Cloudinary
- Nodemon

## Project Structure

```text
.
+-- backend
|   +-- config
|   +-- controllers
|   +-- middleware
|   +-- models
|   +-- routes
|   +-- script
|   +-- services
|   +-- utils
|   +-- server.js
+-- package.json
+-- README.md
```

## Getting Started

### Prerequisites

- Node.js
- npm
- MongoDB
- Cloudinary 

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env` file in the project root:

### Run the Server

Development mode:

```bash
npm run dev
```

Production mode:

```bash
npm start
```

Seed an admin profile:

```bash
npm run seed:admin
```

The API runs on:

```text
http://localhost:5000
```

Health check:

```text
GET /api/health
```

## API Modules

The backend currently exposes routes for:

- Authentication: `/api/auth`
- Users: `/api/users`
- Modules: `/api/modules`
- Lessons: `/api/lessons`
- Quizzes: `/api/quizzes`
- Assignments: `/api/assignments`
- Progress: `/api/progress`
- Analytics: `/api/analytics`
- Departments: `/api/departments`
- Notifications: `/api/notifications`
- Badges: `/api/badges`
- Certificates: `/api/certificates`

Some routes, such as notifications, badges, certificates, and departments, may support future or extended functionality outside the stated MVP scope.

## Core Roles

- L&D Manager/Admin: creates modules, manages users, assigns learning content, and monitors learning outcomes.
- Employee/Learner: completes assigned modules, takes quizzes, submits reflections, and tracks personal progress.

## License

This project is licensed under the ISC License.
