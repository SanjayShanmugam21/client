import './App.css';
import { Navbar, Nav, Container, Button, Modal } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import logoSanZen from './logo_sanzen.svg';
import { useLocation, Routes, Route, Link } from 'react-router-dom';
import Deposit from './deposit';
import Cashback from './cashback';
import Register from './register';
import Login from './login';
import Alldata from './alldata';
import TransactionHistory from './TransactionHistory';
import Profile from './Profile';
import Carousel from 'react-bootstrap/Carousel';
import Slide1 from './sile1.avif';
import Slide2 from './sile2.avif';
import Slide3 from './sile3.avif';
import { useState, useContext } from 'react';
import UserContext from './context';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const location = useLocation();
  const { user, logout } = useContext(UserContext);
  const isHomePage = location.pathname === '/';
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const confirmLogout = () => {
    logout();
    setShowLogoutModal(false);
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop />
      <Navbar expand="lg" variant="dark" className="navbar-custom sticky-top">
        <Container>
          <Navbar.Brand as={Link} to="/" className="navbar-brand-custom">
            <img
              src={logoSanZen}
              alt="Logo"
              className="d-inline-block align-top me-2 logo-glow"
              style={{ width: "45px", height: "45px" }}
            />
            SanZen Bank
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbar-nav" className="border-0" />
          <Navbar.Collapse id="navbar-nav">
            <Nav className="ms-auto align-items-center">
              <Nav.Link as={Link} to="/" className="nav-link-custom">Home</Nav.Link>

              {!user ? (
                <>
                  <Nav.Link as={Link} to="/register" className="nav-link-custom">Register</Nav.Link>
                  <Nav.Link as={Link} to="/login" className="nav-link-custom">Login</Nav.Link>
                </>
              ) : (
                <>
                  <Nav.Link as={Link} to="/deposit" className="nav-link-custom">Deposit</Nav.Link>
                  <Nav.Link as={Link} to="/cashback" className="nav-link-custom">Withdraw</Nav.Link>
                  <Nav.Link as={Link} to="/history" className="nav-link-custom">Tracking</Nav.Link>
                  <Nav.Link as={Link} to="/profile" className="nav-link-custom">Profile</Nav.Link>
                  {user.role?.toLowerCase().trim() === 'admin' && (
                    <Nav.Link as={Link} to="/alldata" className="nav-link-custom">All Data</Nav.Link>
                  )}
                  <div className="navbar-user-section ms-lg-3 mt-3 mt-lg-0">
                    {user.profilePhoto ? (
                      <img
                        src={`https://servers-z5cm.onrender.com${user.profilePhoto}`}
                        alt="Profile"
                        className="rounded-circle navbar-profile-img"
                      />
                    ) : (
                      <div className="rounded-circle bg-primary d-flex align-items-center justify-content-center text-white" style={{ width: "35px", height: "35px", fontSize: "0.8rem" }}>
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="text-light fw-500">Hi, {user.name.split(' ')[0]}</span>
                    <Button variant="outline-danger" size="sm" onClick={() => setShowLogoutModal(true)} className="logout-btn-custom ms-2">Logout</Button>
                  </div>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {isHomePage && (
        <Carousel className="custom-carousel" data-bs-theme="dark">
          <Carousel.Item className="custom-carousel-item">
            <img className="d-block w-100 custom-image" src={Slide1} alt="First slide" />
            <Carousel.Caption className="custom-caption">
              <h5 className="custom-caption-title">Register</h5>
              <p className="custom-caption-text">Time is money.</p>
            </Carousel.Caption>
          </Carousel.Item>

          <Carousel.Item className="custom-carousel-item">
            <img className="d-block w-100 custom-image" src={Slide2} alt="Second slide" />
            <Carousel.Caption className="custom-caption">
              <h5 className="custom-caption-title">Deposit</h5>
              <p className="custom-caption-text">Little by little, a little becomes a lot.</p>
            </Carousel.Caption>
          </Carousel.Item>

          <Carousel.Item className="custom-carousel-item">
            <img className="d-block w-100 custom-image" src={Slide3} alt="Third slide" />
            <Carousel.Caption className="custom-caption">
              <h5 className="custom-caption-title">Withdraw</h5>
              <p className="custom-caption-text">Do not spend your money before you have earned it.</p>
            </Carousel.Caption>
          </Carousel.Item>
        </Carousel>
      )}

      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/deposit" element={<Deposit />} />
        <Route path="/cashback" element={<Cashback />} />
        <Route path="/history" element={<TransactionHistory />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/alldata" element={<Alldata />} />
      </Routes>
      <Modal show={showLogoutModal} onHide={() => setShowLogoutModal(false)} centered>
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="fw-bold">Confirm Logout</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center py-4">
          <i className="bi bi-box-arrow-right text-danger mb-3" style={{ fontSize: "3rem" }}></i>
          <p className="mb-0">Are you sure you want to log out of your session?</p>
        </Modal.Body>
        <Modal.Footer className="border-0 justify-content-center pb-4">
          <Button variant="secondary" className="px-4 rounded-pill" onClick={() => setShowLogoutModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" className="px-4 rounded-pill" onClick={confirmLogout}>
            Logout
          </Button>
        </Modal.Footer>
      </Modal>

      <footer className="mt-5">&copy; SanZen Bank 2025</footer>
    </>
  );
}

export default App;
