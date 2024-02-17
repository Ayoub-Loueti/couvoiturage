const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Utilisateur = require('./Utilisateur');

const Reclamation = sequelize.define(
  'Reclamation',
  {
    // Define fields for the Reclamation model
    id_reclamation: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    sujet: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    contenu: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    notif: {
        type: DataTypes.ENUM('nonlu','vu'),
        defaultValue: 'nonlu',
      },
    id_utilisateur: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
  },
  {
    tableName: 'reclamation',
    timestamps: false,
  }
);

// Define associations
Reclamation.belongsTo(Utilisateur, {foreignKey: 'id_utilisateur',});

module.exports = Reclamation;
