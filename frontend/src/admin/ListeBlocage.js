import React, { useState, useEffect } from 'react';
import { MDBTable, MDBTableHead, MDBTableBody, MDBBtn } from 'mdb-react-ui-kit';
import axios from 'axios';
import MyNavbar from '../Home/navbar';
import Footer from '../Home/Footer';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ListeBlocage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem('login'); // Retrieve token from local storage

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:3006/bloque', {
          headers: {
            Authorization: `Bearer ${JSON.parse(token).token}`,
          },
        });
        setUsers(response.data);
      } catch (error) {
        // Handle errors
      }
    };

    if (token) {
      fetchUsers();
    }
  }, [token]);

  const handleUnblockUser = async (userId) => {
    try {
      await axios.put(`http://localhost:3006/unblock/${userId}`, {}, {
        headers: {
          Authorization: `Bearer ${JSON.parse(token).token}`,
        },
      });
      setUsers((prevUsers) => prevUsers.filter((user) => user.id_utilisateur !== userId));
      toast.success('Utilisateur débloqué avec succès!');
    } catch (error) {
      // Handle errors
      toast.error('Erreur lors du déblocage de l\'utilisateur.');
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.type !== 'admin' &&
      (user.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.genre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.type.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <>
      <MyNavbar />
      <div className="container text-center mt-3">
        <h2>Liste des utilisateurs bloqués</h2>
      </div>
      <div className="container text-center mt-3">
        <form className="form-inline" style={{ marginBottom: '10px' }}>
          <div className="form-group mx-sm-3">
            <input
              type="text"
              className="form-control mb-3"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
        </form>
      </div>
      <MDBTable style={{ maxWidth: '80%', margin: '2% auto' }}>
        <MDBTableHead dark>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Nom et Prenom</th>
            <th scope="col">Email</th>
            <th scope="col">Genre</th>
            <th scope="col">Type</th>
            <th scope="col">Action</th>
          </tr>
        </MDBTableHead>
        <MDBTableBody>
          {filteredUsers.map(
            (user) => (
              <tr key={user.id_utilisateur}>
                <td>{user.id_utilisateur}</td>
                <td>{`${user.nom} ${user.prenom}`}</td>
                <td>{user.email}</td>
                <td>{user.genre}</td>
                <td>{user.type}</td>
                <td>
                  <MDBBtn color="success" onClick={() => handleUnblockUser(user.id_utilisateur)}>
                    Débloquer
                  </MDBBtn>
                </td>
              </tr>
            )
          )}
        </MDBTableBody>
      </MDBTable>

      <ToastContainer />
      <Footer />
    </>
  );
};

export default ListeBlocage;
