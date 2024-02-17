const { DataTypes } = require('sequelize'); // N'importe que DataTypes depuis sequelize
const sequelize = require('../config/db'); // Importez votre connexion à la base de données
const Conducteur = require('./Conducteur');
const Vehicule = require('./Vehicule');


const Trajet = sequelize.define(
  'trajet',
  {
    id_trajet: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true, // L'ID est auto-incrémenté
    },
    lieuDepart: {
      type: DataTypes.STRING,
    },
    leuArrivee: {
      type: DataTypes.STRING,
    },
    dateHeure: {
      type: DataTypes.DATE,
    },
    placeDisponible: {
      type: DataTypes.INTEGER,
    },
    cout: {
      type: DataTypes.FLOAT,
    },
    bagage: {
      type: DataTypes.ENUM('aucun', 'petit', 'moyen', 'grand'),
    },
    flexibiliteHorraire: {
      type: DataTypes.ENUM(
        'pile a l heure',
        '+/- 15 minutes',
        '+/- 30 minutes'
      ),
    },
    description: {
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
    id_vehicule: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Vehicule,
        key: 'id_vehicule',
      },
    },
  },
  {
    tableName: 'trajet',
    timestamps: false, // Désactive les timestamps
  }
);

// Ajoutez une association avec Conducteur
Trajet.belongsTo(Conducteur, { foreignKey: 'id_conducteur' });

// Ajoutez une association avec Vehicule
Trajet.belongsTo(Vehicule, { foreignKey: 'id_vehicule' });


module.exports = Trajet;
