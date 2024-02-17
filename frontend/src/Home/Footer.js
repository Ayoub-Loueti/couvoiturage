// CustomFooter.js
import React from 'react';

function Footer() {
  return (
    <footer
    //  className="text-center text-lg-start bg-light text-muted"
      style={{ backgroundColor: '#3A3C6C' ,color:'white'}}
    >
      <section className="d-flex justify-content-center justify-content-lg-between p-4 border-bottom">
        <div className="me-5 d-none d-lg-block">
          <span>Connectez-vous avec nous sur les réseaux sociaux :</span>
        </div>

        <div>
          <a
            href="https://www.facebook.com/TunisianPost"
            className="me-4 text-reset"
          >
            <i className="fab fa-facebook-f"></i>
          </a>
          <a href="https://twitter.com/Poste_Tn" className="me-4 text-reset">
            <i className="fab fa-twitter"></i>
          </a>
          <a href="https://www.poste.tn/" className="me-4 text-reset">
            <i className="fab fa-google"></i>
          </a>
        </div>
      </section>

      <section className="">
        <div className="container text-center text-md-start mt-5">
          <div className="row mt-3">
            <div className="col-md-3 col-lg-4 col-xl-3 mx-auto mb-4">
              <h6 className="text-uppercase fw-bold mb-4">
                <i className="fas fa-gem me-3"></i> DRIVESHARE
              </h6>
              <p>DRIVESHARE DRIVESHARE DRIVESHARE. </p>
            </div>

            <div className="col-md-2 col-lg-2 col-xl-2 mx-auto mb-4">
              <h6 className="text-uppercase fw-bold mb-4">Liens</h6>
           
              
             
            </div>

            <div className="col-md-4 col-lg-3 col-xl-3 mx-auto mb-md-0 mb-4">
              <h6 className="text-uppercase fw-bold mb-4">Contact</h6>
              <p>
                <i className="fas fa-home me-3"></i> Rue Hédi Nouira 1001, TUNIS{' '}
              </p>
              <p>
                <i className="fas fa-envelope me-3"></i>
                brc@DRIVESHARE.tn
              </p>
              <p>
                <i className="fas fa-phone me-3"></i>(+216) 71 839 000
              </p>
           
            </div>
          </div>
        </div>
      </section>

      <div className="text-center p-4">© 2023 DRIVESHARE</div>
    </footer>
  );
}

export default Footer;
