
# Cannalchemy Backend

## Overview
This is the backend API for the **Cannalchemy** game, built with **Node.js**, **Express**, and **MySQL**. It provides RESTful endpoints for user authentication, strain data, recipes, and discoveries.

---

## Setup

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the `backend` directory:
```env
# Server Configuration
PORT=3001
NODE_ENV=development

# MySQL Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=cannalchemy

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=1d

# Rate Limiting
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=120

# CORS
CORS_ORIGIN=*
```

### 3. Set Up MySQL Database
1. Create a MySQL database named `cannalchemy`:
   ```sql
   CREATE DATABASE cannalchemy;
   USE cannalchemy;
   ```

2. Run the schema from [BACKEND_SCHEMA.sql](../BACKEND_SCHEMA.sql) to create tables.

3. (Optional) Seed the database with initial data using the cleaned dataset from [data_audit/cleaned_data.js](../data_audit/cleaned_data.js).

---

## API Endpoints

### Auth Endpoints
| Method | Endpoint          | Description                     |
|--------|-------------------|---------------------------------|
| POST   | /api/auth/signup  | Register a new user.            |
| POST   | /api/auth/login   | Log in a user.                  |
| POST   | /api/auth/guest   | Log in as a guest.              |
| POST   | /api/auth/logout  | Log out a user.                |
| GET    | /api/auth/me      | Get current user details.      |

### Strain Endpoints
| Method | Endpoint               | Description                     |
|--------|------------------------|---------------------------------|
| GET    | /api/strains          | Get all strains.               |
| GET    | /api/strains/:id     | Get a specific strain.         |

### Recipe Endpoints
| Method | Endpoint               | Description                     |
|--------|------------------------|---------------------------------|
| GET    | /api/recipes          | Get all recipes.               |
| POST   | /api/recipes/validate | Validate a strain combination.  |

### Discovery Endpoints
| Method | Endpoint                   | Description                     |
|--------|----------------------------|---------------------------------|
| GET    | /api/discoveries          | Get user discoveries.          |
| POST   | /api/discoveries          | Add a discovery.               |
| DELETE | /api/discoveries/:strain_id | Remove a discovery.          |

---

## Running the Server

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

---

## Project Structure
```
backend/
├── config/
│   ├── db.js          # MySQL configuration
│   └── jwt.js         # JWT configuration
├── controllers/
│   ├── auth.js        # Auth controller
│   ├── strains.js     # Strains controller
│   ├── recipes.js     # Recipes controller
│   └── discoveries.js # Discoveries controller
├── models/
│   ├── User.js        # User model
│   ├── Strain.js      # Strain model
│   ├── Recipe.js      # Recipe model
│   └── Discovery.js   # Discovery model
├── routes/
│   ├── auth.js        # Auth routes
│   ├── strains.js     # Strain routes
│   ├── recipes.js     # Recipe routes
│   └── discoveries.js # Discovery routes
├── middlewares/
│   ├── auth.js        # Auth middleware
│   └── error.js       # Error handling middleware
├── app.js             # Express app configuration
├── server.js          # Server entry point
├── package.json       # Backend dependencies
└── README.md          # This file
```

---

## Dependencies
- **Node.js**: ^18.0.0
- **Express**: ^4.18.2
- **MySQL2**: ^3.6.0
- **Sequelize**: ^6.35.0
- **bcrypt**: ^5.1.1
- **jsonwebtoken**: ^9.0.2
- **cors**: ^2.8.5
- **helmet**: ^7.1.0
- **morgan**: ^1.10.0
- **express-rate-limit**: ^6.7.0
- **nodemon**: ^3.0.2 (dev)

---

## License
MIT
