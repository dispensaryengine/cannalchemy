
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');
const Strain = require('./Strain');

const Discovery = sequelize.define('Discovery', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
  strain_id: {
    type: DataTypes.STRING(255),
    allowNull: false,
    references: {
      model: Strain,
      key: 'id',
    },
  },
}, {
  tableName: 'discoveries',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['user_id', 'strain_id'],
    },
  ],
});

// Define associations
Discovery.belongsTo(User, { foreignKey: 'user_id' });
Discovery.belongsTo(Strain, { foreignKey: 'strain_id' });

module.exports = Discovery;
