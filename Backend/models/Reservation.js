const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Passager = require('./Passager');
const Trajet = require ('./Trajet');

const Reservation = sequelize.define(
  'reservation',
  {
    id_reservation: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    evaluation: {
      type: DataTypes.ENUM('0', '1', '2', '3', '4', '5'),
    },
    commentaire: {
      type: DataTypes.STRING,
    },
    statut: {
      type: DataTypes.ENUM('en_attente', 'acceptee', 'refusee','exclure'),
      defaultValue: 'en_attente',
    },
    id_passager: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    id_trajet: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
  },
  {
    tableName: 'reservation',
    timestamps: false,
  }
);

Reservation.belongsTo(Passager, { foreignKey: 'id_passager' });
Reservation.belongsTo(Trajet, { foreignKey: 'id_trajet' });

module.exports = Reservation;
