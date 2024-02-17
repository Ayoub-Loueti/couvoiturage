import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ChromePicker } from 'react-color'; // Import the ChromePicker component
import MyNavbar from '../Home/navbar';
import Footer from '../Home/Footer';

const AddVoiture = () => {
  const navigate = useNavigate();

  const [car, setCar] = useState({
    marque: '',
    couleur: '#ffffff', // Default color value
  });

  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCar((prevCar) => ({ ...prevCar, [name]: value }));
  };

  const handleColorChange = (color) => {
    setCar((prevCar) => ({ ...prevCar, couleur: color.hex }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('login');
      const response = await axios.post(
        'http://localhost:3006/vehicules',
        car,
        {
          headers: {
            Authorization: `Bearer ${JSON.parse(token).token}`,
          },
        }
      );
      alert('Voiture ajoutée avec succès');
      navigate('/profil');

      setCar({ marque: '', couleur: '' }); // Clear the form
    } catch (error) {
      // Handle errors
    }
  };

  return (
    <>
      <MyNavbar></MyNavbar>
      <br></br>
      <h2>AJOUTER UNE VOITURE</h2>
      <div
        style={{
          width: '300px',
          margin: '0 auto',
          background: 'linear-gradient(to bottom, #cfd8ef, #fff)',
          padding: '20px',
        }}
      >
        {message && <p>{message}</p>}
        <form onSubmit={handleSubmit}>
          <div>
            <label>Marque:</label>
            <input
              type="text"
              name="marque"
              value={car.marque}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Couleur:</label>
            <ChromePicker color={car.couleur} onChange={handleColorChange} />
          </div>
          <br></br>
          <button type="submit">Ajouter</button>
        </form>
      </div>{' '}
      <br></br> <br></br> <br></br> <br></br> <br></br> <br></br> <br></br>{' '}
      <br></br> <br></br>
      <Footer></Footer>
    </>
  );
};

export default AddVoiture;