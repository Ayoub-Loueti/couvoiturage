import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Footer from '../Home/Footer';
import MyNavbar from '../Home/navbar';


function Login() {
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:3006/login', {
        email,
        motDePasse,
      });

      const token = response.data.token;
      localStorage.setItem(
        'login',
        JSON.stringify({
          isAuthenticated: true,
          token: token,
        })
      );

      // Display a success toast
      toast.success('Login successful!', { position: toast.POSITION.TOP_CENTER });

      navigate('/');
    } catch (error) {
      // Handle error and display appropriate toast messages
      if (error.response) {
        if (error.response.data.error === 'Login failed. Your account is blocked.') {
          toast.error('Your account is blocked. Please contact the administrator.', {
            position: toast.POSITION.TOP_CENTER,
          });
        } else {
          toast.error('Invalid email or password.', { position: toast.POSITION.TOP_CENTER });
        }
      } else if (error.request) {
        toast.error('Network Error. Please try again later.', { position: toast.POSITION.TOP_CENTER });
      } else {
        toast.error('An error occurred. Please try again later.', { position: toast.POSITION.TOP_CENTER });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
       <MyNavbar></MyNavbar>
      <div className="container mt-5">
        <div
          className="card p-5 mx-auto"
          style={{
            maxWidth: '540px',
            background: '#f8f9fa',
            border: '1px solid #3A3C6C',
            borderRadius: '10px',
          }}
        >
          <h3 className="mb-4 text-center">Connectez-vous à votre compte:</h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Adresse e-mail:
              </label>
              <input
                type="email"
                className="form-control"
                style={{ border: '1px solid #3A3C6C' }}
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Mot de passe:
              </label>
              <input
                type="password"
                className="form-control"
                style={{ border: '1px solid #3A3C6C' }}
                id="password"
                value={motDePasse}
                onChange={(e) => setMotDePasse(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary d-block mx-auto"
              style={{ background: '#3A3C6C', border: 'none' }}
            >
              Connecter
            </button>

            <div className="d-flex justify-content-center mt-4">
              <p className="mb-0 me-2">Vous n'êtes pas inscrit(e) ?</p>
              <Link
                to="/signup"
                className="btn btn-outline-secondary"
                style={{ color: '#3A3C6C', border: '1px solid #3A3C6C' }}
              >
                Créer un nouveau compte
              </Link>
            </div>
          </form>
        </div>
      </div>{' '}
      <br></br> <br></br> <br></br> <br></br> <br></br> <br></br>
      <ToastContainer />
      <Footer></Footer>
    </>
  );
}

export default Login;
