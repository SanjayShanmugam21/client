import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import "bootstrap/dist/css/bootstrap.min.css";
import {  useState } from "react";
// import UserContext from "./context";
import axios from 'axios';

export default function Register({ model }) {
  // const users = useContext(UserContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isValid, setIsValid] = useState(false);

  const validateForm = () => {
    if (name.trim() === "" || email.trim() === "" || password.length < 8) {
      setIsValid(false);
    } else {
      setIsValid(true);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (name.trim() === "" || email.trim() === "" || password.length < 8) {
      alert("Please enter valid values! Password must be at least 8 characters.");
      return;
    }

    alert("Successfully Entered!");
    
    let item ={name, email, password, amount: 0}
    axios.post('http://localhost:8080/create',item);

    // Reset form
    setName("");
    setEmail("");
    setPassword("");
    setSubmitted(true);
    setIsValid(false);
  };

  return (
    <>

      <h1 className="register-heading">Register</h1>

      {model || (
        <>
          {!submitted ? (
            <Form className="custom-form" onSubmit={handleSubmit}>
              <Form.Group className="mb-3 custom-form-group">
                <Form.Label className="custom-label">Name :</Form.Label>
                <Form.Control
                  className="custom-input"
                  type="text"
                  placeholder="Enter name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    validateForm();
                  }}
                />
              </Form.Group>

              <Form.Group className="mb-3 custom-form-group">
                <Form.Label className="custom-label">Email address</Form.Label>
                <Form.Control
                  className="custom-input"
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    validateForm();
                  }}
                />
                <Form.Text className="text-muted">
                  We'll never share your email with anyone else.
                </Form.Text>
              </Form.Group>

              <Form.Group className="mb-3 custom-form-group">
                <Form.Label className="custom-label">Password</Form.Label>
                <Form.Control
                  className="custom-input"
                  type="password"
                  placeholder="Password (min 8 chars)"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    validateForm();
                  }}
                />
                 <Form.Text className="text-muted">
                 Minium 8 characters
                </Form.Text>
              </Form.Group>

              <Button className="custom-button" variant="info" type="submit" disabled={!isValid}>
                Create Account
              </Button>
            </Form>
          ) : (
            <>
              <h3 className="success-message">Account Created Successfully!</h3>
              <Button
                className="custom-button"
                variant="secondary"
                onClick={() => setSubmitted(false)}
              >
                Add Another Account
              </Button>
              
            </>
          )}
        </>
      )}
    </>
  );
}
