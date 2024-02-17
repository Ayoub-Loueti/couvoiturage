const Trajet = require('../models/Trajet');
const jwt = require('jsonwebtoken');
const secretKey = 'ayoub';
const Utilisateur = require('../models/Utilisateur');
const Conducteur = require('../models/Conducteur');
const Vehicule = require('../models/Vehicule');
const Reservation = require('../models/Reservation');
const Passager = require('../models/Passager');
const { Op } = require('sequelize');

exports.createTrajet = async (req, res) => {
  try {
    const id_utilisateur = req.userId;

    const isConductor = await Utilisateur.findOne({
      where: {
        id_utilisateur: id_utilisateur,
        type: 'conducteur',
      },
    });

    if (!isConductor) {
      return res
        .status(403)
        .json({ error: 'Only conductors can create trajet' });
    }

    const [conducteur, created] = await Conducteur.findOrCreate({
      where: { id_utilisateur: id_utilisateur },
    });

    const newTrajet = await Trajet.create({
      lieuDepart: req.body.lieuDepart,
      leuArrivee: req.body.leuArrivee,
      dateHeure: req.body.dateHeure,
      placeDisponible: req.body.placeDisponible,
      cout: req.body.cout,
      bagage: req.body.bagage,
      flexibiliteHorraire: req.body.flexibiliteHorraire,
      description: req.body.description,
      id_vehicule: req.body.id_vehicule,
      id_conducteur: conducteur.id_conducteur,
    });

    res.status(200).json(newTrajet);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getMyTrajet = async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: 'User ID is missing in the request' });
    }

    const conducteur = await Conducteur.findOne({
      where: { id_utilisateur: req.userId },
    });

    if (!conducteur) {
      return res.status(404).json({ error: 'Conductor not found' });
    }

    const trajets = await Trajet.findAll({
      where: { id_conducteur: conducteur.id_conducteur },
      include: [
        {
          model: Vehicule,
          attributes: ['marque', 'couleur'],
        },
      ],
    });

    // Map trajectory and fetch reservations for each trajectory
    const trajetsWithReservations = await Promise.all(
      trajets.map(async (trajet) => {
        const reservations = await Reservation.findAll({
          where: { id_trajet: trajet.id_trajet, statut: 'acceptee' },
          include: [
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

        const trajectoryInfo = {
          id_trajet: trajet.id_trajet,
          lieuDepart: trajet.lieuDepart,
          leuArrivee: trajet.leuArrivee,
          dateHeure: trajet.dateHeure,
          placeDisponible: trajet.placeDisponible,
          cout: trajet.cout,
          bagage: trajet.bagage,
          flexibiliteHorraire: trajet.flexibiliteHorraire,
          description: trajet.description,
          vehicule: trajet.vehicule,
        };

        const reservationInfo = reservations.map((reservation) => ({
          id_reservation: reservation.id_reservation,
          passenger: {
            nom: reservation.passager.utilisateur.nom,
            prenom: reservation.passager.utilisateur.prenom,
          },
        }));

        return { trajectoryInfo, reservationInfo };
      })
    );

    res.status(200).json(trajetsWithReservations);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all trajets
exports.getAllTrajets = async (req, res) => {
  try {
    const trajets = await Trajet.findAll({
      include: [
        {
          model: Conducteur,
          attributes: ['id_conducteur'],
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
    });

    res.status(200).json(trajets);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get a single trajet by ID
exports.getTrajetById = async (req, res) => {
  const { id } = req.params;

  try {
    // Fetch trajet by ID with associated passenger information
    const trajet = await Trajet.findOne({
      where: { id_trajet: id },
      include: [
        {
          model: Conducteur,
          attributes: ['id_conducteur'],
          include: [
            {
              model: Utilisateur,
              attributes: ['nom', 'prenom','pathImage','genre'],
            },
          ],
        },
        {
          model: Vehicule,
          attributes: ['marque', 'couleur'],
        },
      ],
    });

    if (!trajet) {
      return res.status(404).json({ error: 'Trajet not found' });
    }

    const reservations = await Reservation.findAll({
      where: { id_trajet: trajet.id_trajet, statut: ['acceptee', 'exclure'] }, // Filter only accepted reservations
      include: [
        {
          model: Passager,
          include: [
            {
              model: Utilisateur,
              attributes: ['nom', 'prenom','pathImage'],
            },
          ],
        },
      ],
    });

    const passengerInfo = reservations.map((reservation) => ({
      nom: reservation.passager.utilisateur.nom,
      prenom: reservation.passager.utilisateur.prenom,
      evaluation: reservation.evaluation,
      commentaire: reservation.commentaire,
      pathImage:reservation.passager.utilisateur.pathImage,
    }));

    const formattedTrajet = {
      id_trajet: trajet.id_trajet,
      lieuDepart: trajet.lieuDepart,
      leuArrivee: trajet.leuArrivee,
      dateHeure: trajet.dateHeure,
      placeDisponible: trajet.placeDisponible,
      cout: trajet.cout,
      bagage: trajet.bagage,
      flexibiliteHorraire: trajet.flexibiliteHorraire,
      description: trajet.description,
      conducteur :{
      id_conducteur:trajet.conducteur.id_conducteur,
      pathImage:trajet.conducteur.utilisateur.pathImage,
      genre:trajet.conducteur.utilisateur.genre,
      nom: trajet.conducteur.utilisateur.nom,
      prenom: trajet.conducteur.utilisateur.prenom,
      },
      vehicule: {
        marque: trajet.vehicule.marque,
        couleur: trajet.vehicule.couleur,
      },
      passengers: passengerInfo,
    };
    

    res.status(200).json(formattedTrajet);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


// Update a trajet by ID
exports.updateTrajet = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedTrajet = await Trajet.update(req.body, {
      where: { id_trajet: id },
    });
    if (updatedTrajet[0] === 1) {
      res.status(200).json({ message: 'Trajet updated successfully' });
    } else {
      res.status(404).json({ error: 'Trajet not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a trajet by ID
exports.deleteTrajet = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedTrajet = await Trajet.destroy({
      where: { id_trajet: id },
    });
    if (deletedTrajet === 1) {
      res.status(200).json({ message: 'Trajet deleted successfully' });
    } else {
      res.status(404).json({ error: 'Trajet not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getTrajetByIdd = async (req, res) => {
  const { id } = req.params;
  try {
    // Check if userId is defined
    if (!req.userId) {
      return res
        .status(401)
        .json({ error: 'User ID is missing in the request' });
    }

    // Fetch the id_conducteur from the conducteur table using the userId
    const conducteur = await Conducteur.findOne({
      where: { id_utilisateur: req.userId },
    });

    if (!conducteur) {
      return res.status(404).json({ error: 'Conductor not found' });
    }

    // Fetch trajet by ID with associated vehicule information
    const trajet = await Trajet.findOne({
      where: { id_trajet: id, id_conducteur: conducteur.id_conducteur },
      include: [
        {
          model: Vehicule,
          attributes: ['marque', 'couleur'],
        },
      ],
    });

    if (trajet) {
      res.status(200).json(trajet);
    } else {
      res
        .status(404)
        .json({
          error: 'Trajet not found or does not belong to the conductor',
        });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
