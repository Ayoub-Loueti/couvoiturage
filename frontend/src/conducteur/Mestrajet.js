import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MDBTable, MDBTableHead, MDBTableBody } from 'mdb-react-ui-kit';
import MyNavbar from '../Home/navbar';
import Footer from '../Home/Footer';

const Mestrajets = () => {
  const [trajets, setTrajets] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [passengersIndex, setPassengersIndex] = useState(null);
const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchTrajets = async () => {
      try {
        const token = localStorage.getItem('login');
        const response = await axios.get('http://localhost:3006/myTrajets', {
          headers: {
            Authorization: `Bearer ${JSON.parse(token).token}`,
          },
        });
        setTrajets(response.data);
      } catch (error) {
        console.error('Error fetching trajets:', error);
      }
    };

    fetchTrajets();
  }, []);

  const handleExcludePassenger = async (id_reservation) => {
    try {
      const token = localStorage.getItem('login');
      await axios.delete(
        `http://localhost:3006/reservationsExclu/${id_reservation}`,
        {
          headers: {
            Authorization: `Bearer ${JSON.parse(token).token}`,
          },
        }
      );

      const response = await axios.get('http://localhost:3006/myTrajets', {
        headers: {
          Authorization: `Bearer ${JSON.parse(token).token}`,
        },
      });

      setTrajets(response.data);
    } catch (error) {
      console.error('Error excluding passenger:', error);
    }
  };

  const handleUpdateClick = (index) => {
    setEditingIndex(index);
  };

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;

    const updatedTrajets = [...trajets];
    updatedTrajets[index] = {
      ...updatedTrajets[index],
      [name]: value,
    };

    setTrajets(updatedTrajets);
  };

  const handleUpdateSubmit = async (id_trajet, index) => {
    try {
      const token = localStorage.getItem('login');
      await axios.put(
        `http://localhost:3006/trajets/${id_trajet}`,
        trajets[index],
        {
          headers: {
            Authorization: `Bearer ${JSON.parse(token).token}`,
          },
        }
      );

      const response = await axios.get('http://localhost:3006/myTrajets', {
        headers: {
          Authorization: `Bearer ${JSON.parse(token).token}`,
        },
      });

      setTrajets(response.data);
      setEditingIndex(null);
    } catch (error) {
      console.error('Error updating trajet:', error);
    }
  };

  const handleDeleteClick = async (id_trajet) => {
    try {
      const token = localStorage.getItem('login');
      await axios.delete(`http://localhost:3006/trajets/${id_trajet}`, {
        headers: {
          Authorization: `Bearer ${JSON.parse(token).token}`,
        },
      });

      const response = await axios.get('http://localhost:3006/myTrajets', {
        headers: {
          Authorization: `Bearer ${JSON.parse(token).token}`,
        },
      });

      setTrajets(response.data);
    } catch (error) {
      console.error('Error deleting trajet:', error);
    }
  };

  const handlePassengersClick = (index) => {
    setPassengersIndex(index);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <>
      <MyNavbar></MyNavbar>
      <div className="container text-center mt-3">
        <form className="form-inline" style={{ marginBottom: '10px' }}>
          <div className="form-group mx-sm-3">
            <input
              type="text"
              className="form-control mb-3"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
        </form>
      </div>

      <MDBTable style={{ maxWidth: '80%', margin: '2% auto' }}>
        <MDBTableHead dark>
          <tr>
            <th scope="col">Lieu Départ</th>
            <th scope="col">Lieu Arrivée</th>
            <th scope="col">Date et Heure</th>
            <th scope="col">Places Disponibles</th>
            <th scope="col">Coût</th>
            <th scope="col">Bagage</th>
            <th scope="col">Flexibilité Horaire</th>
            <th scope="col">Description</th>
            <th scope="col">Actions</th>
          </tr>
        </MDBTableHead>
        <MDBTableBody>
          {trajets
            .slice()
            .reverse()
            .filter((trajet) =>
              Object.values(trajet.trajectoryInfo).some(
                (value) =>
                  typeof value === 'string' &&
                  value.toLowerCase().includes(searchTerm.toLowerCase())
              )
            )
            .map((trajet, index) => (
              <React.Fragment key={trajet.trajectoryInfo.id_trajet}>
                <tr style={{ fontSize: '0.9rem', padding: '5px' }}>
                  <td>
                    {editingIndex === index ? (
                      <input
                        type="text"
                        name="lieuDepart"
                        value={trajet.trajectoryInfo.lieuDepart}
                        onChange={(e) => handleInputChange(e, index)}
                      />
                    ) : (
                      trajet.trajectoryInfo.lieuDepart
                    )}
                  </td>
                  {/* ... (Répétez le même modèle pour les autres champs) */}
                  <td>
                    {editingIndex === index ? (
                      <input
                        type="text"
                        name="leuArrivee"
                        value={trajet.trajectoryInfo.leuArrivee}
                        onChange={(e) => handleInputChange(e, index)}
                      />
                    ) : (
                      trajet.trajectoryInfo.leuArrivee
                    )}
                  </td>
                  {/* ... (Répétez le même modèle pour les autres champs) */}
                  <td>
                    {editingIndex === index ? (
                      <input
                        type="text"
                        name="dateHeure"
                        value={trajet.trajectoryInfo.dateHeure}
                        onChange={(e) => handleInputChange(e, index)}
                      />
                    ) : (
                      new Date(trajet.trajectoryInfo.dateHeure).toLocaleString()
                    )}
                  </td>
                  {/* ... (Répétez le même modèle pour les autres champs) */}
                  <td>
                    {editingIndex === index ? (
                      <input
                        type="text"
                        name="placeDisponible"
                        value={trajet.trajectoryInfo.placeDisponible}
                        onChange={(e) => handleInputChange(e, index)}
                      />
                    ) : (
                      trajet.trajectoryInfo.placeDisponible
                    )}
                  </td>
                  {/* ... (Répétez le même modèle pour les autres champs) */}
                  <td>
                    {editingIndex === index ? (
                      <input
                        type="text"
                        name="cout"
                        value={trajet.trajectoryInfo.cout}
                        onChange={(e) => handleInputChange(e, index)}
                      />
                    ) : (
                      trajet.trajectoryInfo.cout
                    )}
                  </td>
                  {/* ... (Répétez le même modèle pour les autres champs) */}
                  <td>
                    {editingIndex === index ? (
                      <input
                        type="text"
                        name="bagage"
                        value={trajet.trajectoryInfo.bagage}
                        onChange={(e) => handleInputChange(e, index)}
                      />
                    ) : (
                      trajet.trajectoryInfo.bagage
                    )}
                  </td>
                  {/* ... (Répétez le même modèle pour les autres champs) */}
                  <td>
                    {editingIndex === index ? (
                      <input
                        type="text"
                        name="flexibiliteHorraire"
                        value={trajet.trajectoryInfo.flexibiliteHorraire}
                        onChange={(e) => handleInputChange(e, index)}
                      />
                    ) : (
                      trajet.trajectoryInfo.flexibiliteHorraire
                    )}
                  </td>
                  {/* ... (Répétez le même modèle pour les autres champs) */}
                  <td>
                    {editingIndex === index ? (
                      <input
                        type="text"
                        name="description"
                        value={trajet.trajectoryInfo.description}
                        onChange={(e) => handleInputChange(e, index)}
                      />
                    ) : (
                      trajet.trajectoryInfo.description
                    )}
                  </td>
                  <td>
                    {editingIndex === index ? (
                      <div style={{ display: 'flex' }}>
                        <button
                          className="btn btn-success"
                          style={{ flex: '1', marginRight: '5px' }}
                          onClick={() =>
                            handleUpdateSubmit(
                              trajet.trajectoryInfo.id_trajet,
                              index
                            )
                          }
                        >
                          Enregistrer
                        </button>
                        <button
                          className="btn btn-secondary"
                          style={{ flex: '1' }}
                          onClick={() => setEditingIndex(null)}
                        >
                          Annuler
                        </button>
                      </div>
                    ) : (
                      <div style={{ display: 'flex' }}>
                        <button
                          className="btn btn-primary"
                          style={{ flex: '1', marginRight: '5px' }}
                          onClick={() => handleUpdateClick(index)}
                        >
                          Modifier
                        </button>
                        <button
                          className="btn btn-danger"
                          style={{ flex: '1' }}
                          onClick={() =>
                            handleDeleteClick(trajet.trajectoryInfo.id_trajet)
                          }
                        >
                          Supprimer
                        </button>
                        <button
                          className="btn btn-info"
                          style={{ flex: '1', marginLeft: '5px' }}
                          onClick={() => handlePassengersClick(index)}
                        >
                          Passagers
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
                {passengersIndex === index && (
                  <tr>
                    <td colSpan="9">
                      <ul>
                        {trajet.reservationInfo.map((reservation) => (
                          <li key={reservation.id_reservation}>
                            {reservation.passenger.nom}{' '}
                            {reservation.passenger.prenom}
                            <button
                              className="btn btn-danger btn-sm"
                              style={{ marginLeft: '10px' }}
                              onClick={() =>
                                handleExcludePassenger(
                                  reservation.id_reservation
                                )
                              }
                            >
                              Exclure
                            </button>
                            <hr></hr>
                          </li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
        </MDBTableBody>
      </MDBTable>
      <br></br>
      <br></br>
      <br></br>
      <br></br>

      <Footer></Footer>
    </>
  );
};

export default Mestrajets;