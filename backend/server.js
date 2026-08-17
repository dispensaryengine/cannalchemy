
require('dotenv').config();
const app = require('./app');
const { sequelize } = require('./config/db');

const PORT = process.env.PORT || 3001;

// Test Database Connection
sequelize.authenticate()
  .then(() => {
    console.log('Database connected successfully');
  })
  .catch((err) => {
    console.error('Database connection error:', err);
    process.exit(1);
  });

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
