
const Discovery = require('../models/Discovery');
const Strain = require('../models/Strain');

// Get User Discoveries
const getDiscoveries = async (req, res, next) => {
  try {
    const discoveries = await Discovery.findAll({
      where: { user_id: req.user.id },
      include: [
        { model: Strain, attributes: ['id', 'name', 'type', 'generation'] },
      ],
    });
    
    res.json({
      success: true,
      discoveries: discoveries.map((d) => ({
        strain_id: d.strain_id,
        strain_name: d.Strain.name,
        type: d.Strain.type,
        generation: d.Strain.generation,
        discovered_at: d.createdAt,
      })),
    });
  } catch (error) {
    next(error);
  }
};

// Add a Discovery
const addDiscovery = async (req, res, next) => {
  try {
    const { strain_id } = req.body;
    
    // Check if strain exists
    const strain = await Strain.findByPk(strain_id);
    if (!strain) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Strain not found' },
      });
    }
    
    // Check if already discovered
    const existingDiscovery = await Discovery.findOne({
      where: { user_id: req.user.id, strain_id },
    });
    
    if (existingDiscovery) {
      return res.status(400).json({
        success: false,
        error: { code: 'CONFLICT', message: 'Strain already discovered' },
      });
    }
    
    const discovery = await Discovery.create({
      user_id: req.user.id,
      strain_id,
    });
    
    res.json({
      success: true,
      discovery: {
        id: discovery.id,
        user_id: discovery.user_id,
        strain_id: discovery.strain_id,
        discovered_at: discovery.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Remove a Discovery
const removeDiscovery = async (req, res, next) => {
  try {
    const { strain_id } = req.params;
    
    const discovery = await Discovery.findOne({
      where: { user_id: req.user.id, strain_id },
    });
    
    if (!discovery) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Discovery not found' },
      });
    }
    
    await discovery.destroy();
    
    res.json({
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDiscoveries,
  addDiscovery,
  removeDiscovery,
};
