# Recipe Platform 🍳

A full-stack recipe sharing and meal planning platform with social features, inventory management, and AI-powered recipe recommendations.

## Features

### 🍽️ Recipe Management
- Create, edit, and share recipes
- Upload recipe images
- Add ingredients and cooking instructions
- Like and comment on recipes
- Save favorite recipes

### 📅 Meal Planner
- Weekly meal planning grid (7 days × 3 meals)
- Click to add recipes to any meal slot
- Save multiple meal plans
- Load and edit existing plans
- Delete old meal plans
- Invite collaborators to shared meal plans

### 👥 Social Features
- Follow/unfollow users
- Discovery feed with random recipes
- User profiles with posts and stats
- Persistent follow relationships across sessions
- User suggestions

### 📦 Inventory Management
- Track kitchen ingredients
- Manual inventory addition
- Barcode scanning (with camera integration)
- AI-powered recipe recommendations based on available ingredients

### 🤖 AI Integration
- Recipe recommendations based on inventory
- Smart ingredient matching
- Powered by Google Gemini AI

## Tech Stack

### Frontend
- **React** - UI framework
- **Redux Toolkit** - State management
- **React Router** - Navigation
- **Axios** - HTTP client
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Lucide React** - Icons

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **bcryptjs** - Password hashing
- **JWT** - Authentication
- **Google Generative AI** - AI recommendations

## Project Structure

```
recipe-platform/
├── backend/
│   ├── models/          # MongoDB schemas
│   │   ├── User.js
│   │   ├── Recipe.js
│   │   ├── MealPlan.js
│   │   └── Inventory.js
│   ├── routes/          # API endpoints
│   │   ├── auth.js
│   │   ├── recipes.js
│   │   ├── social.js
│   │   ├── mealPlanner.js
│   │   ├── inventory.js
│   │   └── ai.js
│   ├── seed.js          # Database seeding
│   ├── index.js         # Server entry point
│   └── .env             # Environment variables
│
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── store/       # Redux store
│   │   ├── App.jsx      # Main app component
│   │   └── main.jsx     # Entry point
│   └── index.html
│
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Google Gemini API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd recipe-platform
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

3. **Create `.env` file in backend directory**
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   GEMINI_API_KEY=your_google_gemini_api_key
   PORT=5000
   ```

4. **Seed the database (optional)**
   ```bash
   node seed.js
   ```

5. **Start backend server**
   ```bash
   npm run dev
   ```

6. **Frontend Setup** (in a new terminal)
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

7. **Access the application**
   - Frontend: http://localhost:5173
   - Backend: http://localhost:5000

## Test Credentials

After running the seed script, you can use these test accounts:

| Username | Email | Password |
|----------|-------|----------|
| ChefMario | mario@example.com | password123 |
| HealthyHannah | hannah@example.com | password123 |
| GrillMaster | grill@example.com | password123 |
| BakingBetty | betty@example.com | password123 |
| SpicySam | sam@example.com | password123 |

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Recipes
- `GET /api/recipes` - Get all recipes
- `GET /api/recipes/:id` - Get single recipe
- `POST /api/recipes` - Create recipe
- `PUT /api/recipes/:id` - Update recipe
- `DELETE /api/recipes/:id` - Delete recipe

### Social
- `POST /api/social/follow/:id` - Follow user
- `POST /api/social/unfollow/:id` - Unfollow user
- `GET /api/social/feed/:userId` - Get discovery feed
- `GET /api/social/profile/:id` - Get user profile
- `POST /api/social/like/:recipeId` - Like/unlike recipe
- `POST /api/social/comment/:recipeId` - Comment on recipe

### Meal Planner
- `GET /api/mealplanner/user/:userId/all` - Get all meal plans
- `GET /api/mealplanner/plan/:planId` - Get specific meal plan
- `POST /api/mealplanner` - Create/update meal plan
- `DELETE /api/mealplanner/:id` - Delete meal plan
- `POST /api/mealplanner/:id/invite` - Invite collaborator

### Inventory
- `GET /api/inventory/:userId` - Get user inventory
- `POST /api/inventory/add` - Add item to inventory
- `DELETE /api/inventory/remove/:userId/:itemName` - Remove item

### AI
- `POST /api/ai/recommend` - Get AI recipe recommendations

## Features in Detail

### Meal Planner
- **Grid View**: 7 days × 3 meals (Breakfast, Lunch, Dinner)
- **Recipe Selection**: Click any slot to open recipe selector modal
- **Multiple Plans**: Save and manage multiple meal plans
- **Persistence**: All plans saved to MongoDB
- **Collaboration**: Invite other users to shared plans

### Follow System
- **Persistent**: Follows saved to database, not session
- **Bi-directional**: Updates both users' follower/following arrays
- **Real-time UI**: Optimistic updates for instant feedback
- **Profile Integration**: Follow/unfollow from user profiles

### Inventory Management
- **Manual Entry**: Add items with name and quantity
- **Barcode Scanning**: Use camera to scan product barcodes
- **AI Recommendations**: Get recipe suggestions based on available ingredients

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Acknowledgments

- Google Gemini AI for recipe recommendations
- Unsplash for recipe images
- Lucide for beautiful icons