const jwt = require('jsonwebtoken');
const secretKey = 'ayoub'; // Replace with your actual secret key
const Utilisateur = require('../models/Utilisateur');
const Conducteur = require('../models/Conducteur');
const Vehicule = require('../models/Vehicule');

// Create a new vehicule
exports.createVehicule = async (req, res) => {
  try {
    // Assuming you have the id_utilisateur of the conductor from the authenticated user
    const id_utilisateur = req.userId;

    // Check if the user is a conductor
    const isConductor = await Utilisateur.findOne({
      where: {
        id_utilisateur: id_utilisateur,
        type: 'conducteur',
      },
    });

    if (!isConductor) {
      return res
        .status(403)
        .json({ error: 'Only conductors can add vehicles' });
    }

    // Insert into conducteur table if not already there
    const [conducteur, created] = await Conducteur.findOrCreate({
      where: { id_utilisateur: id_utilisateur },
    });

    // Now conducteur.id_conducteur can be used in the vehicule insertion
    const newVehicule = await Vehicule.create({
      marque: req.body.marque,
      couleur: req.body.couleur,
      id_conducteur: conducteur.id_conducteur,
    });

    res.status(200).json(newVehicule);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all vehicules
exports.getAllVehicules = async (req, res) => {
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

    console.log('Authenticated Conductor ID:', conducteur.id_conducteur);

    // Fetch vehicules for the authenticated conductor
    const vehicules = await Vehicule.findAll({
      where: { id_conducteur: conducteur.id_conducteur },
    });

    console.log('Fetched Vehicules:', vehicules);

    res.status(200).json(vehicules);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getVehiculeByConducteur = async (req, res) => {
  try {
    // Assurez-vous d'ajuster cette logique en fonction de votre modèle et de votre base de données
    const voitures = await Vehicule.findAll({
      where: { id_conducteur: req.userId }, // Utilisez l'ID du conducteur connecté
    });

    res.status(200).json(voitures);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update a vehicule by ID
exports.updateVehicule = async (req, res) => {
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

    // Update vehicule only if it belongs to the authenticated conductor
    const updatedVehicule = await Vehicule.update(req.body, {
      where: { id_vehicule: id, id_conducteur: conducteur.id_conducteur },
    });

    if (updatedVehicule[0] === 1) {
      res.status(200).json({ message: 'Vehicule updated successfully' });
    } else {
      res
        .status(404)
        .json({
          error: 'Vehicule not found or does not belong to the conductor',
        });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get a single vehicule by ID
exports.getVehiculeById = async (req, res) => {
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

    // Fetch vehicule details with associated Conducteur details
    const vehicule = await Vehicule.findOne({
      where: { id_vehicule: id, id_conducteur: conducteur.id_conducteur },
      include: Conducteur, // Include the associated Conducteur model
    });

    if (vehicule) {
      res.status(200).json(vehicule);
    } else {
      res
        .status(404)
        .json({
          error: 'Vehicule not found or does not belong to the conductor',
        });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a vehicule by ID
exports.deleteVehicule = async (req, res) => {
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

    // Delete vehicule only if it belongs to the authenticated conductor
    const deletedVehicule = await Vehicule.destroy({
      where: { id_vehicule: id, id_conducteur: conducteur.id_conducteur },
    });

    if (deletedVehicule === 1) {
      res.status(200).json({ message: 'Vehicule deleted successfully' });
    } else {
      res
        .status(404)
        .json({
          error: 'Vehicule not found or does not belong to the conductor',
        });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
