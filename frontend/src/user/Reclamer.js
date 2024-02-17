import React, { useState } from 'react';
import { Form, Button, Toast } from 'react-bootstrap';
import axios from 'axios';
import Footer from '../Home/Footer';
import MyNavbar from '../Home/navbar';

const Reclamer = () => {
  const [sujet, setSujet] = useState('');
  const [contenu, setContenu] = useState('');
  const [showToast, setShowToast] = useState(false);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      // Assuming you have the user's token stored in localStorage
      const token = localStorage.getItem('login');

      // Make a request to create a new reclamation
      const response = await axios.post(
        'http://localhost:3006/reclamations',
        { sujet, contenu },
        {
          headers: {
            Authorization: `Bearer ${JSON.parse(token).token}`,
          },
        }
      );

      console.log(response.data); // Handle the response as needed
      setShowToast(true);
      setSujet('');
      setContenu('');
    } catch (error) {
      console.error('Error creating reclamation:', error.message);
    }
  };

  return (
    <>
      <MyNavbar></MyNavbar>
    <div className="container mt-4">
      <h2>Formulaire de Réclamation</h2>
      <Form onSubmit={handleFormSubmit}>
        <Form.Group className="mb-3" controlId="sujet">
          <Form.Label>Sujet</Form.Label>
          <Form.Control
            type="text"
            placeholder="Entrez le sujet de la réclamation"
            value={sujet}
            onChange={(e) => setSujet(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="contenu">
          <Form.Label>Contenu</Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            placeholder="Entrez le contenu de la réclamation"
            value={contenu}
            onChange={(e) => setContenu(e.target.value)}
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Soumettre la réclamation
        </Button>
      </Form>

      {/* Toast Notification */}
      <Toast
        show={showToast}
        onClose={() => setShowToast(false)}
        delay={3000} // Adjust the delay as needed
        autohide
        style={{
          position: 'fixed',
          top: 20,
          right: 20,
          backgroundColor: '#28a745', // Green background color
          color: 'white',
          zIndex: 1,
        }}
      >
        <Toast.Header>
          <strong className="me-auto">Réclamation soumise avec succès</strong>
        </Toast.Header>
        <Toast.Body>Merci pour votre réclamation !</Toast.Body>
      </Toast>
    </div>
    <Footer></Footer>
    </>
  );
};

export default Reclamer;
