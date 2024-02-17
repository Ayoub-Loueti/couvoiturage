import React from 'react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import MyNavbar from './navbar';
import Footer from './Footer';
import axios from 'axios';

function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [fadeIn, setFadeIn] = useState(false);
  const [trajets, setTrajets] = useState([]);
  const [userReservations, setUserReservations] = useState([]);
  const [userType, setUserType] = useState('');
  const fetchTrajets = async () => {
    try {
      const response = await axios.get('http://localhost:3006/trajets');
      setTrajets(response.data);
    } catch (error) {
      console.error('Error fetching trajets:', error);
    }
  };
  // Update this part of your code in the Home component
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
 
  const handleReservation = async (idTrajet) => {
    try {
      const token = localStorage.getItem('login');

      // Check if the user has already made a reservation for this trip
      if (userReservations.includes(idTrajet)) {
        alert('Vous avez déjà réservé ce trajet.');
        return;
      }

      const response = await axios.post(
        'http://localhost:3006/reservations',
        { id_trajet: idTrajet },
        {
          headers: {
            Authorization: `Bearer ${JSON.parse(token).token}`,
          },
        }
      );

      if (response.data.alreadyExists) {
        // Reservation already exists, show a different alert or handle accordingly
        alert('Vous avez déjà réservé ce trajet.');
      } else {
        // Update the userReservations state with the newly reserved trip
        setUserReservations((prevReservations) => {
          if (!prevReservations.includes(idTrajet)) {
            return [...prevReservations, idTrajet];
          }
          return prevReservations;
        });

        // Display a success message or handle the response accordingly
        alert('Attendez la confirmation du conducteur de ce trajet.');
      }
    } catch (error) {
      // Handle errors, e.g., display an error message
      // ...
    }
  };


  useEffect(() => {
    fetchTrajets();
    const token = localStorage.getItem('login');
    setIsAuthenticated(!!token);
  }, []);

  useEffect(() => {
    setFadeIn(true);
  }, []);

useEffect(() => {
  if (isAuthenticated) {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('login');
        const response = await axios.get('http://localhost:3006/profile', {
          headers: {
            Authorization: `Bearer ${JSON.parse(token).token}`,
          },
        });

        if (response.data && response.data.user) {
          setUserType(response.data.user.type);

          if (response.data.user.type === 'passager') {
            const reservationsResponse = await axios.get(
              'http://localhost:3006/passengerReservations',
              {
                headers: {
                  Authorization: `Bearer ${JSON.parse(token).token}`,
                },
              }
            );
            setUserReservations(reservationsResponse.data);
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error.message);
      }
    };

    fetchUserData();
  }
}, [isAuthenticated]);


  useEffect(() => {
    setFadeIn(true);
  }, []);

  const fadeInStyle = {
    opacity: fadeIn ? 1 : 0,
    transition: 'opacity 500ms linear',
  };
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  window.addEventListener('scroll', toggleVisibility);

  const [visiblee, setVisibleee] = useState(false);

  useEffect(() => {
    setVisibleee(true);
  }, []);

  return (
    <>
      <MyNavbar></MyNavbar>
      <div className="scroll-to-top-button">
        {isVisible && (
          <button onClick={scrollToTop}>
            <i className="fa fa-chevron-up"></i>
          </button>
        )}
      </div>
      <main>
        <br></br>
        <br></br>
        <br></br>
        <br></br>

        <br></br>

        <div className="services-area left-border default-padding bottom-less">
          <div className="container">
            <div className="heading-left">
              <div className="row">
                <div className="col-lg-5"></div>
                <div className="col-lg-6 offset-lg-1"></div>
              </div>
            </div>
            <div className="services-items">
              <div className="row">
                <div className="single-item col-lg-4 col-md-6">
                  <div className="item">
                    <img
                      src="https://rideamigos.com/wp-content/uploads/2019/01/Ride-Amigos-02-1030x723.png"
                      alt="Thumb"
                      style={{ height: '250px' }}
                    />
                    <br></br>
                    <br></br>
                    <h2 style={fadeInStyle}>DriveShare</h2>
                    <p>
                      En partageant votre trajet sur Carpool, vous profitez
                      facilement des avantages du covoiturage : économies,
                      convivialité et impact positif sur l’environnement.
                    </p>
                  </div>
                </div>

                <div className="single-item col-lg-4 col-md-6">
                  <div className="item">
                    <img
                      src="https://www.goteso.com/products/assets/images/clone-scripts/blabla/blabla-right-header.png"
                      alt="Thumb"
                      style={{ height: '250px' }}
                    />
                    <br></br>
                    <br></br>
                    <h2 style={fadeInStyle}> CARS</h2>
                    <p>
                      Carpool vous trouve le covoitureur idéal, pour tous vos
                      trajets en Belgique ou en Europe. Placez votre annonce,
                      contactez des chauffeurs et passagers qui vous plaisent et
                      embarquez !
                    </p>
                  </div>
                </div>

                <div className="single-item col-lg-4 col-md-6">
                  <div className="item">
                    <img
                      src="https://png.pngtree.com/png-clipart/20230815/original/pngtree-ride-request-taxi-app-with-car-sharing-and-car-poolingvector-illustration-vector-picture-image_10820978.png"
                      alt="Thumb"
                      style={{ height: '250px' }}
                    />
                    <br></br>
                    <br></br>
                    <h2 style={fadeInStyle}>CARPOOL</h2>
                    <p>
                      En partageant votre trajet sur Carpool, vous profitez
                      facilement des avantages du covoiturage : économies,
                      convivialité et impact positif sur l’environnement.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <br></br>
      <br></br>
      <div className="indeterminate-progress-bar">
        <div className="indeterminate-progress-bar__progress"></div>
      </div>
      <br></br> <br></br> <br></br>
      <div className="container mt-5">
        <div className="row row-cols-1 row-cols-md-3 g-4">
          {trajets.map(
            (trajet) =>
              trajet.placeDisponible !== 0 && (
                <div key={trajet.id_trajet} className="col">
                  <div
                    className={`card h-100 ${
                      trajet.placeDisponible === 1 ? 'bg-danger text-white' : ''
                    }`}
                  >
                    <img
                      src="https://hightechcampus.com/storage/729/Carpooling.jpg"
                      className="card-img-top"
                      alt="Los Angeles Skyscrapers"
                    />
                    <div className="card-body">
                      <h5 className="card-title">TRAJET</h5>
                      <h2 style={{ fontSize: '23px' }}>
                        DE{' '}
                        <span style={{ color: '#EBB14D' }}>
                          {trajet.lieuDepart.toUpperCase()}
                        </span>{' '}
                        A<br />
                        <span style={{ color: '#EBB14D' }}>
                          {trajet.leuArrivee.toUpperCase()}
                        </span>{' '}
                      </h2>

                      <p className="card-text">
                        Voiture :{' '}
                        {trajet.vehicule && trajet.vehicule.marque
                          ? trajet.vehicule.marque
                          : 'Marque inconnue'}{' '}
                      </p>
                      <p className="card-text">
                        Place disponible: {trajet.placeDisponible}
                      </p>
                      <p className="card-text">
                        Date et Heure :{' '}
                        {new Date(trajet.dateHeure).toLocaleString('fr-FR', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: 'numeric',
                          minute: 'numeric',
                        })}
                      </p>

                      <Link
                        to={`/details/${trajet.id_trajet}`}
                        className="btn btn-primary"
                        style={{
                          display: 'block',
                          margin: 'auto',
                          textAlign: 'center',
                          backgroundColor: '#EBB14D',
                        }}
                      >
                        Plus de détails
                      </Link>
                      <br></br>

                      <button
                        className="btn btn-warning"
                        style={{
                          marginLeft: 'auto',
                          marginRight: 'auto',
                          display: 'block',
                        }}
                        onClick={() => handleReservation(trajet.id_trajet)}
                        disabled={
                          !isAuthenticated ||
                          userReservations.includes(trajet.id_trajet) ||
                          userType === 'conducteur' || userType === 'admin'
                        }
                      >
                        Réserver
                      </button>
                    </div>
                  </div>
                </div>
              )
          )}
        </div>
      </div>
      <br></br>
      <Footer></Footer>
    </>
  );
}

export default Home;
/* <div className={`card slide-in ${visiblee ? 'visible' : ''}`}>
        <h2>Bienvenue</h2>
        <p></p>
      </div> */