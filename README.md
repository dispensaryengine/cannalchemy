# Cannalchemy

A cannabis lineage discovery game with **199 entries**: 8 regional starters, 106 sourced cross outcomes from 104 unordered parent pairs, 68 seed-bank accessions, and 17 named selections. Every entry is reachable. Seed-bank imports bridge undocumented founder pedigrees without inventing genetics.

## React + Express + MySQL version

- `frontend/`: React interface, drag-and-drop or click-to-select crafting, encyclopedia, and lineage map.
- `backend/`: Express API, Sequelize models, MySQL persistence, and JWT authentication.
- `backend/data/strains.json`: researched catalog, exact parent references, evidence labels, source URLs, and unlock rules. See `docs/lineage-research.md` for methodology and limitations.
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

Startup validates the entire unlock graph before touching MySQL, waits for the database, creates missing tables, upgrades recipe uniqueness from parent pair to parent pair plus offspring, updates catalog metadata, and atomically replaces stale recipe rows. Existing strain IDs, users, discovery rows, and attempt counts are preserved. All seed-bank awards are repeatable and backfilled for existing players. Only recipe mappings are replaced; no player data is reset.

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
- `npm test --prefix backend`: validate ancestry references, sources, rejected circular/missing dependencies, award idempotence, and 100 different complete discovery orders.
- `node scripts/catalog-report.js`: regenerate the complete CSV register and machine-readable progression audit.
- `TEST_BASE_URL=https://your-test-domain npm test --prefix backend`: exercise the live MySQL API, including authentication, independent guest progress, reverse-order recipes, duplicate outcomes, all 199 discoveries, seed-bank milestones, removed shortcuts, and registered-login persistence. This creates isolated test users in the selected test database; use a playtest deployment. Without `TEST_BASE_URL`, the live test is skipped.

Sources distinguish breeder-reported, producer-reported, secondary-reported, disputed, and unknown pedigrees. Published ancestry is not DNA authentication. Named selections and multi-generation stabilization programs cannot be reproduced exactly by repeating a parent combination. Regional starter names represent genetic pools; explicit parental accessions remain separate. Game tiers describe unlock depth, not biological generations. Existing THC/CBD ranges and sensory scores inherited from the prototype were outside this lineage audit; new records use `Varies` rather than fabricated values.

### Progression

Cross two discovered parent entries. If a pair has multiple documented named outcomes, the server guarantees every undiscovered result before repeating a known one. Seed-bank packs arrive after 0, 3, 8, 15 and 25 **unique cross outcomes**, not attempts or imported entries. Named selections arrive when their source line is discovered. The Seed Bank panel explains upcoming packs; the encyclopedia links each entry to its evidence and flags uncertain genetics.
