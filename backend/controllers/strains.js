
const Strain = require('../models/Strain');
const { Op } = require('sequelize');

// Get All Strains
const getAllStrains = async (req, res, next) => {
  try {
    const { generation, type, search } = req.query;
    
    const where = {};
    if (generation) where.generation = generation;
    if (type) where.type = type;
    if (search) {
      where.name = { [Op.iLike]: `%${search}%` };
    }
    
    const strains = await Strain.findAll({
      where,
      order: [['name', 'ASC']],
    });
    
    res.json({
      success: true,
      strains,
    });
  } catch (error) {
    next(error);
  }
};

// Get a Specific Strain
const getStrain = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const strain = await Strain.findByPk(id);
    
    if (!strain) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Strain not found' },
      });
    }
    
    res.json({
      success: true,
      strain,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllStrains,
  getStrain,
};
