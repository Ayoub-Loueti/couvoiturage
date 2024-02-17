import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MyNavbar from '../Home/navbar';
import Footer from '../Home/Footer';

const Invitations = () => {
  const [invitations, setInvitations] = useState([]);
  const [error, setError] = useState(null);
  const [confirmationModal, setConfirmationModal] = useState(null);

  useEffect(() => {
    // Fetch invitations when the component mounts
    const fetchInvitations = async () => {
      try {
        const token = localStorage.getItem('login');
        const response = await axios.get(
          'http://localhost:3006/pendingForConductor',
          {
            headers: {
              Authorization: `Bearer ${JSON.parse(token).token}`,
            },
          }
        );
        setInvitations(response.data);
      } catch (error) {
        // Handle errors
        console.error('Error fetching invitations:', error.message);
        setError('Failed to fetch invitations');
      }
    };

    fetchInvitations();
  }, []);

  const handleAccept = async (idReservation) => {
    try {
      const token = localStorage.getItem('login');
      await axios.put(
        `http://localhost:3006/accept/${idReservation}`, // Utilisez la route correcte du backend
        { accepter: true },
        {
          headers: {
            Authorization: `Bearer ${JSON.parse(token).token}`,
          },
        }
      );

      setInvitations((prevInvitations) =>
        prevInvitations.filter(
          (invitation) => invitation.id_reservation !== idReservation
        )
      );
      setError(null);
    } catch (error) {
      console.error('Error accepting reservation:', error.message);
      setError('Failed to accept reservation. Please try again later.');
    }
  };

  const handleReject = (idReservation) => {
    // Display confirmation modal
    setConfirmationModal(idReservation);
  };

  const cancelReject = () => {
    // Close the confirmation modal without rejecting
    setConfirmationModal(null);
  };

  const confirmReject = async (idReservation) => {
    try {
      const token = localStorage.getItem('login');
      await axios.put(
        `http://localhost:3006/reject/${idReservation}`, // Utilisez la route correcte du backend
        { accepter: 'refusee' },
        {
          headers: {
            Authorization: `Bearer ${JSON.parse(token).token}`,
          },
        }
      );

      setInvitations((prevInvitations) =>
        prevInvitations.filter(
          (invitation) => invitation.id_reservation !== idReservation
        )
      );

      setConfirmationModal(null);
      setError(null);
    } catch (error) {
      console.error('Error rejecting reservation:', error.message);
      setError('Failed to reject reservation. Please try again later.');
    }
  };

  return (
    <>
      <MyNavbar></MyNavbar>
      <br></br> <br></br> <br></br>
      <div
        style={{
          maxWidth: '600px',
          margin: '0 auto',
          padding: '20px',
          backgroundColor: '#f8f8f8',
          borderRadius: '8px',
          boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
        }}
      >
        <h2>Reservation Invitations</h2>
        {error && <p style={{ color: 'red', marginBottom: '10px' }}>{error}</p>}
        {invitations.length === 0 ? (
          <p>No reservation invitations at the moment.</p>
        ) : (
          <ul
            style={{
              listStyle: 'none',
              padding: '0',
            }}
          >
            {invitations.map((invitation) => (
              <li
                key={invitation.id_reservation}
                style={{
                  marginBottom: '20px',
                  padding: '15px',
                  backgroundColor: '#fff',
                  borderRadius: '8px',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                }}
              >
                {error && (
                  <p
                    style={{
                      color: 'red',
                      fontWeight: 'bold',
                      marginBottom: '8px',
                    }}
                  >
                    Error accepting reservation
                  </p>
                )}
                <p
                  style={{
                    fontWeight: 'bold',
                    marginBottom: '8px',
                  }}
                >
                  Passenger: {invitation.passager.utilisateur.nom}{' '}
                  {invitation.passager.utilisateur.prenom}
                </p>
                <p>From: {invitation.trajet.lieuDepart}</p>
                <p>To: {invitation.trajet.leuArrivee}</p>
                <div
                  style={{
                    display: 'flex',
                    gap: '10px',
                  }}
                >
                  <button
                    onClick={() => handleAccept(invitation.id_reservation)}
                    style={{
                      padding: '8px 12px',
                      fontSize: '14px',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      backgroundColor: '#4caf50',
                      color: '#fff',
                    }}
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleReject(invitation.id_reservation)}
                    style={{
                      padding: '8px 12px',
                      fontSize: '14px',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      backgroundColor: '#f44336',
                      color: '#fff',
                    }}
                  >
                    Reject
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
        {confirmationModal && (
          <div
            style={{
              position: 'fixed',
              top: '0',
              left: '0',
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                backgroundColor: '#fff',
                padding: '20px',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                textAlign: 'center',
              }}
            >
              <p style={{ marginBottom: '20px' }}>
                Are you sure you want to reject this reservation?
              </p>
              <button
                onClick={() => confirmReject(confirmationModal)}
                style={{
                  padding: '8px 12px',
                  fontSize: '14px',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  backgroundColor: '#4caf50',
                  color: '#fff',
                  marginRight: '10px',
                }}
              >
                Yes
              </button>
              <button
                onClick={cancelReject}
                style={{
                  padding: '8px 12px',
                  fontSize: '14px',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  backgroundColor: '#f44336',
                  color: '#fff',
                }}
              >
                No
              </button>
            </div>
          </div>
        )}
      </div>
      <br></br> <br></br> <br></br> <br></br> <br></br> <br></br> <br></br>{' '}
      <br></br> <br></br>
      <Footer></Footer>
    </>
  );
};

export default Invitations;