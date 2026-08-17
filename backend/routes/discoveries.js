
const express = require('express');
const router = express.Router();
const discoveryController = require('../controllers/discoveries');
const auth = require('../middlewares/auth');

router.use(auth); // All discovery routes require authentication

router.get('/', discoveryController.getDiscoveries);
router.post('/', discoveryController.addDiscovery);
router.delete('/:strain_id', discoveryController.removeDiscovery);

module.exports = router;
