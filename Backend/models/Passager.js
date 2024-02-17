const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Utilisateur = require('./Utilisateur'); // Import the Utilisateur model

const Passager = sequelize.define(
  'passager',
  {
    id_passager: {
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
    tableName: 'passager',
    timestamps: false,
  }
);

Passager.belongsTo(Utilisateur, { foreignKey: 'id_utilisateur' });

module.exports = Passager;
