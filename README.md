# Recipe Platform

A simple web application for managing recipes, pantry inventory, and meal planning.

## Features

- 🔐 User authentication (login/register)
- 📦 Pantry inventory management
- 🍳 Recipe browsing and search
- 🤖 AI-powered recipe recommendations
- 📅 Weekly meal planner
- 👥 Social features (follow users, like recipes)

## Tech Stack

**Frontend:**
- React
- Redux Toolkit
- React Router
- Axios
- Tailwind CSS

**Backend:**
- Node.js
- Express
- MongoDB
- JWT Authentication
- Google Gemini AI

## Setup

### Prerequisites
- Node.js (v14+)
- MongoDB
- Google Gemini API Key

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd recipe-platform
```

2. Install backend dependencies
```bash
cd backend
npm install
```

3. Install frontend dependencies
```bash
cd ../frontend
npm install
```

4. Configure environment variables

Create `backend/.env`:
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GOOGLE_API_KEY=your_gemini_api_key
PORT=5000
```

5. Run the application

Backend:
```bash
cd backend
npm run dev
```

Frontend:
```bash
cd frontend
npm run dev
```

6. Open http://localhost:5173 in your browser

## Project Structure

```
recipe-platform/
├── backend/          # Express API server
│   ├── models/       # MongoDB models
│   ├── routes/       # API routes
│   └── index.js      # Server entry point
├── frontend/         # React application
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── store/       # Redux store
│   │   └── App.jsx      # Main app component
│   └── public/
└── README.md
```

## License

MIT