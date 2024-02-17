import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MDBTable, MDBTableHead, MDBTableBody, MDBBtn } from 'mdb-react-ui-kit';
import MyNavbar from '../Home/navbar';
import Footer from '../Home/Footer';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ListeReservation = () => {
  const [reservations, setReservations] = useState([]);
  const token = localStorage.getItem('login');

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        if (token) {
          const response = await axios.get('http://localhost:3006/allReservations', {
            headers: {
              Authorization: `Bearer ${JSON.parse(token).token}`,
            },
          });

          console.log('API Response:', response.data);
          setReservations(response.data);
        }
      } catch (error) {
        console.error('Error fetching reservations:', error);
        // Handle errors, for example, toast an error message
        toast.error('Error fetching reservations. Please try again.');
      }
    };

    fetchReservations();
  }, [token]);

  const handleDeleteComment = async (reservationId) => {
    try {
      await axios.delete(`http://localhost:3006/delComment/${reservationId}`, {
        headers: {
          Authorization: `Bearer ${JSON.parse(token).token}`,
        },
      });

      // Filter out the deleted reservation
      const updatedReservations = reservations.filter(
        (reservation) => reservation.id_reservation !== reservationId
      );

      setReservations(updatedReservations);

      toast.success('Commentaire supprimé avec succès!');
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast.error('Erreur lors de la suppression du commentaire.');
    }
  };

  return (
    <>
      <MyNavbar />
      <div className="container text-center mt-3">
        <h2>Liste des Réservations</h2>
      </div>
      <MDBTable style={{ maxWidth: '80%', margin: '2% auto' }}>
        <MDBTableHead dark>
          <tr>
            <th scope="col">ID Réservation</th>
            <th scope="col">Lieu de Départ</th>
            <th scope="col">Lieu d'Arrivée</th>
            <th scope="col">Nom Passager</th>
            <th scope="col">Prénom Passager</th>
            <th scope="col">Commentaire</th>
            <th scope="col">Action</th>
          </tr>
        </MDBTableHead>
        <MDBTableBody>
          {reservations.map((reservation) => (
            <tr key={reservation.id_reservation}>
              <td>{reservation.id_reservation}</td>
              <td>{reservation.trajet.lieuDepart }</td>
              <td>{reservation.trajet.leuArrivee }</td>
              <td>{reservation.passager.utilisateur.nom }</td>
              <td>{reservation.passager.utilisateur.prenom }</td>
              <td>{reservation.commentaire || 'Aucun commentaire'}</td>
              <td>
                <MDBBtn
                  color="danger"
                  onClick={() => handleDeleteComment(reservation.id_reservation)}
                >
                  Supprimer Commentaire
                </MDBBtn>
              </td>
            </tr>
          ))}
        </MDBTableBody>
      </MDBTable>

      <ToastContainer />
      <Footer />
    </>
  );
};

export default ListeReservation;
