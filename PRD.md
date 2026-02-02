# Kitchen Companion - Product Requirements Document (PRD)

## 1. Overview
A comprehensive kitchen companion that manages inventory via barcode scanning, suggests recipes using AI based on available ingredients, and provides a guided cooking experience.

## 2. Technical Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React.js (Vite) | Fast, component-based UI; SPA architecture. |
| **Styling** | Tailwind CSS | Utility-first styling for responsive, modern design. |
| **State** | Redux Toolkit | Centralized store for Pantry, Auth, and Cooking state. |
| **Backend** | Node.js + Express | RESTful API orchestration and business logic. |
| **Database** | MongoDB Atlas | Flexible NoSQL storage for complex recipe/user data. |
| **AI Engine** | Gemini API / OpenAI | Logic for recipe matching, substitutions, and meal planning. |
| **Scanning** | react-qr-barcode-scanner | Webcam-based scanning for pantry inventory. |

## 3. Detailed Workflow

### A. User Journey: Inventory to Table
1.  **Ingestion**: User scans a milk carton using the React frontend.
2.  **Processing**: The FE sends the barcode to the BE; the BE queries a food database (e.g., Open Food Facts) and saves it to the user's Inventory collection in MongoDB.
3.  **Discovery**: User clicks "What can I cook?". The BE retrieves all "In-Stock" items and sends them to the AI Engine.
4.  **AI Logic**: The AI filters a recipe dataset or generates suggestions that prioritize "In-Stock" items while minimizing "Missing" items.
5.  **Execution**: User selects a recipe. The "Cooking Mode" component tracks progress and triggers a BE update to decrement used ingredients from the inventory upon completion.

## 4. Step-by-Step Implementation Plan

### Phase 1: Foundation (Week 1)
-   **Database Setup**: Create MongoDB schemas for User, Recipe, and Inventory.
-   **Auth System**: Implement JWT-based signup/login in Express. Set up Redux authSlice to persist tokens.
-   **Core UI**: Build the main dashboard and navigation using Tailwind.

### Phase 2: Inventory & Scanning (Week 2)
-   **Scanner Integration**: Implement `react-qr-barcode-scanner` in a React modal.
-   **Inventory API**: Create CRUD endpoints (`/api/inventory`) to add, edit, or delete pantry items.
-   **Barcode Lookup**: Integrate a third-party API in the Node.js backend to convert barcodes into product names.

### Phase 3: AI Integration (Week 3)
-   **AI Service**: Create a utility in the backend to communicate with the Gemini/OpenAI API.
-   **Recipe Logic**: Build the "Smart Match" endpoint.
    -   **Input**: User's pantry list + preferences.
    -   **Prompt**: "Suggest 3 recipes using these ingredients; list missing items and substitutions."
-   **Recommendation Engine**: Use MongoDB `$vectorSearch` (if using Atlas) for semantic search of similar recipes.

### Phase 4: Cooking & Social (Week 4)
-   **Cooking Mode**: Build a React component with an active step-counter and JS `setTimeout` for timers.
-   **Social Features**: Implement the "Share" and "Follow" logic using relational ObjectIDs in MongoDB.
-   **Optimization**: Add "Waste Reduction" alerts (cron jobs in Node.js) to notify users of expiring items.

## 5. Key API Endpoints (Express)

-   `POST /api/auth/register` - Create user and initialize empty pantry.
-   `GET /api/inventory` - Fetch all items for the current user.
-   `POST /api/inventory/scan` - Accepts barcode, returns item data, and saves to DB.
-   `POST /api/ai/recommend` - Core AI logic for "What can I cook?".
-   `PATCH /api/recipes/:id/rate` - Submit user review and update average rating.
