const express = require('express');
const mydb = require('./config/db');
const trajetRoute = require('./routes/TrajetRoute');
const vehiculeRoute = require('./routes/VehiculeRoute');
const utilisateur = require('./routes/UtilisateurRoute');
const reservationRoute = require('./routes/ReservationRoute');
const adminRoute = require('./routes/AdminRoute');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const app = express();
app.use(cors());

app.use(express.json());
app.use('/uploads', express.static('uploads'));
// Set up storage for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // save files to the 'uploads' directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // set unique filename
  },
});

const upload = multer({ storage });

// Handle image upload
app.post('/upload-image', upload.single('file'), (req, res) => {
  const imageUrl = `/uploads/${req.file.filename}`;
  res.json({ imageUrl });
});

app.use(trajetRoute);
app.use(vehiculeRoute);
app.use(utilisateur);
app.use(reservationRoute);
app.use(adminRoute);
app.listen(3006, () => {
  console.log('server is running');
});
