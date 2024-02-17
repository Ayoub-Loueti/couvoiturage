const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Conducteur = require('./Conducteur'); // Import the Conducteur model

const Vehicule = sequelize.define(
  'vehicule',
  {
    id_vehicule: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    marque: {
      type: DataTypes.STRING,
    },
    couleur: {
      type: DataTypes.STRING,
    },
    id_conducteur: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Conducteur,
        key: 'id_conducteur',
      },
    },
  },
  {
    tableName: 'vehicule',
    timestamps: false,
  }
  
);
Vehicule.belongsTo(Conducteur, { foreignKey: 'id_conducteur' });
module.exports = Vehicule;
