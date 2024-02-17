const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const vehiculeController = require('../controllers/VehiculeController');

// Create a new vehicule
router.post('/vehicules', authenticate, vehiculeController.createVehicule);

// Get all vehicules
router.get('/vehicules', authenticate, vehiculeController.getAllVehicules);

// Get a single vehicule by ID
router.get('/vehicules/:id', authenticate, vehiculeController.getVehiculeById);

// Update a vehicule by ID
router.put('/vehicules/:id', authenticate, vehiculeController.updateVehicule);

// Delete a vehicule by ID
router.delete('/vehicules/:id', authenticate, vehiculeController.deleteVehicule);

module.exports = router;
