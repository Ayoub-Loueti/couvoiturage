const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Utilisateur = require('./Utilisateur'); // Import the Utilisateur model

const Conducteur = sequelize.define(
  'conducteur',
  {
    id_conducteur: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    id_utilisateur: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
  },
  {
    tableName: 'conducteur',
    timestamps: false,
  }
);

Conducteur.belongsTo(Utilisateur, { foreignKey: 'id_utilisateur' });

module.exports = Conducteur;
