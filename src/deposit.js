import { useState } from "react";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Deposit() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [deposit, setDeposit] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isValid, setIsValid] = useState(false);

  // Validate form inputs
  const validateForm = () => {
    if (!email.trim() || !password.trim() || isNaN(deposit) || deposit <= 0) {
      setIsValid(false);
    } else {
      setIsValid(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    const depositAmount = parseFloat(deposit);

    if (isNaN(depositAmount) || depositAmount <= 0) {
      setErrorMessage("Invalid deposit amount.");
      return;
    }

    try {
      // Sending only email and deposit amount (password is checked on frontend)
      const response = await axios.post("https://servers-z5cm.onrender.com/data/deposit", {
        email,
        password,
        amount: depositAmount,
      });

      // If request is successful
      setSuccessMessage(`Successfully deposited ₹${depositAmount}. New balance: ₹${response.data.newBalance}`);
      setDeposit("");
      setIsValid(false);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Deposit failed. Please try again.");
    }
  };

  return (
    <div className="background">
      <h1 className="register-heading">Deposit</h1>

      {successMessage && <div className="alert alert-success">{successMessage}</div>}
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

      <Form className="custom-form" onSubmit={handleSubmit}>
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
        </Form.Group>

        <Form.Group className="mb-3 custom-form-group">
          <Form.Label className="custom-label">Password</Form.Label>
          <Form.Control
            className="custom-input"
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              validateForm();
            }}
          />
        </Form.Group>

        <Form.Group className="mb-3 custom-form-group">
          <Form.Label className="custom-label">Amount</Form.Label>
          <Form.Control
            className="custom-input"
            type="number"
            placeholder="Enter deposit amount"
            value={deposit}
            onChange={(e) => {
              setDeposit(e.target.value);
              validateForm();
            }}
          />
        </Form.Group>

        <Button className="custom-button" variant="primary" type="submit" disabled={!isValid}>
          Deposit
        </Button>
      </Form>
    </div>
  );
}
