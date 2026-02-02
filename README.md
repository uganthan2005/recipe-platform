# Recipe Recommendation Platform

## Overview
This is a personalized recipe recommendation platform that suggests meals based on user preferences, available ingredients, dietary restrictions, and nutritional goals. The application uses AI to provide smart recipe suggestions, ingredient substitutions, and meal planning assistance.

## Features

### Backend
- **Technologies**: Node.js, Express, MongoDB
- **Features**:
  - User authentication with JWT
  - Recipe database with search and filters
  - User profiles with dietary preferences and restrictions
  - API for AI-powered features

### Frontend
- **Technologies**: React.js, Tailwind CSS
- **Features**:
  - Intuitive and responsive UI
  - Recipe search and display
  - User profile management
  - Meal planning and inventory tracking

### AI Features
- Personalized recipe recommendations based on user history and preferences
- Ingredient substitution suggestions for dietary restrictions
- Nutritional analysis and meal optimization
- Image recognition for identifying ingredients from photos

## Installation

### Backend
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   npm run dev
   ```

### Frontend
1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```

## Usage
1. Open the frontend in your browser at `http://localhost:3000`.
2. Use the platform to search for recipes, manage your pantry, and plan meals.

## Testing and Debugging

### Running the Application

1. Start the backend server:
   ```bash
   cd backend
   npm run dev
   ```
   The backend server will run on `http://localhost:5000`.

2. Start the frontend development server:
   ```bash
   cd frontend
   npm start
   ```
   The frontend will be available at `http://localhost:3000`.

### Testing
- Test the user authentication by signing up and logging in.
- Test the recipe search and CRUD operations.
- Test the AI-powered features by providing user preferences and ingredients.
- Test inventory management by adding, updating, and deleting items.
- Test social features by sharing recipes and following users.

### Debugging
- Check the browser console for frontend errors.
- Monitor the backend server logs for API errors.
- Use tools like Postman to test API endpoints.

## Additional Notes
- Ensure MongoDB is running locally or update the connection string in `backend/index.js` to point to your MongoDB instance.
- Replace `your_jwt_secret` in `backend/index.js` with a secure secret key.
- Tailwind CSS is used for styling. Customize the `tailwind.config.js` file as needed.

## Future Enhancements
- Implement barcode scanning for inventory management.
- Enhance AI features with machine learning models.
- Add more social features, such as comments and likes on recipes.

## License
This project is licensed under the MIT License.