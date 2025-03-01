import { useState } from "react";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Withdraw() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isValid, setIsValid] = useState(false);

  // Validate form inputs
  const validateForm = () => {
    if (!email.trim() || !password.trim() || isNaN(withdrawAmount) || withdrawAmount <= 0) {
      setIsValid(false);
    } else {
      setIsValid(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate withdrawal amount
    const amountToWithdraw = parseFloat(withdrawAmount);
    if (isNaN(amountToWithdraw) || amountToWithdraw <= 0) {
      alert("Please enter a valid withdrawal amount.");
      return;
    }

    try {
      // Send withdrawal request to backend
      const response = await axios.post("https://servers-z5cm.onrender.com/data/withdraw", {
        email,
        amount: amountToWithdraw,
      });

      // Show success message
      setSuccessMessage(`Successfully withdrawn ₹${amountToWithdraw}. Your new balance is ₹${response.data.newBalance}.`);
      
      // Reset form
      setWithdrawAmount("");
      setIsValid(false);
    } catch (error) {
      alert(error.response?.data?.message || "Withdrawal failed. Please try again.");
    }
  };

  return (
    <div className="background">
      <h1 className="register-heading">Withdraw</h1>
      
      {successMessage && <div className="alert alert-success">{successMessage}</div>}

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
            placeholder="Enter withdrawal amount"
            value={withdrawAmount}
            onChange={(e) => {
              setWithdrawAmount(e.target.value);
              validateForm();
            }}
          />
        </Form.Group>

        <Button className="custom-button" variant="primary" type="submit" disabled={!isValid}>
          Withdraw
        </Button>
      </Form>
    </div>
  );
}
