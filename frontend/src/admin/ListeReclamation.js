import React, { useState, useEffect } from 'react';
import { Table, Modal, Button } from 'react-bootstrap';
import axios from 'axios';
import MyNavbar from '../Home/navbar';
import Footer from '../Home/Footer';
import { MDBTableHead, MDBTableBody, MDBTable } from 'mdb-react-ui-kit';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ListeReclamation = () => {
  const [reclamations, setReclamations] = useState([]);
  const [selectedReclamation, setSelectedReclamation] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const token = localStorage.getItem('login');

  useEffect(() => {
    const fetchReclamations = async () => {
      try {
        const response = await axios.get('http://localhost:3006/getReclamations', {
          headers: {
            Authorization: `Bearer ${JSON.parse(token).token}`,
          },
        });
        // Triez les réclamations du plus récent au plus ancien
        const sortedReclamations = response.data.sort((a, b) => b.id_reclamation - a.id_reclamation);
        setReclamations(sortedReclamations);
      } catch (error) {
        // Gérer les erreurs
      }
    };

    if (token) {
      fetchReclamations();
    }
  }, [token]);

  const handleReclamationClick = async (reclamation) => {
    setSelectedReclamation(reclamation);
    setShowModal(true);

    // Vérifiez si l'état de notification est 'nonlu' avant de faire la requête
    if (reclamation.notif === 'nonlu') {
      try {
        await axios.put(`http://localhost:3006/updateNotif/${reclamation.id_reclamation}`, {}, {
          headers: {
            Authorization: `Bearer ${JSON.parse(token).token}`,
          },
        });
        // Mettez à jour l'état local pour refléter le changement
        setReclamations((prevReclamations) =>
          prevReclamations.map((prevReclamation) =>
            prevReclamation.id_reclamation === reclamation.id_reclamation
              ? { ...prevReclamation, notif: 'vu' }
              : prevReclamation
          )
        );
      } catch (error) {
        // Gérer les erreurs
      }
    }
  };

  const handleCloseModal = () => {
    setSelectedReclamation(null);
    setShowModal(false);
  };

  const handleDeleteReclamation = async (e, id) => {
    e.stopPropagation(); // Empêche la propagation du clic sur la ligne
    e.preventDefault(); // Empêche le comportement par défaut du bouton

    try {
      // Envoyer une requête DELETE à l'API pour supprimer la réclamation
      await axios.delete(`http://localhost:3006/delReclamations/${id}`, {
        headers: {
          Authorization: `Bearer ${JSON.parse(token).token}`,
        },
      });

      // Affiche un message de suppression réussie
      toast.success('Réclamation supprimée avec succès');

      // Rafraîchit la liste des réclamations après la suppression
      const updatedReclamations = await axios.get('http://localhost:3006/getReclamations', {
        headers: {
          Authorization: `Bearer ${JSON.parse(token).token}`,
        },
      });

      // Triez les réclamations du plus récent au plus ancien
      const sortedReclamations = updatedReclamations.data.sort((a, b) => b.id_reclamation - a.id_reclamation);
      setReclamations(sortedReclamations);
    } catch (error) {
      console.error('Error deleting reclamation:', error.message);
      toast.error('Erreur lors de la suppression de la réclamation.');
    }
  };

  return (
    <>
      <MyNavbar />
      <div className="container text-center mt-3">
        <h2>Reclamations</h2>
      </div>
      <div className="d-flex justify-content-center">
        <MDBTable striped bordered hover style={{ width: '80%' }}>
          <MDBTableHead dark>
            <tr>
              <th>ID</th>
              <th>Sujet</th>
              <th>Email</th>
              <th>Action</th>
            </tr>
          </MDBTableHead>
          <MDBTableBody>
            {reclamations.map((reclamation) => (
              <tr
                key={reclamation.id}
                onClick={() => handleReclamationClick(reclamation)}
                style={{
                  cursor: 'pointer',
                  backgroundColor: reclamation.notif === 'nonlu' ? 'white' : '#5894C4',
                }}
              >
                <td style={{ color: reclamation.notif === 'vu' ? 'red' : 'black' }}>
                  {reclamation.id_reclamation}
                  {reclamation.notif === 'vu' && <span style={{ color: 'red' }}> vu</span>}
                </td>
                <td>{reclamation.sujet}</td>
                <td>{reclamation.utilisateur.email}</td>
                <td>
                  {(
                    <Button variant="danger" onClick={(e) => handleDeleteReclamation(e, reclamation.id_reclamation)}>
                      Supprimer
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </MDBTableBody>
        </MDBTable>
      </div>

      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>{selectedReclamation?.sujet}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            <strong>Nom de l'utilisateur:</strong> {selectedReclamation?.utilisateur.nom}{' '}
            {selectedReclamation?.utilisateur.prenom}
          </p>
          <p>
            <strong>Email de l'utilisateur:</strong> {selectedReclamation?.utilisateur.email}
          </p>
          <p>
            <strong>Contenu de la reclamation:</strong> {selectedReclamation?.contenu}
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Fermer
          </Button>
        </Modal.Footer>
      </Modal>

      <Footer />
      <ToastContainer />
    </>
  );
};

export default ListeReclamation;
