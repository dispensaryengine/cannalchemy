
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Strain = sequelize.define('Strain', {
  lineage: DataTypes.TEXT,
  emoji: DataTypes.STRING(20),
  color: DataTypes.STRING(20),
  thc_range: DataTypes.STRING(40),
  cbd_range: DataTypes.STRING(40),
  id: {
    type: DataTypes.STRING(255),
    primaryKey: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM('Indica', 'Sativa', 'Hybrid', 'Landrace'),
    allowNull: false,
  },
  generation: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  thc: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true,
  },
  cbd: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true,
  },
  flavor: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  effects: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  image_url: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
}, {
  tableName: 'strains',
  timestamps: true,
});

module.exports = Strain;
