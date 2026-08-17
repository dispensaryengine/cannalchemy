
# Cannalchemy Frontend

## Overview
This is the **React.js** frontend for the **Cannalchemy** game. It connects to the [Node.js + Express + MySQL backend](../backend) to provide a dynamic, interactive experience for users to discover and combine cannabis strains.

---

## Setup

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the `frontend` directory:
```env
REACT_APP_API_URL=http://localhost:3001/api
```

### 3. Start the Development Server
```bash
npm start
```

The app will open in your default browser at `http://localhost:3000`.

---

## Features
- **User Authentication**: Login, signup, and guest mode.
- **Strain Collection**: View and manage your discovered strains.
- **Crafting System**: Drag and drop strains to combine them and discover new hybrids.
- **Encyclopedia**: Detailed strain information with lineage and flavor profiles.
- **Strain Map**: Visualize the genetic relationships between strains.
- **Responsive Design**: Works on mobile and desktop devices.

---

## Project Structure
```
frontend/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── Auth/
│   │   │   ├── AuthContext.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   └── GuestLogin.jsx
│   │   ├── Collection/
│   │   │   ├── CollectionPanel.jsx
│   │   │   ├── StrainCard.jsx
│   │   │   ├── SearchBar.jsx
│   │   │   └── FilterTabs.jsx
│   │   ├── CraftArea/
│   │   │   ├── CraftArea.jsx
│   │   │   ├── Slot.jsx
│   │   │   ├── CombineButton.jsx
│   │   │   └── ResultPanel.jsx
│   │   ├── Encyclopedia/
│   │   │   ├── Encyclopedia.jsx
│   │   │   └── ...
│   │   ├── StrainMap/
│   │   │   ├── StrainMap.jsx
│   │   │   └── ...
│   │   └── Shared/
│   │       ├── Header.jsx
│   │       ├── Notification.jsx
│   │       ├── Modal.jsx
│   │       └── LoadingSpinner.jsx
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useStrains.js
│   │   └── useDiscoveries.js
│   ├── services/
│   │   ├── api.js
│   │   ├── auth.js
│   │   ├── strains.js
│   │   ├── recipes.js
│   │   └── discoveries.js
│   ├── App.js
│   ├── App.css
│   └── index.js
├── package.json
└── README.md
```

---

## Dependencies
- **React**: ^18.2.0
- **React DOM**: ^18.2.0
- **React DnD**: ^16.0.1 (for drag-and-drop crafting)
- **Axios**: ^1.6.2 (for API requests)
- **React Scripts**: ^5.0.1

---

## Connecting to the Backend
1. Start the backend server (see [backend/README.md](../backend/README.md)).
2. Ensure the frontend `.env` file points to the backend URL:
   ```env
   REACT_APP_API_URL=http://localhost:3001/api
   ```
3. Start the frontend development server:
   ```bash
   npm start
   ```

---

## Deployment
To deploy the frontend:
1. Build the app:
   ```bash
   npm run build
   ```
2. Deploy the `build` directory to a static hosting service (e.g., Vercel, Netlify, or GitHub Pages).

---

## License
MIT
