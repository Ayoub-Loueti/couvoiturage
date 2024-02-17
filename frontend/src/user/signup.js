import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Footer from '../Home/Footer';
import MyNavbar from '../Home/navbar';

function Signup() {
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);
  const [formData, setFormData] = useState({
    email: '',
    motDePasse: '',
    nom: '',
    prenom: '',
    genre: '',
    image: null,
    type: '',
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const value = e.target.type === 'file' ? e.target.files[0] : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value,
    });
  };

  const handleImageUpload = async (file) => {
    const data = new FormData();
    data.append('file', file);

    try {
      const response = await axios.post(
        'http://localhost:3006/upload-image',
        data
      );
      const imageUrl = response.data.imageUrl;

      setFormData({
        ...formData,
        pathImage: imageUrl,
      });
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if passwords match
    if (formData.motDePasse !== formData.confirmMotDePasse) {
      alert("Passwords don't match");
      return;
    }

    try {
      await axios.post('http://localhost:3006/signup', formData);
      alert('Inscription réussie.');
      window.location.href = 'Login';
    } catch (error) {
      console.error(error);
      alert(error.response.data.error);
    }
  };

  return (
    <>
      <MyNavbar></MyNavbar>
      <div className="container mt-5">
        <div
          className="card p-5 mx-auto"
          style={{
            maxWidth: '540px',
            background: '#f8f9fa',
            border: '1px solid #3A3C6C',
            borderRadius: '10px',
          }}
        >
          <h3 className="mb-4">Créer un nouveau compte :</h3>
          <form className="signup" onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Nom :</label>
              <input
                type="text"
                className="form-control"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                style={{ border: '1px solid #3A3C6C' }}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Prenom :</label>
              <input
                type="text"
                className="form-control"
                name="prenom"
                value={formData.prenom}
                onChange={handleChange}
                style={{ border: '1px solid #3A3C6C' }}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Email :</label>
              <input
                type="email"
                className="form-control"
                name="email"
                style={{ border: '1px solid #3A3C6C' }}
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Password :</label>
              <div className="input-group">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-control"
                  name="motDePasse"
                  value={formData.motDePasse}
                  onChange={handleChange}
                  style={{ border: '1px solid #3A3C6C' }}
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={handleTogglePassword}
                >
                  {showPassword ? 'HIDE' : 'SHOW'}
                </button>
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">Confirm Password :</label>
              <div className="input-group">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-control"
                  name="confirmMotDePasse"
                  value={formData.confirmMotDePasse}
                  onChange={handleChange}
                  style={{ border: '1px solid #3A3C6C' }}
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={handleTogglePassword}
                >
                  {showPassword ? 'HIDE' : 'SHOW'}
                </button>
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label">Genre :</label>
              <br />
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  name="genre"
                  style={{ border: '1px solid #3A3C6C' }}
                  value="homme"
                  onChange={handleChange}
                />
                <label className="form-check-label">Homme</label>
              </div>
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  name="genre"
                  value="femme"
                  style={{ border: '1px solid #3A3C6C' }}
                  onChange={handleChange}
                />
                <label className="form-check-label">Femme</label>
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">Image :</label>
              <input
                type="file"
                className="form-control"
                name="image"
                onChange={(e) => handleImageUpload(e.target.files[0])}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Vous etes :</label>
              <br />
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  name="type"
                  value="passager"
                  style={{ border: '1px solid #3A3C6C' }}
                  onChange={handleChange}
                />
                <label className="form-check-label">Passager</label>
              </div>
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  name="type"
                  value="conducteur"
                  style={{ border: '1px solid #3A3C6C' }}
                  onChange={handleChange}
                />
                <label className="form-check-label">Conducteur</label>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-block gradient-custom-2 mb-3"
              style={{
                backgroundColor: '#3A3C6C',
                border: '1px solid #3A3C6C',
              }}
            >
              S'inscrire
            </button>
          </form>
        </div>
      </div>{' '}
      <br></br> <br></br> <br></br> <br></br> <br></br> <br></br>
      <Footer></Footer>
    </>
  );
}

export default Signup;
