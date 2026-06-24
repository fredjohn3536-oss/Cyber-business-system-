# Frontend Preparation Guide: React

The `/frontend/` directory is dedicated to the new React application. This will replace the `homepage.html` prototype.

## Why React?
React allows us to build a dynamic Single Page Application (SPA) with reusable components. Instead of rewriting HTML and manually manipulating the DOM with vanilla JavaScript, we can build structured components for the Point of Sale interface, Inventory list, and Admin dashboard.

## Next Steps for Setup

To initialize the frontend, we will use a modern bundler like **Vite**:

1. Open your terminal and navigate to the project root.
2. Run the Vite initialization command:
   ```bash
   npm create vite@latest frontend -- --template react
   ```
3. Navigate into the frontend and install dependencies:
   ```bash
   cd frontend
   npm install
   ```

## Key Technologies to Implement
- **React Router:** For navigating between `/home`, `/products`, `/sales`, and `/admin` without reloading the page.
- **State Management:** (e.g., Redux, Zustand, or React Context) to manage the shopping cart/POS state globally.
- **Tailwind CSS / Material UI:** To quickly replicate and improve upon the dark-mode aesthetic from the prototype.
- **Axios:** For making API calls to the FastAPI backend.

## How to Run

To start the React development server:

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Start the Vite server:
   ```bash
   npm run dev
   ```
3. Open your browser and navigate to the URL provided in the terminal (usually `http://localhost:5173`).
