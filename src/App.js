import './App.css';
import { Navbar, Nav, Container } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import bank from './bank.avif'; // Importing the logo
import { HashRouter, Routes, Route } from 'react-router-dom';
import Deposit from './deposit';
import Cashback from './cashback';
import Register from './register';
import Alldata from './alldata';
import Carousel from 'react-bootstrap/Carousel';
import Slide1 from './sile1.avif';
import Slide2 from './sile2.avif';
import Slide3 from './sile3.avif';
import {useState} from 'react';


function App() {
let [isModel, setIsModel]=useState(true);

  return (
    <HashRouter>
     
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand href="#home">
            <img
              src={bank} // Use the imported image here
              alt="Logo"
              className="d-inline-block align-top"
              style={{ width: "30px", height: "30px" }}  // Optional: adjust size
            />
            {" "}SanZen Bank
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbar-nav" />
          <Navbar.Collapse id="navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link href="#home" onClick={()=>setIsModel(true)} >Home </Nav.Link>
              <Nav.Link href="#register" onClick={()=>setIsModel(false)}>Register </Nav.Link>
              <Nav.Link href="#deposit" onClick={()=>setIsModel(false)}>Deposit</Nav.Link>
              <Nav.Link href="#cashback" onClick={()=>setIsModel(false)}>Cashback</Nav.Link>
              <Nav.Link href="#alldata" onClick={()=>setIsModel(false)}>All data</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
     

{ isModel && <Carousel className="custom-carousel" data-bs-theme="dark">
  <Carousel.Item className="custom-carousel-item">
    <img
      className="d-block w-100 custom-image"
      src={Slide1}
      alt="First slide"
    />
    <Carousel.Caption className="custom-caption">
      <h5 className="custom-caption-title">Register</h5>
      <p className="custom-caption-text">Time is money.</p>
    </Carousel.Caption>
  </Carousel.Item>

  <Carousel.Item className="custom-carousel-item">
    <img
      className="d-block w-100 custom-image"
      src={Slide2}
      alt="Second slide"
    />
    <Carousel.Caption className="custom-caption">
      <h5 className="custom-caption-title">Deposit</h5>
      <p className="custom-caption-text">Little by little, a little becomes a lot.</p>
    </Carousel.Caption>
  </Carousel.Item>

  <Carousel.Item className="custom-carousel-item">
    <img
      className="d-block w-100 custom-image"
      src={Slide3}
      alt="Third slide"
    />
    <Carousel.Caption className="custom-caption">
      <h5 className="custom-caption-title">withdraw</h5>
      <p className="custom-caption-text">
        Do not spend your money before you have earned it.
      </p>
    </Carousel.Caption>
  </Carousel.Item>
</Carousel>}

      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/deposit" element={<Deposit />} />
        <Route path="/cashback" element={<Cashback />} />
        <Route path="/alldata" element={<Alldata />} />
      </Routes>
      
      <footer>&copy; SanZen Bank 2025</footer>
    </ HashRouter>
  );
}

export default App;
