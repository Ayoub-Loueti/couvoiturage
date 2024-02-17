const express = require('express');
const router = express.Router();
const utilisateurController = require('../controllers/UtilisateurController');
const authenticate = require('../middleware/authenticate.js');

router.post('/users', utilisateurController.createUser);
router.get('/users', utilisateurController.getAllUsers);
router.get('/users/:id', utilisateurController.getUserById);
router.put('/users/:id', utilisateurController.updateUser);
router.delete('/users/:id', utilisateurController.deleteUser);
router.get('/type', authenticate, utilisateurController.getUserType);

router.post('/login', utilisateurController.login);
router.post('/signup', utilisateurController.signup);

router.get('/profile', authenticate, utilisateurController.getUserProfile);

router.post('/reclamations', authenticate, utilisateurController.createReclamation);

module.exports = router;
