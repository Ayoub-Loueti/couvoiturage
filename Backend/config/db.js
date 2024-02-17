const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('dbcov', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
});

// Vérifiez la connexion à la base de données
sequelize
  .authenticate()
  .then(() => {
    console.log('Connected to the database.');
  })
  .catch((err) => {
    console.error('Error connecting to the database:', err);
  });

module.exports = sequelize;
