import React, { useEffect, useState } from 'react';
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import axios library

import logo from './logo.png';

function MyNavbar() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState('passager'); // Initialize user type state

  const handleLogout = () => {
    localStorage.removeItem('login');
    setIsAuthenticated(false);
    navigate('/');
  };

  useEffect(() => {
    const storedLogin = localStorage.getItem('login');
    setIsAuthenticated(storedLogin);

    // Fetch user type from the backend using an API call
    if (storedLogin) {
      fetchUserType(storedLogin).then((type) => setUserType(type));
    }
  }, [isAuthenticated]);

  // Function to fetch user type from the backend
  const fetchUserType = async (token) => {
    try {
      const response = await axios.get('http://localhost:3006/type', {
        headers: {
          Authorization: `Bearer ${JSON.parse(token).token}`,
        },
      });

      if (response.status !== 200) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = response.data;
      return data.userType;
    } catch (error) {
      console.error('Error fetching user type:', error);
      return 'passager'; // Set a default user type in case of an error
    }
  };

  return (
    <Navbar
      expand="lg"
      bg="#3A3C6C"
      variant="dark"
      style={{ background: '#3A3C6C', color: 'white' }}
    >
      <Container>
        <Navbar.Brand
          href="/"
          style={{ display: 'flex', alignItems: 'center' }}
        >
          <img
            src={logo}
            alt="DriveShare Logo"
            width="80"
            height="50"
            className="d-inline-block align-top"
          />
          <span
            style={{
              color: '#EBB14D',
              fontSize: '28px',
              fontWeight: 'bold',
              marginLeft: '5px',
            }}
          >
            DriveShare
          </span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/" style={{ color: 'white' }}>
              <i className="fas fa-home me-2"></i> Accueil
            </Nav.Link>
            {isAuthenticated && (
              <>
                {userType === 'admin' && (
                  <>
                    <Nav.Link href="/profils" style={{ color: 'white' }}>
                      <i className="fas fa-users me-2"></i> Profils
                    </Nav.Link>
                    <Nav.Link href="/listeBlocage" style={{ color: 'white' }}>
                      <i className="fas fa-ban me-2"></i>
                      Liste de blocage
                    </Nav.Link>
                    <Nav.Link href="/listeReservation" style={{ color: 'white' }}>
                      <i className="fas fa-calendar-alt me-2"></i>
                      Liste de Reservation
                    </Nav.Link>
                    <Nav.Link href="/listeReclamation" style={{ color: 'white' }}>
                      <i className="fas fa-exclamation-circle me-2"></i>
                      Liste de Reclamation
                    </Nav.Link>
                  </>
                )}
                {userType === 'conducteur' && (
                  <>
                    <Nav.Link href="/addTrajet" style={{ color: 'white' }}>
                      <i className="fas fa-road me-2"></i> Publier un trajet
                    </Nav.Link>
                    <Nav.Link href="/addVoiture" style={{ color: 'white' }}>
                      <i className="fas fa-car me-2"></i> Ajouter Vehicules
                    </Nav.Link>
                    <Nav.Link href="/mestrajets" style={{ color: 'white' }}>
                      <i className="fas fa-map me-2"></i> Mes Trajets
                    </Nav.Link>
                    <Nav.Link href="/invitation" style={{ color: 'white' }}>
                      <i className="fas fa-users me-2"></i> Invitation
                    </Nav.Link>
                    <Nav.Link href="/reclamer" style={{ color: 'white' }}>
                      <i className="fas fa-plus me-2"></i> Reclamer
                    </Nav.Link>
                  </>
                )}
                {userType === 'passager' && (
                  <>
                  <Nav.Link href="/mesreservations" style={{ color: 'white' }}>
                    <i className="far fa-calendar-alt me-2"></i> Mes reservations
                  </Nav.Link>
                  <Nav.Link href="/reclamer" style={{ color: 'white' }}>
                      <i className="fas fa-plus me-2"></i> Reclamer
                    </Nav.Link>
                  </>
                )}
              </>
            )}
          </Nav>

          <Nav>
            {isAuthenticated ? (
              <NavDropdown
                title={
                  <i className="fas fa-user" style={{ color: 'white' }}></i>
                }
                id="basic-nav-dropdown"
              >
                <NavDropdown.Item href="/profil">Votre profil</NavDropdown.Item>
                <NavDropdown.Item href="#" onClick={handleLogout}>
                  <i className="fas fa-sign-out-alt me-2"></i> Logout
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <>
                <Nav.Link href="/login" style={{ color: 'white' }}>
                  <i className="fas fa-sign-in-alt me-2"></i>
                </Nav.Link>
                <Nav.Link href="/signup" style={{ color: 'white' }}>
                  <i className="fas fa-user-plus me-2"></i>
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default MyNavbar;