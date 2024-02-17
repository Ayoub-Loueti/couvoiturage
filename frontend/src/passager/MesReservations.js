import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MDBTable, MDBTableHead, MDBTableBody } from 'mdb-react-ui-kit'; // Mettez à jour ces importations
import { Button, Modal } from 'react-bootstrap'; // Conservez ces importations pour les autres composants de react-bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import MyNavbar from '../Home/navbar';
import Footer from '../Home/Footer';

const MesReservations = () => {
  const [userReservations, setUserReservations] = useState([]);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' or one of ['acceptee', 'en_attente', 'refusee', 'exclure']

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
  };
  const fetchUserReservations = async () => {
    try {
      const token = localStorage.getItem('login');
      const response = await axios.get(
        'http://localhost:3006/passengerReservations',
        {
          headers: {
            Authorization: `Bearer ${JSON.parse(token).token}`,
          },
        }
      );

      setUserReservations(response.data);
    } catch (error) {
      console.error('Error fetching user reservations:', error);
    }
  };

  const handleDelete = async (id_reservation) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this reservation?');

    if (confirmDelete) {
      try {
        const token = localStorage.getItem('login');
        await axios.delete(`http://localhost:3006/reservations/${id_reservation}`, {
          headers: {
            Authorization: `Bearer ${JSON.parse(token).token}`,
          },
        });
        fetchUserReservations();
      } catch (error) {
        console.error('Error deleting reservation:', error);
      }
    }
  };

  const handleShowModal = (reservation) => {
    setSelectedReservation(reservation);
    setComment(reservation.commentaire || '');
    setRating(reservation.evaluation || 0);
    setShowModal(true);
  };

  const handleSaveCommentRating = async () => {
    try {
      const token = localStorage.getItem('login');
      await axios.put(
        `http://localhost:3006/reservations/${selectedReservation.id_reservation}`,
        {
          commentaire: comment,
          evaluation: rating,
        },
        {
          headers: {
            Authorization: `Bearer ${JSON.parse(token).token}`,
          },
        }
      );
      // Close the modal and refresh user reservations
      setShowModal(false);
      fetchUserReservations();
    } catch (error) {
      console.error('Error saving comment and rating:', error);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  useEffect(() => {
    fetchUserReservations();
  }, []);

  return (
    <>
      <MyNavbar />
      <div className="container mt-4">
        <h2>Mes Reservations</h2>
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="form-control mb-3"
        />

        {/* Mini Navbar */}
<div className="mini-navbar mb-3 d-flex justify-content-center">
  <Button
    variant={`link${statusFilter === 'all' ? '-primary' : ''}`}
    onClick={() => handleStatusFilter('all')}
    className={`mini-navbar-item ${statusFilter === 'all' ? 'active' : ''}`}
  >
    Tout
  </Button>
  <Button
    variant={`link${statusFilter === 'acceptee' ? '-success' : ''}`}
    onClick={() => handleStatusFilter('acceptee')}
    className={`mini-navbar-item ${statusFilter === 'acceptee' ? 'active' : ''}`}
  >
    Acceptée
  </Button>
  <Button
    variant={`link${statusFilter === 'en_attente' ? '-warning' : ''}`}
    onClick={() => handleStatusFilter('en_attente')}
    className={`mini-navbar-item ${statusFilter === 'en_attente' ? 'active' : ''}`}
  >
    En attente
  </Button>
  <Button
    variant={`link${statusFilter === 'refusee' ? '-danger' : ''}`}
    onClick={() => handleStatusFilter('refusee')}
    className={`mini-navbar-item ${statusFilter === 'refusee' ? 'active' : ''}`}
  >
    Refusée
  </Button>
  <Button
    variant={`link${statusFilter === 'exclure' ? '-info' : ''}`}
    onClick={() => handleStatusFilter('exclure')}
    className={`mini-navbar-item ${statusFilter === 'exclure' ? 'active' : ''}`}
  >
    Exclure
  </Button>
</div>

        <MDBTable style={{ maxWidth: '80%', margin: '2% auto' }}>
          <MDBTableHead dark>
            <tr>
              <th>TRAJET</th>
              <th>DATE ET HEURE</th>
              <th>STATUT</th>
              <th>EVALUATION</th>
              <th>Commentaire</th>
              <th>ACTION</th>
            </tr>
          </MDBTableHead>
          <MDBTableBody>
            {userReservations
              .filter((reservation) =>
                statusFilter === 'all' ? true : reservation.statut === statusFilter
              )
              .filter((reservation) =>
                  reservation.trajet.lieuDepart
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                  reservation.trajet.leuArrivee
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                  new Date(reservation.trajet.dateHeure)
                    .toLocaleString('fr-FR', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: 'numeric',
                    })
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                  reservation.statut
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                  String(reservation.evaluation).includes(searchTerm) ||
                  reservation.commentaire
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
              )
              .slice()
              .reverse()
              .map((reservation, index) => (
                <tr
                  key={reservation.id_reservation}
                  className={`table-${
                    reservation.statut === 'en_attente'
                      ? 'warning'
                      : reservation.statut === 'acceptee'
                      ? 'success'
                      : reservation.statut === 'refusee'
                      ? 'danger'
                      : reservation.statut === 'exclure'
                      ? 'info'
                      : 'light'
                  }`}
                  style={{
                    backgroundColor: index % 2 === 0 ? '#FFF' : '#F2F2F2',
                  }}
                >
                  <td>
                    {reservation.trajet
                      ? `${reservation.trajet.lieuDepart} à ${reservation.trajet.leuArrivee}`
                      : 'Unknown destination'}
                  </td>
                  <td>
                    {new Date(reservation.trajet.dateHeure).toLocaleString(
                      'fr-FR',
                      {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: 'numeric',
                      }
                    )}
                  </td>
                  <td>{reservation.statut}</td>
                  <td>
                  {reservation.evaluation !== 'NULL'
                  ? reservation.evaluation
                  : "Tu n'ai pas encore évalué"}</td>
                  <td>{reservation.commentaire}</td>
                  <td>
                    <Button
                      variant="primary"
                      onClick={() => handleShowModal(reservation)}
                      disabled={reservation.statut !== 'acceptee'}
                    >
                      Votre avis
                    </Button>
                    <br />
                    <Button
                      variant="danger"
                      onClick={() => handleDelete(reservation.id_reservation)}
                    >
                      Supprimer
                    </Button>
                    <br />
                  </td>
                </tr>
              ))}
          </MDBTableBody>
        </MDBTable>
      </div>
      <Footer />
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Votre avis</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <label>Commentaire:</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="form-control"
          />
          <label>Évaluation:</label>
          <select
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            className="form-control"
          >
            {[0, 1, 2, 3, 4, 5].map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Annuler
          </Button>
          <Button variant="primary" onClick={handleSaveCommentRating}>
            Enregistrer
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default MesReservations;