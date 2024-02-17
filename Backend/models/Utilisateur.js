const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Utilisateur = sequelize.define(
  'utilisateur',
  {
    id_utilisateur: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    nom: {
      type: DataTypes.STRING,
    },
    prenom: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
      unique: true, // Ensure email is unique
    },
    motDePasse: {
      type: DataTypes.STRING,
    },
    genre: {
      type: DataTypes.ENUM('homme', 'femme'),
    },
    pathImage: {
      type: DataTypes.STRING,
  
    },
    type: {
      type: DataTypes.ENUM( 'passager', 'conducteur', 'admin'),
    },
    etat: {
      type: DataTypes.ENUM( 'autorise', 'bloque'),
    },
  },
  {
    tableName: 'utilisateur',
    timestamps: false,
  }
);

module.exports = Utilisateur;
