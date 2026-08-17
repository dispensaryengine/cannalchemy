
const express = require('express');
const router = express.Router();
const strainController = require('../controllers/strains');

router.get('/', strainController.getAllStrains);
router.get('/:id', strainController.getStrain);

module.exports = router;
