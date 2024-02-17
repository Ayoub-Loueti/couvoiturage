// ReservationController.js
const sequelize = require('../config/db');
const Reservation = require('../models/Reservation');
const Trajet = require('../models/Trajet');
const Utilisateur = require('../models/Utilisateur');
const Passager = require('../models/Passager');
const Conducteur = require('../models/Conducteur');
const Vehicule = require('../models/Vehicule');

// Créer une réservation
exports.createReservation = async (req, res) => {
  try {
    const id_utilisateur = req.userId;

    const isPassager = await Utilisateur.findOne({
      where: {
        id_utilisateur: id_utilisateur,
        type: 'passager',
      },
    });

    if (!isPassager) {
      return res
        .status(403)
        .json({ error: 'Only passengers can create reservations' });
    }

    const [passager, created] = await Passager.findOrCreate({
      where: { id_utilisateur: id_utilisateur },
    });

    const { id_trajet } = req.body;

    const trajet = await Trajet.findByPk(id_trajet, {
      include: [
        {
          model: Conducteur,
          attributes: ['id_conducteur'],
        },
      ],
    });

    if (!trajet) {
      return res.status(404).json({ error: 'Trajet not found' });
    }

    const existingReservation = await Reservation.findOne({
      where: { id_passager: passager.id_passager, id_trajet },
    });

    if (existingReservation) {
      return res.status(200).json({ alreadyExists: true });
    }

    if (trajet.placeDisponible <= 0) {
      return res
        .status(400)
        .json({ error: 'No available seats on this trajet' });
    }

    const newReservation = await Reservation.create({
      id_passager: passager.id_passager,
      id_trajet,
      statut: 'en_attente',
    });

    res.status(200).json(newReservation);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Supprimer une réservation
exports.deleteReservationById = async (req, res) => {
  try {
    const id_utilisateur = req.userId; // Connected user

    // Check if the connected user is a passenger
    const isPassager = await Utilisateur.findOne({
      where: {
        id_utilisateur: id_utilisateur,
        type: 'passager',
      },
    });

    if (!isPassager) {
      return res
        .status(403)
        .json({ error: 'Only passengers can delete reservations' });
    }

    const { id_reservation } = req.params;

    // Check if the reservation exists
    const reservation = await Reservation.findOne({
      where: { id_reservation },
      include: [{ model: Passager, where: { id_utilisateur } }],
    });

    if (!reservation) {
      return res.status(404).json({ error: 'Reservation not found' });
    }

    // Delete the reservation
    await Reservation.destroy({ where: { id_reservation } });

    // Check if the reservation status is "acceptee"
    if (reservation.statut === 'acceptee') {
      // Update the number of available seats on the trajet only if the reservation was accepted
      await Trajet.update(
        { placeDisponible: sequelize.literal('placeDisponible + 1') },
        { where: { id_trajet: reservation.id_trajet } }
      );
    }

    res.status(200).json({ message: 'Reservation deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update an existing reservation (evaluation and commentaire)
exports.updateReservation = async (req, res) => {
  try {
    const id_utilisateur = req.userId; // Connected user

    // Check if the connected user is a passenger
    const isPassager = await Utilisateur.findOne({
      where: {
        id_utilisateur: id_utilisateur,
        type: 'passager',
      },
    });

    if (!isPassager) {
      return res
        .status(403)
        .json({ error: 'Only passengers can update reservations' });
    }

    const { id_reservation } = req.params;
    const { evaluation, commentaire } = req.body;

    // Check if the reservation exists
    const reservation = await Reservation.findOne({
      where: { id_reservation },
      include: [{ model: Passager, where: { id_utilisateur } }],
    });

    if (!reservation) {
      return res.status(404).json({ error: 'Reservation not found' });
    }

    // Update the reservation with evaluation and commentaire
    await Reservation.update(
      { evaluation, commentaire },
      { where: { id_reservation } }
    );

    res.status(200).json({ message: 'Reservation updated successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

  /*
//Afficher les réservations d'un passager
exports.getPassengerReservations = async (req, res) => {
  try {
    const id_utilisateur = req.userId; // Connected user

    // Get the reservations of the passenger with trajet details
    const reservations = await Reservation.findAll({
      include: [
        {
          model: Trajet,
          include: [
            {
              model: Conducteur,
              include: [
                {
                  model: Utilisateur,
                  attributes: ['nom', 'prenom'],
                },
              ],
            },
            {
              model: Vehicule,
              attributes: ['marque', 'couleur'],
            },
          ],
        },
      ],
    });

    res.status(200).json(reservations);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

*/

// Afficher les réservations d'un passager
exports.getPassengerReservations = async (req, res) => {
  try {
    const id_utilisateur = req.userId; // Connected user

    // Check if the connected user is a passenger
    const isPassager = await Utilisateur.findOne({
      where: {
        id_utilisateur: id_utilisateur,
        type: 'passager',
      },
    });

    if (!isPassager) {
      return res.status(403).json({ error: 'Only passengers can see the reservations' });
    }

    // Get the reservations of the connected passenger with trajet details
    const reservations = await Reservation.findAll({
      include: [
        {
          model: Passager,
          where: { id_utilisateur: id_utilisateur },
        },
        {
          model: Trajet,
          include: [
            {
              model: Conducteur,
              include: [
                {
                  model: Utilisateur,
                  attributes: ['nom', 'prenom'],
                },
              ],
            },
            {
              model: Vehicule,
              attributes: ['marque', 'couleur'],
            },
          ],
        },
      ],
    });

    res.status(200).json(reservations);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Accepter une réservation par le conducteur
exports.acceptReservation = async (req, res) => {
  try {const id_utilisateur = req.userId; // Conducteur connecté

    const isConducteur = await Utilisateur.findOne({
      where: {
        id_utilisateur: id_utilisateur,
        type: 'conducteur',
      },
    });

    if (!isConducteur) {
      return res.status(403).json({ error: 'Only conductors can accept reservations' });
    }

    const { id_reservation } = req.params;

    // Vérifier si la réservation existe
    const reservation = await Reservation.findOne({
      where: { id_reservation },
      include: [
        {
          model: Trajet,
          include: [
            {
              model: Conducteur,
              where: { id_utilisateur },
            },
          ],
        },
      ],
    });

    if (!reservation) {
      return res.status(404).json({ error: 'Reservation not found' });
    }

    // Vérifier si le nombre de places disponibles est supérieur à 0
    if (reservation.trajet.placeDisponible > 0) {
      // Mettre à jour le statut de la réservation
      await Reservation.update({ statut: 'acceptee' }, { where: { id_reservation } });

      // Mettre à jour le nombre de places disponibles
      await Trajet.update(
        { placeDisponible: sequelize.literal('placeDisponible - 1') },
        { where: { id_trajet: reservation.id_trajet } }
      );

      res.status(200).json({ message: 'Reservation accepted successfully' });
    } else {
      res.status(400).json({ error: 'No available seats for this reservation' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Refuser une réservation par le conducteur
exports.rejectReservation = async (req, res) => {
  try {
    const id_utilisateur = req.userId; // Conducteur connecté

    const isConducteur = await Utilisateur.findOne({
      where: {
        id_utilisateur: id_utilisateur,
        type: 'conducteur',
      },
    });
    if (!isConducteur) {
      return res
        .status(403)
        .json({ error: 'Only conductors can reject reservations' });
    }

    const { id_reservation } = req.params;

    // Vérifier si la réservation existe
    const reservation = await Reservation.findOne({
      where: { id_reservation },
      include: [
        {
          model: Trajet,
          include: [
            {
              model: Conducteur,
              where: { id_utilisateur },
            },
          ],
        },
      ],
    });

    if (!reservation) {
      return res.status(404).json({ error: 'Reservation not found' });
    }

    // Mettre à jour le statut de la réservation à "refusee"
    await Reservation.update(
      { statut: 'refusee' },
      { where: { id_reservation } }
    );

    res.status(200).json({ message: 'Reservation rejected successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get pending reservations for a conductor
exports.getPendingReservationsForConductor = async (req, res) => {
  try {
    const id_utilisateur = req.userId;

    const isConducteur = await Utilisateur.findOne({
      where: {
        id_utilisateur: id_utilisateur,
        type: 'conducteur',
      },
    });

    if (!isConducteur) {
      return res
        .status(403)
        .json({ error: 'Only conductors can view pending reservations' });
    }

    const [conducteur, created] = await Conducteur.findOrCreate({
      where: { id_utilisateur: id_utilisateur },
    });

    // Récupérer les réservations en attente pour ce conducteur
    const pendingReservations = await Reservation.findAll({
      where: {
        statut: 'en_attente',
      },
      include: [
        {
          model: Trajet,
          where: { id_conducteur: conducteur.id_conducteur },
          attributes: ['lieuDepart', 'leuArrivee'],
        },
        {
          model: Passager,
          include: [
            {
              model: Utilisateur,
              attributes: ['nom', 'prenom'],
            },
          ],
        },
      ],
    });

    res.status(200).json(pendingReservations);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Exclure un passager par le conducteur
exports.excludePassenger = async (req, res) => {
  try {
    const id_utilisateur = req.userId;

    const isConducteur = await Utilisateur.findOne({
      where: {
        id_utilisateur: id_utilisateur,
        type: 'conducteur',
      },
    });

    if (!isConducteur) {
      return res
        .status(403)
        .json({ error: 'Only conductors can exclude passengers' });
    }

    const { id_reservation } = req.params;

    const reservation = await Reservation.findOne({
      where: { id_reservation },
      include: [
        {
          model: Trajet,
          include: [
            {
              model: Conducteur,
              where: { id_utilisateur },
            },
          ],
        },
      ],
    });

    if (!reservation) {
      return res.status(404).json({ error: 'Reservation not found' });
    }

    // Vérifier si la réservation est acceptée et appartient à ce conducteur
    if (reservation.statut === 'acceptee' && reservation.trajet.conducteur) {
      // Mettre à jour la réservation pour changer son statut à 'exclure'
      await Reservation.update(
        { statut: 'exclure' },
        { where: { id_reservation } }
      );

      // Mettre à jour le nombre de places disponibles (si nécessaire)
      await Trajet.update(
        { placeDisponible: sequelize.literal('placeDisponible + 1') },
        { where: { id_trajet: reservation.id_trajet } }
      );

      res.status(200).json({ message: 'Passenger excluded successfully' });
    } else {
      res.status(400).json({ error: 'Invalid operation on this reservation' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


module.exports = exports;