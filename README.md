# Cannalchemy

A cannabis strain discovery game. Start with eight landrace strains and combine them to unlock the catalog's 44 strains across five generations. The game data contains 61 unique two-parent recipes.

## React + Express + MySQL version

- `frontend/`: React interface, drag-and-drop or click-to-select crafting, encyclopedia, and lineage map.
- `backend/`: Express API, Sequelize models, MySQL persistence, and JWT authentication.
- `backend/data/strains.json`: catalog copied from the repository's original game data, preserving its descriptions, recipes, and attributes.
- `index.html`: the earlier standalone browser-storage version; it is not served by the MySQL deployment.

Player accounts, discoveries, and combination counts are stored in MySQL. Guest players receive separate accounts and retain progress in the same browser through their session token. Register a username to restore progress by logging in on another browser. The browser stores the session token, not the game catalog or discovery progress.

### Local setup

Use Node.js 22 and npm 11.9.0 (the versions used by the Docker build), plus MySQL 8.

1. Create a database: `CREATE DATABASE cannalchemy CHARACTER SET utf8mb4;`
2. Copy `.env.example` to `backend/.env`; configure `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`, and a random `JWT_SECRET`.
3. Install: `npm ci --prefix backend` and `npm ci --prefix frontend`.
4. Build: `npm run build --prefix frontend`.
5. Start: `cd backend && npm start`.
6. Open `http://localhost:3001`.

Startup waits for MySQL, creates missing tables without dropping existing ones, seeds missing catalog rows, and only then starts accepting requests. Seeding is repeatable and does not reset player progress. Existing schemas are not automatically migrated; this playtest uses a new database.

For frontend development, run `npm start` from `frontend/` alongside the backend; the existing development proxy forwards `/api` requests.

### Railway

Deploy the repository using its root `Dockerfile` and `railway.json`. The application serves the React production build and API from one domain. Add a MySQL service and configure the application service:

| Variable | Value |
| --- | --- |
| `NODE_ENV` | `production` |
| `DB_HOST` | `${{MySQL.MYSQLHOST}}` |
| `DB_PORT` | `${{MySQL.MYSQLPORT}}` |
| `DB_NAME` | `${{MySQL.MYSQLDATABASE}}` |
| `DB_USER` | `${{MySQL.MYSQLUSER}}` |
| `DB_PASSWORD` | `${{MySQL.MYSQLPASSWORD}}` |
| `JWT_SECRET` | A securely generated random secret |

`/api/health` returns `{"success":true,"database":"mysql"}` only when the database responds. Secrets belong in runtime environment variables, never in Git.

### Verification

- `npm run build --prefix frontend`: compile the production app.
- `TEST_BASE_URL=https://your-test-domain npm test --prefix backend`: exercise the live MySQL API, including authentication, independent guest progress, reverse-order recipes, duplicate combinations, all 44 discoveries, and registered-login persistence. This creates isolated test users in the selected test database; use a playtest deployment. Without `TEST_BASE_URL`, the live test is skipped.

The catalog and simplified two-parent combinations are game content from the original repository, not a verification of historical strain genetics.
