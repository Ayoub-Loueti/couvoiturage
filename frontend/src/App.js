import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AddTrajet from './conducteur/Addtrajet';
import MesTrajets from './conducteur/Mestrajet';
import Signup from './user/signup';
import Login from './user/login';
import Home from './Home/home';
import DetailsTrajet from './Home/DetailsTrajet';
import AddVoiture from './conducteur/AddVoiture';
import Profil from './user/Profil';
import Maps from './conducteur/maps/maps';
import Invitations from './conducteur/Invitation';
import MesReservations from './passager/MesReservations';
import Profils from './admin/Profils';
import ListeBlocage from './admin/ListeBlocage';
import ListeReservation from './admin/ListeReservation';
import ListeReclamation from './admin/ListeReclamation';
import Reclamer from './user/Reclamer';
const App = () => {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/addtrajet" element={<AddTrajet />} />
          <Route path="/mestrajets" element={<MesTrajets />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/AddVoiture" element={<AddVoiture />} />
          <Route path="/profil" element={<Profil />} />

          <Route path="/" element={<Home />} />
          <Route path="/details/:id_trajet" element={<DetailsTrajet />} />
          <Route path="/maps" element={<Maps />} />
          <Route path="/mesreservations" element={<MesReservations />} />
          <Route path="/invitation" element={<Invitations />} />
          <Route path="/profils" element={<Profils />} />
          <Route path="/listeBlocage" element={<ListeBlocage />} />
          <Route path="/listeReservation" element={<ListeReservation/>} />
          <Route path="/listeReclamation" element={<ListeReclamation/>} />
          <Route path="/reclamer" element={<Reclamer/>} />
          <Route path="/" element={<p>Welcome to DriveShare website </p>} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;