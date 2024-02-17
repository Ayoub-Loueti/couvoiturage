import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import MyNavbar from './navbar';
import Footer from './Footer';

function DetailsTrajet() {
  const { id_trajet } = useParams();
  const [trajet, setTrajet] = useState(null);
  const colorPalette = ['#ff6347', '#40e0d0', '#ffa07a', '#98fb98', '#dda0dd'];


  useEffect(() => {
    const fetchTrajet = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3006/trajets/${id_trajet}`
        );
        setTrajet(response.data);
      } catch (error) {
        console.error('Error fetching trajet:', error);
      }
    };

    fetchTrajet();
  }, [id_trajet]);

  if (!trajet) {
    return <div>Loading...</div>;
  }

  // Filter out passengers with NULL evaluations
  const passengersWithRating = trajet.passengers.filter(
    (passager) => passager.evaluation !== 'NULL'
  );

  // Calculate the average evaluation
  const avgEvaluation =
    passengersWithRating.reduce(
      (sum, passenger) => sum + parseInt(passenger.evaluation),
      0
    ) / (passengersWithRating.length || 1); // Prevent division by zero

  // Function to display stars based on the average evaluation
  const displayStars = () => {
    const starCount = Math.round(avgEvaluation);
    return Array.from({ length: starCount }, (_, index) => (
      <span key={index} className="fa fa-star checked"></span>
    ));
  };

  const getStarRating = (evaluation) => {
    const starCount = Math.round(parseFloat(evaluation));
    const stars = Array.from({ length: starCount }, (_, index) => (
      <span key={index} className="fa fa-star checked"></span>
    ));
    return stars;
  };
  
  return (
    <>
      <MyNavbar></MyNavbar>
      <div className="container mt-5">
        <div
          className="card mx-auto"
          style={{ maxWidth: '500px', marginBottom: '20px', textAlign: 'center' }}
        >
          <img
            src="https://hightechcampus.com/storage/729/Carpooling.jpg"
            className="card-img-top"
            alt="Carpooling"
          />
          <div className="card-body">
            <h5 className="card-title" style={{ textAlign: 'center' }}>
              TRAJET
            </h5>
            <h2>
              DE{' '}
              <span style={{ color: '#EBB14D' }}>
                {trajet.lieuDepart.toUpperCase()}
              </span>{' '}
              A
              <span style={{ color: '#EBB14D' }}>
                {' '}
                {trajet.leuArrivee.toUpperCase()}
              </span>{' '}
            </h2>
            <div className="mb-4">
              {trajet.conducteur.pathImage ? (
                <img
                  src={`http://localhost:3006${trajet.conducteur.pathImage}`}
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
            <h4>
              {trajet.conducteur.nom} {trajet.conducteur.prenom}
            </h4>
            <p>
              Genre: {trajet.conducteur.genre}
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
            </p>{' '}
            <p className="card-text">
              Voiture :{' '}
              {trajet.vehicule && trajet.vehicule.marque
                ? trajet.vehicule.marque
                : 'Marque inconnue'}{' '}
              
              {trajet.vehicule && trajet.vehicule.couleur ? (
                <div
                  style={{
                    width: '20px',
                    height: '20px',
                    backgroundColor: trajet.vehicule.couleur,
                    marginRight: '10px',
                    border: '1px solid #ccc',
                    display: 'inline-block',
                  }}
                ></div>
              ) : (
                'Couleur inconnue'
              )}
            </p>
            <p className="card-text">
              Place disponible: {trajet.placeDisponible}
            </p>
            <p className="card-text">Prix: {trajet.cout} DT</p>
            <p className="card-text">Bagage: {trajet.bagage}</p>
            <p className="card-text">
              Flexibilité Horaire: {trajet.flexibiliteHorraire}
            </p>
            <p className="card-text">{trajet.description}</p>
            <p className="card-text">
              Evaluation: {displayStars()} ({avgEvaluation.toFixed(1)})
            </p>
          </div>
        </div>
        <div
          className="card mx-auto"
          style={{ maxWidth: '500px', marginBottom: '20px' }}
        >
          <h5 className="card-title" style={{ textAlign: 'center' }}>
            Passagers
          </h5>
          <hr />
        
          {trajet.passengers.map((passager, index) => (
          <div
            key={passager.id_passager}
            style={{
              backgroundColor: colorPalette[index % colorPalette.length],
              padding: '15px',
              marginBottom: '15px',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            }}
          >
            <h3 style={{ marginBottom: '10px' }}>
              {passager.nom} {passager.prenom}
            </h3>
            <div className="mb-2">
                {passager.pathImage ? (
                  <img
                    src={`http://localhost:3006${passager.pathImage}`}
                    alt="Profile"
                    className="rounded-square img-fluid"
                    style={{
                      width: '50px', // Reduce image size
                      height: '50px',
                      objectFit: 'cover',
                    }}
                  />
                ) : (
                    <img
                      src="https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
                      alt="Profil par défaut"
                      className="rounded-square img-fluid"
                      style={{
                        width: '50px',
                        height: '50px',
                        objectFit: 'cover',
                      }}
                    />
                  )}
                </div>
            <div style={{ color: '#333' }}>
              <p>
                Évaluation: {passager.evaluation !== 'NULL' ? getStarRating(passager.evaluation) : "Il n'a pas encore évalué"}
              </p>
              {passager.commentaire && <p>Commentaire: {passager.commentaire}</p>}
            </div>
            <hr style={{ marginTop: '10px', border: 'none', borderTop: '1px solid #ddd' }} />
          </div>
        ))}

        </div>
      </div>
      <Footer></Footer>
    </>
  );
}

export default DetailsTrajet;
