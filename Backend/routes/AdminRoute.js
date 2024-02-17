const express = require('express');
const adminController = require('../controllers/AdminController');
const authenticate = require('../middleware/authenticate');

const router = express.Router();

// Route to update user etat to 'bloque'
router.put('/block/:id', authenticate, adminController.updateUserEtat);

// Route to update user etat to 'autorise'
router.put('/unblock/:id', authenticate, adminController.updateUserEtatAutorise);

// Route to delete a comment from a reservation by ID
router.delete('/delComment/:reservationId',  authenticate, adminController.deleteComment);

// Route to get all authorized users
router.get('/autorise',authenticate, adminController.getAllAuthorizedUsers);

// Route to get all blocked users
router.get('/bloque', authenticate, adminController.getAllBlockedUsers);

// Route to get all reservations
router.get('/allReservations', authenticate, adminController.getAllReservations);

// Get all reclamations with user information
router.get('/getReclamations', authenticate, adminController.getAllReclamations);

// Route to update Reclamation
router.put('/updateNotif/:id', authenticate, adminController.updateNotificationStatus);

// Supprimer une réclamation
router.delete('/delReclamations/:id', authenticate, adminController.deleteReclamation);

module.exports = router;