import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaEdit, FaSave, FaBan, FaTrash } from 'react-icons/fa';
import { ChromePicker } from 'react-color';
import MyNavbar from '../Home/navbar';
import Footer from '../Home/Footer';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

function Profil() {
  const [user, setUser] = useState(null);
  const [cars, setCars] = useState([]);
  const [editingCarIndex, setEditingCarIndex] = useState(null);
  const [editingProfile, setEditingProfile] = useState(false);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('login');
      const response = await axios.get('http://localhost:3006/profile', {
        headers: {
          Authorization: `Bearer ${JSON.parse(token).token}`,
        },
      });

      if (response.data && response.data.user) {
        setUser(response.data.user);

        // Fetch vehicles only if the user is a conductor
        if (response.data.user.type === 'conducteur') {
          const carsResponse = await axios.get(
            'http://localhost:3006/vehicules',
            {
              headers: {
                Authorization: `Bearer ${JSON.parse(token).token}`,
              },
            }
          );

          setCars(carsResponse.data);
        }
      } else {
        console.error('User not found in the response');
      }
    } catch (error) {
      console.error('Error fetching user profile:', error.message);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

 useEffect(() => {
   fetchUserProfile();
   
 }, []);

const handleCancelProfileClick = async () => {
  // Reset the user object to discard changes
  setEditingProfile(false);
  await fetchUserProfile(); // Fetch the original user data
};

  const handleEditClick = (index) => {
    setEditingCarIndex(index);
  };

  const handleCancelClick = () => {
    setEditingCarIndex(null);
  };

  const handleSaveClick = async (carId, updatedCar) => {
    try {
      const token = localStorage.getItem('login');
      await axios.put(`http://localhost:3006/vehicules/${carId}`, updatedCar, {
        headers: {
          Authorization: `Bearer ${JSON.parse(token).token}`,
        },
      });

      // Reset the editing state
      setEditingCarIndex(null);
      // Fetch updated cars
      const updatedCarsResponse = await axios.get(
        'http://localhost:3006/vehicules',
        {
          headers: {
            Authorization: `Bearer ${JSON.parse(token).token}`,
          },
        }
      );
      setCars(updatedCarsResponse.data);
    } catch (error) {
      console.error('Error updating car:', error);
    }
  };

  const handleMarqueChange = (e, carIndex) => {
    const updatedCars = [...cars];
    updatedCars[carIndex].marque = e.target.value;
    setCars(updatedCars);
  };

  const handleColorChange = (color, carIndex) => {
    setCars((prevCars) => {
      const updatedCars = [...prevCars];
      updatedCars[carIndex].couleur = color.hex;
      return updatedCars;
    });
  };

  const handleEditProfileClick = () => {
    setEditingProfile(true);
  };

  const handleSaveProfileClick = async () => {
    try {
      const token = localStorage.getItem('login');
      const userId = user.id_utilisateur; // Assuming user has an 'id_utilisateur' property

      await axios.put(`http://localhost:3006/users/${userId}`, user, {
        headers: {
          Authorization: `Bearer ${JSON.parse(token).token}`,
        },
      });

      // Fetch the updated user profile after saving
      await fetchUserProfile();

      setEditingProfile(false);
    } catch (error) {
      console.error('Error updating user profile:', error);
    }
  };

/*
  const handleDeleteAccount = async () => {
    try {
      const token = localStorage.getItem('login');
      await axios.delete('http://localhost:3006/profile', {
        headers: {
          Authorization: Bearer ${JSON.parse(token).token},
        },
      });

      // Redirect to the login page or perform other actions after account deletion
      window.location.href = '/login';
    } catch (error) {
      console.error('Error deleting user account:', error);
    }
  }; */

  const handleChangeProfile = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const handleDeleteCar = async (carId) => {
    try {
      const token = localStorage.getItem('login');
      await axios.delete(`http://localhost:3006/vehicules/${carId}`, {
        headers: {
          Authorization: `Bearer ${JSON.parse(token).token}`,
        },
      });
  
      // Mettez à jour la liste des voitures après la suppression
      const updatedCarsResponse = await axios.get(
        'http://localhost:3006/vehicules',
        {
          headers: {
            Authorization: `Bearer ${JSON.parse(token).token}`,
          },
        }
      );
      setCars(updatedCarsResponse.data);
  
      // Show success toast
      toast.success('Car deleted successfully');
    } catch (error) {
      console.error('Error deleting car:', error);
  
      // Show error toast
      toast.error('Véhicule est utilisé dans un trajet');
    }
  };

  
  return (
    <>
     <ToastContainer />
      <MyNavbar></MyNavbar>
      <div
        style={{
          background: 'linear-gradient(to bottom, #cfd8ef, #fff)',
          padding: '20px',
        }}
      >
        <div className="container mt-5">
          <h1 className="mb-4 text-center">Votre Profil</h1>
          {user && (
            <div className="card p-4 d-flex align-items-center justify-content-center">
              <div className="text-center">
                <div className="mb-4">
                  {user.pathImage ? (
                    <img
                      src={`http://localhost:3006${user.pathImage}`}
                      alt="Profile"
                      className="rounded-square img-fluid"
                      style={{
                        width: '180px',
                        height: '180px',
                        objectFit: 'cover',
                      }}
                    />
                  ) : (
                    <img
                      src="https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
                      alt="Profil par défaut"
                      className="rounded-square img-fluid"
                      style={{
                        width: '180px',
                        height: '180px',
                        objectFit: 'cover',
                      }}
                    />
                  )}
                </div>
                <div className="mb-2">
                  <strong>Nom et Prenom:</strong>{' '}
                  {editingProfile ? (
                    <>
                      <input
                        type="text"
                        value={user.nom}
                        name="nom"
                        onChange={handleChangeProfile}
                      />
                      <input
                        type="text"
                        value={user.prenom}
                        name="prenom"
                        onChange={handleChangeProfile}
                      />
                    </>
                  ) : (
                    `${user.nom} ${user.prenom}`
                  )}
                </div>
                <div className="mb-2">
                  <strong>Email:</strong>{' '}
                  {
                    user.email
                  }
                </div>
                <div className="mb-2">
                  <strong>Genre:</strong>{' '}
                  {editingProfile ? (
                    <div>
                      <label>
                        <input
                          type="radio"
                          value="Homme"
                          name="genre"
                          checked={user.genre === 'Homme'}
                          onChange={handleChangeProfile}
                        />
                        Homme &nbsp; &nbsp;
                      </label>

                      <label>
                        <input
                          type="radio"
                          value="Femme"
                          name="genre"
                          checked={user.genre === 'Femme'}
                          onChange={handleChangeProfile}
                        />
                        &nbsp; &nbsp; Femme
                      </label>
                    </div>
                  ) : (
                    user.genre
                  )}
                </div>
                <div className="mb-2">
                  <strong>Vous êtes:</strong> {user.type}
                </div>
                {editingProfile ? (
                  <div className="d-flex justify-content-center">
                    <FaSave
                      style={{
                        cursor: 'pointer',
                        marginRight: '5px',
                      }}
                      onClick={handleSaveProfileClick}
                    />
                    <FaBan
                      style={{ cursor: 'pointer' }}
                      onClick={handleCancelProfileClick}
                    />
                  </div>
                ) : (
                  <FaEdit
                    style={{ cursor: 'pointer' }}
                    onClick={handleEditProfileClick}
                  />
                )}
              </div>

              <div className="ml-4">
                {user.type === 'conducteur' ? (
                  <>
                    <h2>Les Vehicules :</h2>
                    <ul className="list-group">
                      {cars.map((car, index) => (
                        <li
                          key={car.id_vehicule}
                          className="list-group-item"
                          style={{ backgroundColor: '#d6e3f8' }}
                        >
                          <div className="d-flex align-items-center">
                            <div>
                              <strong>Couleur:</strong>
                            </div>
                            <div
                              style={{
                                width: '20px',
                                height: '20px',
                                backgroundColor: car.couleur,
                                marginRight: '10px',
                                border: '1px solid #ccc',
                              }}
                            ></div>
                            <div>
                              <strong>Marque:</strong>{' '}
                              {editingCarIndex === index ? (
                                <input
                                  type="text"
                                  value={car.marque}
                                  onChange={(e) => handleMarqueChange(e, index)}
                                />
                              ) : (
                                car.marque
                              )}
                            </div>
                            <div>
                              <p>&nbsp;&nbsp;&nbsp;&nbsp;</p>
                            </div>
                            <div>
                              {editingCarIndex === index ? (
                                <>
                                  <FaSave
                                    style={{
                                      cursor: 'pointer',
                                      marginRight: '5px',
                                    }}
                                    onClick={() =>
                                      handleSaveClick(
                                        car.id_vehicule,
                                        cars[index]
                                      )
                                    }
                                  />
                                  <FaBan
                                    style={{ cursor: 'pointer' }}
                                    onClick={handleCancelClick}
                                  />
                                </>
                              ) : (
                                <FaEdit
                                  style={{ cursor: 'pointer' }}
                                  onClick={() => handleEditClick(index)}
                                />
                              )}
                            </div>
                            {editingCarIndex === index && (
                              <ChromePicker
                                color={car.couleur}
                                onChange={(color) =>
                                  handleColorChange(color, index)
                                }
                              />
                            )}
                             <FaTrash
                              style={{ cursor: 'pointer', marginLeft: '10px', color: 'red' }}
                              onClick={() => handleDeleteCar(car.id_vehicule)}
                              />
                          </div>
                        </li>
                      ))}
                      <Link to="/AddVoiture" className="btn btn-primary mt-3">
                        Ajouter une voiture
                      </Link>
                    </ul>
                  </>
                ) : (
                  <p> </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer></Footer>
    </>
  );
}

export default Profil;