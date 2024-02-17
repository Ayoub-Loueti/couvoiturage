// reservationRoute.js
const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/ReservationController');
const authenticate = require('../middleware/authenticate');

//passsager

// Créer une réservation
router.post('/reservations', authenticate, reservationController.createReservation);

// Supprimer une réservation
router.delete('/reservations/:id_reservation', authenticate, reservationController.deleteReservationById);

// Update an existing reservation
router.put('/reservations/:id_reservation', authenticate, reservationController.updateReservation);

// Afficher les réservations d'un passager
router.get('/passengerReservations', authenticate, reservationController.getPassengerReservations);

//conducteur

// Accepter une réservation par le conducteur
router.put('/accept/:id_reservation', authenticate,reservationController.acceptReservation);

// Refuser une réservation par le conducteur
router.put('/reject/:id_reservation', authenticate,reservationController.rejectReservation);

// Afficher les réservations en attente pour un conducteur
router.get('/pendingForConductor', authenticate, reservationController.getPendingReservationsForConductor);

// Route to exclude a passenger by the conductor
router.delete('/reservationsExclu/:id_reservation',authenticate, reservationController.excludePassenger);

module.exports = router;
