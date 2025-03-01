import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css"; // Import CSS file

export default function Register({ model }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    setIsValid(name.trim() !== "" && email.trim() !== "" && password.length >= 8);
  }, [name, email, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValid) {
      alert("Please enter valid values! Password must be at least 8 characters.");
      return;
    }

    const item = { name, email, password, amount: 0 };

    try {
      await axios.post("https://servers-z5cm.onrender.com/create", item);
      alert("Successfully Entered!");
      setSubmitted(true);
      setName("");
      setEmail("");
      setPassword("");
    } catch (error) {
      alert("Error creating account. Please try again.");
      console.error("API Error:", error);
    }
  };

  return (
    <div className="register-container">
      <h1 className="register-heading">Register</h1>

      {model || (
        <>
          {!submitted ? (
            <Form className="custom-form" onSubmit={handleSubmit}>
              <Form.Group className="mb-3 custom-form-group">
                <Form.Label className="custom-label">Name:</Form.Label>
                <Form.Control
                  className="custom-input"
                  type="text"
                  placeholder="Enter name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3 custom-form-group">
                <Form.Label className="custom-label">Email address:</Form.Label>
                <Form.Control
                  className="custom-input"
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Form.Text className="text-muted">We'll never share your email.</Form.Text>
              </Form.Group>

              <Form.Group className="mb-3 custom-form-group">
                <Form.Label className="custom-label">Password:</Form.Label>
                <Form.Control
                  className="custom-input"
                  type="password"
                  placeholder="Password (min 8 chars)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Form.Text className="text-muted">Minimum 8 characters required.</Form.Text>
              </Form.Group>

              <Button className="custom-button" variant="info" type="submit" disabled={!isValid}>
                Create Account
              </Button>
            </Form>
          ) : (
            <>
              <h3 className="success-message">Account Created Successfully!</h3>
              <Button className="custom-button" variant="secondary" onClick={() => setSubmitted(false)}>
                Add Another Account
              </Button>
            </>
          )}
        </>
      )}
    </div>
  );
}
