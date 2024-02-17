const express = require('express');
const router = express.Router();
const trajetController = require('../controllers/TrajetController');
const authenticate = require('../middleware/authenticate');

router.post('/trajets', authenticate, trajetController.createTrajet);
router.get('/myTrajets', authenticate, trajetController.getMyTrajet);

router.get('/trajets', trajetController.getAllTrajets);
router.get('/trajets/:id', trajetController.getTrajetById);
router.put('/trajets/:id', trajetController.updateTrajet);
router.delete('/trajets/:id', trajetController.deleteTrajet);

module.exports = router;
