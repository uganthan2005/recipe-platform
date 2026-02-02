# Implementation Plan: Kitchen Companion App

## Phase 1: Authentication (CURRENT PRIORITY)
- [ ] Create `LoginPage.jsx`
- [ ] Create `RegisterPage.jsx`
- [ ] Connect Forms to `authSlice` and Backend API
- [ ] Add Protected Route wrapper for `Inventory`, `Dashboard`, and `Cooking` pages.

## Phase 2: Core Recipe Features
- [ ] Implement `RecipesPage.jsx` with Grid Layout
- [ ] Create `RecipeDetail.jsx` (View single recipe)
- [ ] Create `RecipeCard.jsx` component
- [ ] Build `CookingPage.jsx` (Step-by-step wizard + Timers)
- [ ] Logic: Decrement inventory upon meal completion.

## Phase 3: Real Intelligence (Backend)
- [ ] **Data Source**: Integrate OpenFoodFacts API for `/api/inventory/scan`.
- [ ] **AI Engine**: Replace mock matching with Google Gemini / OpenAI API in `/api/ai/recommend`.
- [ ] **Smart Alerts**: Cron job for expiration notifications.

## Phase 4: Polish & Social
- [ ] Dashboard Widgets (Recent Activity, Expiring Soon).
- [ ] Share Recipe Modal.
- [ ] User Profile Settings.
