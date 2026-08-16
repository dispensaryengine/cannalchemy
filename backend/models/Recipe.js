
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const Strain = require('./Strain');

const Recipe = sequelize.define('Recipe', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  parent1_id: {
    type: DataTypes.STRING(255),
    allowNull: false,
    references: {
      model: Strain,
      key: 'id',
    },
  },
  parent2_id: {
    type: DataTypes.STRING(255),
    allowNull: false,
    references: {
      model: Strain,
      key: 'id',
    },
  },
  offspring_id: {
    type: DataTypes.STRING(255),
    allowNull: false,
    references: {
      model: Strain,
      key: 'id',
    },
  },
}, {
  tableName: 'recipes',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['parent1_id', 'parent2_id'],
    },
    {
      fields: ['parent1_id'],
    },
    {
      fields: ['parent2_id'],
    },
    {
      fields: ['offspring_id'],
    },
  ],
});

// Define associations
Recipe.belongsTo(Strain, { as: 'parent1', foreignKey: 'parent1_id' });
Recipe.belongsTo(Strain, { as: 'parent2', foreignKey: 'parent2_id' });
Recipe.belongsTo(Strain, { as: 'offspring', foreignKey: 'offspring_id' });

module.exports = Recipe;
