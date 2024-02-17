const Utilisateur = require('../models/Utilisateur'); 
const Reservation = require('../models/Reservation');
const Trajet = require('../models/Trajet');
const Passager = require('../models/Passager');
const Reclamation = require('../models/Reclamation');
const { Op, literal } = require('sequelize');

// Update the etat of a user by ID (from 'autorise' to 'bloque') - Only for Admins
exports.updateUserEtat = async (req, res) => {
    const { id } = req.params;
    const userId = req.userId; // Change this based on how you store user IDs
  
    try {
      // Check if the user making the request is an administrator
      const isAdmin = await Utilisateur.findOne({
        where: {
          id_utilisateur: userId,
          type: 'admin',
        },
      });
  
      if (!isAdmin) {
        return res
          .status(403)
          .json({ error: 'Permission denied. Only administrators can perform this action.' });
      }
  
      // If the user is an administrator, proceed with updating the user's etat
      const userToUpdate = await Utilisateur.findByPk(id);
  
      if (!userToUpdate) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Toggle the etat from 'autorise' to 'bloque' or vice versa
      const newEtat = userToUpdate.etat === 'autorise' ? 'bloque' : 'autorise';
  
      const updatedUser = await Utilisateur.update({ etat: newEtat }, {
        where: { id_utilisateur: id, etat: userToUpdate.etat },
      });
  
      if (updatedUser[0] === 1) {
        res.status(200).json({ message: `User etat updated successfully to ${newEtat}` });
      } else if (updatedUser[0] === 0) {
        res.status(404).json({ error: `User not found or already in ${newEtat} state` });
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  
// Update the etat of a user by ID (from 'bloque' to 'autorise') - Only for Admins
exports.updateUserEtatAutorise = async (req, res) => {
    const { id } = req.params;
    const userId = req.userId; // Change this based on how you store user IDs
  
    try {
      // Check if the user making the request is an administrator
      const isAdmin = await Utilisateur.findOne({
        where: {
          id_utilisateur: userId,
          type: 'admin',
        },
      });
  
      if (!isAdmin) {
        return res
          .status(403)
          .json({ error: 'Permission denied. Only administrators can perform this action.' });
      }
  
      // If the user is an administrator, proceed with updating the user's etat
      const updatedUser = await Utilisateur.update({ etat: 'autorise' }, {
        where: { id_utilisateur: id, etat: 'bloque' },
      });
  
      if (updatedUser[0] === 1) {
        res.status(200).json({ message: 'User etat updated successfully to autorise' });
      } else if (updatedUser[0] === 0) {
        res.status(404).json({ error: 'User not found or already in authorized state' });
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  // Delete a comment from a reservation by ID - Only for Admins
exports.deleteComment = async (req, res) => {
    const { reservationId } = req.params;
    const userId = req.userId; // Assuming you have a way to get the admin's ID from the request
  
    try {
      // Check if the user making the request is an administrator
      const isAdmin = await Utilisateur.findOne({
        where: {
          id_utilisateur: userId,
          type: 'admin', // Adjust this based on your admin user type
        },
      });
  
      if (!isAdmin) {
        return res.status(403).json({ error: 'Permission denied. Only administrators can perform this action.' });
      }
  
      // Find the reservation and update the comment to null
      const updatedReservation = await Reservation.update({ commentaire: null }, {
        where: { id_reservation: reservationId },
      });
  
      if (updatedReservation[0] === 1) {
        res.status(200).json({ message: 'Comment deleted successfully' });
      } else if (updatedReservation[0] === 0) {
        res.status(404).json({ error: 'Reservation not found' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

// Get all users with etat 'autorise' - Only for Admins
exports.getAllAuthorizedUsers = async (req, res) => {
    try {
      const isAdmin = await Utilisateur.findOne({
        where: {
          id_utilisateur: req.userId, // Assuming you have a way to get the admin's ID from the request
          type: 'admin', // Adjust this based on your admin user type
        },
      });
  
      if (!isAdmin) {
        return res.status(403).json({ error: 'Permission denied. Only administrators can perform this action.' });
      }
  
      const authorizedUsers = await Utilisateur.findAll({
        where: {
          etat: 'autorise',
        },
      });
  
      res.status(200).json(authorizedUsers);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  // Get all users with etat 'bloque' - Only for Admins
exports.getAllBlockedUsers = async (req, res) => {
    try {
      const isAdmin = await Utilisateur.findOne({
        where: {
          id_utilisateur: req.userId, // Assuming you have a way to get the admin's ID from the request
          type: 'admin', // Adjust this based on your admin user type
        },
      });
  
      if (!isAdmin) {
        return res.status(403).json({ error: 'Permission denied. Only administrators can perform this action.' });
      }
  
      const blockedUsers = await Utilisateur.findAll({
        where: {
          etat: 'bloque',
        },
      });
  
      res.status(200).json(blockedUsers);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

// Get all reservations with comments - Only for Admins
exports.getAllReservations = async (req, res) => {
  try {
    const isAdmin = await Utilisateur.findOne({
      where: {
        id_utilisateur: req.userId, // Assuming you have a way to get the admin's ID from the request
        type: 'admin', // Adjust this based on your admin user type
      },
    });

    if (!isAdmin) {
      return res.status(403).json({ error: 'Permission denied. Only administrators can perform this action.' });
    }

    const reservationsWithComments = await Reservation.findAll({
      where: literal('LENGTH(`commentaire`) > 0'),
      include: [
        {
          model: Trajet,
          as: 'trajet',
          attributes: ['lieuDepart', 'leuArrivee'],
        },
        {
          model: Passager,
          as: 'passager',
          include: [
            {
              model: Utilisateur,
              as: 'utilisateur',
              attributes: ['nom', 'prenom'],
            },
          ],
        },
      ],
    });

    res.status(200).json(reservationsWithComments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
  
// Get all reclamations with user information
exports.getAllReclamations = async (req, res) => {
  try {
    // Check if the user making the request is an administrator
    const isAdmin = await Utilisateur.findOne({
      where: {
        id_utilisateur: req.userId,
        type: 'admin',
      },
    });

    if (!isAdmin) {
      return res.status(403).json({ error: 'Permission denied. Only administrators can perform this action.' });
    }

    // Fetch all reclamations with associated user information
    const reclamationsWithUsers = await Reclamation.findAll({
      include: [
        {
          model: Utilisateur,
          as: 'utilisateur',
          attributes: ['nom', 'prenom', 'email'],
        },
      ],
    });

    res.status(200).json(reclamationsWithUsers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//changer from nonlu to vu
exports.updateNotificationStatus = async (req, res) => {
  const { id } = req.params;
  const adminUserId = req.userId; // Assuming you have a way to get the admin's ID from the request

  try {
    // Check if the user making the request is an administrator
    const isAdmin = await Utilisateur.findOne({
      where: {
        id_utilisateur: adminUserId,
        type: 'admin', // Adjust this based on your admin user type
      },
    });

    if (!isAdmin) {
      return res.status(403).json({ error: 'Permission denied. Only administrators can perform this action.' });
    }

      // If the user is an administrator, proceed with updating the user's etat
      const updatedRec = await Reclamation.update({ notif: 'vu' }, {
        where: { id_reclamation: id, notif: 'nonlu' },
      });
  
      if (updatedRec[0] === 1) {
        res.status(200).json({ message: 'You now seen this reclamation' });
      } else if (updatedUser[0] === 0) {
        res.status(404).json({ error: 'Reclamation not found or already in seen' });
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

//suprimer la reclamation
exports.deleteReclamation = async (req, res) => {
  const { id } = req.params;
  const adminUserId = req.userId; 
  try {
    const isAdmin = await Utilisateur.findOne({
      where: {
        id_utilisateur: adminUserId,
        type: 'admin', // Adjust this based on your admin user type
      },
    });

    if (!isAdmin) {
      return res.status(403).json({ error: 'Permission denied. Only administrators can perform this action.' });
    }
    
    // Supprimer la réclamation
    const deletedReclamation = await Reclamation.destroy({
      where: {
        id_reclamation: id,
      },
    });

    if (deletedReclamation) {
      res.status(200).json({ message: 'Réclamation supprimée avec succès' });
    } else {
      res.status(404).json({ error: 'Réclamation non trouvée' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = exports;
