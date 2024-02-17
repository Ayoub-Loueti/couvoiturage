const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const secretKey = 'ayoub';
const Utilisateur = require('../models/Utilisateur'); 
const Reclamation = require('../models/Reclamation');

// Create a new user
exports.createUser = async (req, res) => {
  try {
    
    const hashedPassword = await bcrypt.hash(req.body.motDePasse, 10);
    const newUser = await Utilisateur.create({ ...req.body, motDePasse: hashedPassword });

    res.status(200).json(newUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  const { email, motDePasse } = req.body;

  try {
    // Check if the user with the provided email exists in the database
    const user = await Utilisateur.findOne({ where: { email: email } });

    if (user) {
      console.log('User found:', user);

      // Compare the entered password with the hashed password in the database
      const isPasswordValid = await bcrypt.compare(motDePasse, user.motDePasse);

      if (isPasswordValid) {
        // Check the user's etat and generate JWT token
        if (user.etat === 'bloque') {
          console.log('User account is blocked');
          return res.status(401).json({ error: 'Login failed. Your account is blocked.' });
        }

        if (user.etat === 'autorise') {
          // User authenticated successfully
          const token = jwt.sign({ userId: user.id_utilisateur }, secretKey, {
            expiresIn: '5h',
          });
          console.log('Login successful');
          return res.status(200).json({ message: 'Login successful', user: user, token: token });
        } else {
          console.log('User not authorized');
          return res.status(401).json({ error: 'Login failed or user not authorized' });
        }
      } else {
        console.log('Incorrect password');
        return res.status(401).json({ error: 'Login failed. Incorrect password.' });
      }
    } else {
      console.log('User not found');
      return res.status(401).json({ error: 'Login failed. User not found or incorrect credentials.' });
    }
  } catch (error) {
    console.error('Database query error:', error);
    return res.status(500).json({ error: error.message });
  }
};

exports.signup = async (req, res) => {
  const { nom, prenom, email, motDePasse, genre, pathImage, type } = req.body;

  try {
    // Check if the user with the provided email already exists
    const existingUser = await Utilisateur.findOne({ where: { email: email } });

    if (existingUser) {
      res.status(400).json({ error: 'User with this email already exists' });
    } else {
      // Hash the password before saving it to the database
      const hashedPassword = await bcrypt.hash(motDePasse, 10);

      // Create a new user record with the hashed password
      const newUser = await Utilisateur.create({
        nom,
        prenom,
        email,
        motDePasse: hashedPassword,
        genre,
        pathImage,
        type,
      });

      // Generate and send JWT token upon successful registration
      const token = jwt.sign({ userId: newUser.id_utilisateur }, secretKey, {
        expiresIn: '1h',
      });

      res.status(201).json({
        message: 'User registered successfully',
        user: newUser,
        token: token,
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUserProfile = async (req, res) => {
  // Get user profile based on req.userId
  try {
    const user = await Utilisateur.findByPk(req.userId);
    if (user) {
      res
        .status(200)
        .json({ message: 'User profile retrieved successfully', user: user });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await Utilisateur.findAll();
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get a single user by ID
exports.getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await Utilisateur.findByPk(id);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update a user by ID
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedUser = await Utilisateur.update(req.body, {
      where: { id_utilisateur: id },
    });
    if (updatedUser[0] === 1) {
      res.status(200).json({ message: 'User updated successfully' });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a user by ID
exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedUser = await Utilisateur.destroy({
      where: { id_utilisateur: id },
    });
    if (deletedUser === 1) {
      res.status(200).json({ message: 'User deleted successfully' });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// get type
exports.getUserType = async (req, res) => {
  try {
    const user = await Utilisateur.findByPk(req.userId); // Assuming req.userId is available after authentication
    if (user) {
      res.status(200).json({ userType: user.type });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createReclamation = async (req, res) => {
  const { sujet, contenu } = req.body;

  try {
    // Assuming req.userId is available after authentication
    const id_utilisateur = req.userId;

    // Create a new reclamation
    const newReclamation = await Reclamation.create({
      sujet,
      contenu,
      id_utilisateur,
    });

    res.status(201).json({
      message: 'Reclamation created successfully',
      reclamation: newReclamation,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = exports;
