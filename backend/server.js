require('dotenv').config();
const app = require('./app');
const { sequelize } = require('./config/db');
const { seed } = require('./seeders/initial_data');
async function start() {
  if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is required');
  for (let attempt = 1; ; attempt++) {
    try { await sequelize.authenticate(); break; }
    catch (err) {
      if (attempt >= 30) throw new Error('Unable to connect to MySQL after 30 attempts');
      console.log(`Waiting for MySQL (${attempt}/30)`);
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  await seed();
  const server = app.listen(process.env.PORT || 3001, '0.0.0.0', () => console.log('Cannalchemy is ready'));
  const shutdown = () => server.close(() => sequelize.close().finally(() => process.exit(0)));
  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}
start().catch(err => { console.error(err.message); process.exit(1); });
