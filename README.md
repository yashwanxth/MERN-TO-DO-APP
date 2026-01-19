# MERN TO-DO APP – QuickTask

QuickTask is a full-stack task management application built as part of a **MERN + Python Backend Developer Technical Assessment**.  
It allows users to manage daily tasks efficiently and provides analytics on productivity and task completion trends.

---

## 🚀 Tech Stack

### Frontend
- React.js (Hooks)
- Axios
- Chart.js / Recharts (for analytics visualization)

### Backend
- Node.js
- Express.js
- MongoDB (MongoDB Atlas)
- JWT Authentication

### Analytics Service
- Python
- FastAPI
- PyMongo
- MongoDB Aggregation Framework

---

## 🧩 Project Structure

MERN-TO-DO-APP/
│
├── backend/ # Node.js + Express API
│ ├── src/
│ │ ├── controllers/
│ │ ├── middleware/
│ │ ├── models/
│ │ ├── routes/
│ │ └── services/
│ ├── server.js
│ ├── .env.example
│
├── analytics/ # Python Analytics Microservice
│ ├── app.py
│ ├── db.py
│ ├── routes/
│ ├── requirements.txt
│ ├── .env.example
│
├── frontend/ # React frontend (if applicable)
│
├── .gitignore
└── README.md


---

## 🔐 Features

### Authentication
- User registration and login
- JWT-based authentication
- Protected routes

### Task Management
- Create, update, delete tasks
- Task fields:
  - Title
  - Description
  - Priority (Low / Medium / High)
  - Status (Todo / In Progress / Completed)
  - Due date
- Search tasks by title
- Filter by status and priority
- Sort by:
  - Created date
  - Due date
  - Priority (High → Medium → Low)

### Dashboard & Analytics
- Total tasks
- Completed vs pending tasks
- Completion rate
- Priority distribution
- Productivity trends over time

---

## 🧠 Analytics Service Endpoints

### User Statistics

Returns:
- Total tasks
- Completed tasks
- Pending tasks
- Completion rate
- Priority distribution

### Productivity Analysis

Returns:
- Task completion trends over a given number of days

---

## ⚙️ Environment Variables

### Backend (`backend/.env.example`)
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/quicktask
JWT_SECRET=replace_with_secure_secret
CORS_ORIGIN=http://localhost:5173
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/quicktask


Running the Project

Frontend

cd frontend
npm install
npm run dev

The frontend application will be available at:
http://localhost:5173

Frontend Routes:
http://localhost:5173/login
http://localhost:5173/register
http://localhost:5173/tasks

Environment Configuration (Frontend)

Create a .env file inside the frontend directory and add:
VITE_API_URL=http://localhost:5000


Backend

cd backend
npm install
npm start

The backend server will be available at:
http://localhost:5000

Health Check Endpoint:
GET /health
Example:
http://localhost:5000/health


Analytics Service

cd analytics
pip install -r requirements.txt
python -m uvicorn app:app --reload --port 8000

The analytics service will be available at:
http://localhost:8000

API Documentation:
http://localhost:8000/docs


Important Notes

- Start the Backend before running the Frontend
- Ensure MongoDB is running and accessible
- Frontend communicates with the backend using VITE_API_URL
- Analytics service runs independently on port 8000

