import React, { useState, useEffect } from "react";
import axios from "axios";
import "../App.css";
import { useNavigate } from "react-router-dom";
import MyNavbar from "../Home/navbar";
import Footer from "../Home/Footer";
import { MapContainer, TileLayer  } from "react-leaflet";
import L from "leaflet";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import LeafletRoutingMachine from "./maps/LeafletRoutingMachine";
import "./maps/maps.css"
const Addtrajet = () => {
  const [selectedCar, setSelectedCar] = useState("");
  const state = { dep : '', des : ''};

  const position = [36.8065, 10.1815];
const DefaultIcon = L.icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/1673/1673221.png',
  iconSize: [30, 41],
  iconAnchor: [10, 41],
  popupAnchor: [2, -40],
});
L.Marker.prototype.options.icon = DefaultIcon;
const handleClickX = (state) => {
  // Utiliser une expression régulière pour obtenir le premier mot jusqu'à la virgule
  const regex = /^[^,]+/;
  const firstWordDep = state.dep.match(regex)[0].trim();
  const firstWordDes = state.des.match(regex)[0].trim();

  // Mettre à jour l'état trajet
  setTrajet((prevTrajet) => ({
    ...prevTrajet,
    lieuDepart: firstWordDep,
    leuArrivee: firstWordDes,
  }));
  console.log(state);
};


  const [trajets, setTrajets] = useState([]);
  const [trajet, setTrajet] = useState({
    lieuDepart: "",
    leuArrivee: "",
    dateHeure: "",
    placeDisponible: "",
    cout: "",
    evaluation: "",
    bagage: "aucun",
    flexibiliteHorraire: "pile a l heure",
    description: "",
    selectedCarInfo: {},
  });
  const [cars, setCars] = useState([]);

  const [validationErrors, setValidationErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    e.target.setCustomValidity("");
    if (e.target.name === "selectedCar") {
      // Mettez à jour les informations de la voiture lorsqu'elle est sélectionnée
      const selectedCarInfo =
        cars.find((car) => car.id_vehicule === e.target.value) || {};
      setTrajet({
        ...trajet,
        selectedCar: e.target.value,
        selectedCarInfo,
      });
    } else {
      // Mettez à jour les autres champs du trajet
      setTrajet({ ...trajet, [e.target.name]: e.target.value });
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!trajet.lieuDepart.trim()) {
      errors.lieuDepart = 'Lieu de départ is required';
    }

    if (!trajet.leuArrivee.trim()) {
      errors.leuArrivee = "Lieu d'arrivée is required";
    }

    if (!trajet.dateHeure) {
      errors.dateHeure = 'Date et heure are required';
    }

    if (!trajet.placeDisponible) {
      errors.placeDisponible = 'Places disponibles are required';
    }

    if (!trajet.cout) {
      errors.cout = 'Coût is required';
    }

    // Add validation for the map
    // You can customize this based on your requirements for the map
    if (!trajet.lieuDepart || !trajet.leuArrivee) {
      errors.map = 'Map is required';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };


const handleClick = async (e) => {
  e.preventDefault();

  // Check if the user is logged in
  const token = localStorage.getItem('login');
  console.log('Token:', token);

  if (!token) {
    // If the user is not logged in, redirect to login
    navigate('/login');
    return;
  }

  // Fetch user profile data from the server
  const userResponse = await axios.get('http://localhost:3006/profile', {
    headers: {
      Authorization: `Bearer ${JSON.parse(token).token}`,
    },
  });

  const user = userResponse.data.user;

  if (!user) {
    // If the user data is not available, redirect to login
    navigate('/login');
    return;
  }

  if (user.type !== 'conducteur') {
    // If the user is not a conductor, show an alert
    alert("Vous n'êtes pas un conducteur.");
    return;
  }

  // If the user is a conductor, proceed with form submission
  if (validateForm()) {
    try {
      const response = await axios.post(
        'http://localhost:3006/trajets',
        {
          ...trajet,
          id_vehicule: selectedCar,
        },
        {
          headers: {
            Authorization: `Bearer ${JSON.parse(token).token}`,
          },
        }
      );

      const newTrajet = response.data;

      // Update the trajets state with the new trajet
      setTrajets((prevTrajets) => [...prevTrajets, newTrajet]);

      navigate('/mestrajets');
    } catch (err) {
      console.log(err);
    }
  } else {
    // Display an alert or a message here
    alert('Veuillez remplir tous les champs obligatoires.');
  }
};


  useEffect(() => {
    const fetchTrajets = async () => {
      try {
        const token = localStorage.getItem("login");

        const response = await axios.get("http://localhost:3006/trajets");
        setTrajets(response.data);

        // Fetch user's cars
        const carsResponse = await axios.get(
          "http://localhost:3006/vehicules",
          {
            headers: {
              Authorization: `Bearer ${JSON.parse(token).token}`,
            },
          }
        );

        setCars(carsResponse.data);
        console.log("User Cars:", carsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        // Ajoutez une logique pour afficher l'erreur à l'utilisateur ou dans la console
      }
    };

    fetchTrajets();
  }, []);

  return (
    <>
      <MyNavbar />
      <br />

      <div
        className="form-container"
        style={{
          maxWidth: '540px',
          background: '#f8f9fa',
          border: '1px solid #3A3C6C',
          borderRadius: '10px',
        }}
      >
        <h2 style={{ textAlign: 'center' }}>AJOUTER UN TRAJET</h2>

        <form onSubmit={handleClick}>
          {/* <div className="form-group">
            <label>Lieu de départ :</label>
            <input
              type="text"
              name="lieuDepart"
              onChange={handleChange}
              value={trajet.lieuDepart}
              required
              onInvalid={(e) =>
                e.target.setCustomValidity('Lieu de départ is required')
              }
            />
            {validationErrors.lieuDepart && (
              <div className="text-danger">{validationErrors.lieuDepart}</div>
            )}
          </div>

          <div className="form-group">
            <label>Lieu d'arrivée :</label>
            <input
              type="text"
              name="leuArrivee"
              onChange={handleChange}
              value={trajet.leuArrivee}
              required
              onInvalid={(e) =>
                e.target.setCustomValidity('Lieu d"arrivée is required')
              }
            />
            {validationErrors.leuArrivee && (
              <div className="text-danger">{validationErrors.leuArrivee}</div>
            )}
          </div> */}

          <div>
            <MapContainer center={position} zoom={13} scrollWheelZoom={false}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <LeafletRoutingMachine handleClickX={handleClickX} />
            </MapContainer>
          </div>

          <div className="form-group">
            <div className="mt-5">
              <label>Choisir une voiture :</label>
              <select
                className="form-control"
                name="selectedCar"
                onChange={(e) => setSelectedCar(e.target.value)}
                value={selectedCar}
              >
                <option value="" disabled>
                  -- Choisissez une voiture --
                </option>
                {cars.map((car) => (
                  <option
                    key={car.id_vehicule}
                    value={car.id_vehicule}
                    style={{ color: car.couleur }}
                  >
                    {car.marque} - {car.couleur}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Date et heure : </label>
            <input
              type="datetime-local"
              name="dateHeure"
              onChange={handleChange}
              value={trajet.dateHeure}
              pattern=".{1,}" // Any character, at least one
              required
              min={new Date().toISOString().slice(0, 16)}
            />
            {validationErrors.dateHeure && (
              <div className="text-danger">{validationErrors.dateHeure}</div>
            )}
          </div>

          <div className="form-group">
            <label>Places disponibles :</label>
            <input
              type="number"
              name="placeDisponible"
              onChange={handleChange}
              value={trajet.placeDisponible}
              required
              onInvalid={(e) =>
                e.target.setCustomValidity('Places disponibles are required')
              }
              min="1"
              max="4"
            />
            {validationErrors.placeDisponible && (
              <div className="text-danger">
                {validationErrors.placeDisponible}
              </div>
            )}
          </div>
          <div className="form-group">
            <label>Coût :</label>
            <input
              type="number"
              name="cout"
              onChange={handleChange}
              value={trajet.cout}
              required
              onInvalid={(e) => e.target.setCustomValidity('Coût is required')}
              min="0" // Ensure that the value is not negative
            />
            {validationErrors.cout && (
              <div className="text-danger">{validationErrors.cout}</div>
            )}
          </div>

          <div className="form-group">
            <label>Bagage :</label>
            <select
              name="bagage"
              onChange={handleChange}
              value={trajet.bagage}
              required
              onInvalid={(e) =>
                e.target.setCustomValidity('Please select a Bagage')
              }
            >
              <option value="aucun">Aucun</option>
              <option value="petit">Petit</option>
              <option value="moyen">Moyen</option>
              <option value="grand">Grand</option>
            </select>
          </div>
          <div className="form-group">
            <label>Flexibilité horaire :</label>
            <select
              name="flexibiliteHorraire"
              onChange={handleChange}
              value={trajet.flexibiliteHorraire}
              required
              onInvalid={(e) =>
                e.target.setCustomValidity(
                  'Please select a Flexibilité horaire'
                )
              }
            >
              <option value="pile a l heure">Pile à l'heure</option>
              <option value="+/- 15 minutes">+/- 15 minutes</option>
              <option value="+/- 30 minutes">+/- 30 minutes</option>
            </select>
          </div>
          <div className="form-group">
            <label>Description :</label>
            <textarea
              name="description"
              onChange={handleChange}
              value={trajet.description}
            />
          </div>
          <button
            type="submit"
            style={{
              backgroundColor: '#3A3C6C',
              display: 'block',
              margin: 'auto',
              marginTop: '20px',
              width: '130px',
            }}
          >
            Publier
          </button>
        </form>
      </div>
      <br></br>

      <Footer></Footer>
    </>
  );
};

export default Addtrajet;