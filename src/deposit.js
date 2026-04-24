import { useState, useContext } from "react";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import "bootstrap/dist/css/bootstrap.min.css";
import UserContext from './context';
import { toast } from "react-toastify";

export default function Deposit() {
  const [deposit, setDeposit] = useState("");
  const [pin, setPin] = useState("");
  const [showPin, setShowPin] = useState(false);
  const { user, setUser } = useContext(UserContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const depositAmount = parseFloat(deposit);

    if (isNaN(depositAmount) || depositAmount <= 0) {
      toast.error("Invalid deposit amount.");
      return;
    }

    if (pin.length !== 4) {
      toast.error("Transaction PIN must be 4 digits.");
      return;
    }

    try {
      const response = await axios.post("https://servers-z5cm.onrender.com/api/users/deposit", {
        amount: depositAmount,
        pin: pin
      });

      toast.success(`Successfully deposited ₹${depositAmount}.`);
      setUser({ ...user, amount: response.data.newBalance, transactions: response.data.transactions });
      setDeposit("");
      setPin("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Deposit failed. Please try again.");
    }
  };

  if (!user) return <div className="container mt-5"><h3>Please login to deposit money.</h3></div>;

  return (
    <div className="container pb-5">
      <div className="bank-form-container">
        <div className="bank-form-header">
          <h2 className="fw-bold mb-0">Deposit Funds</h2>
          <p className="opacity-75 mb-0">Secure Instant Deposit</p>
          <div className="bank-balance-card mt-3">
            <span className="d-block small text-uppercase opacity-75">Available Balance</span>
            <span className="h3 fw-bold mb-0">₹{user.amount.toLocaleString()}</span>
          </div>
        </div>

        <div className="bank-form-body">

          <Form onSubmit={handleSubmit}>
            <div className="bank-input-group">
              <label className="bank-label">Deposit Amount</label>
              <div className="bank-input-wrapper">
                <span className="bank-currency-symbol">₹</span>
                <input
                  className="bank-input"
                  type="number"
                  placeholder="0.00"
                  value={deposit}
                  onChange={(e) => setDeposit(e.target.value)}
                  required
                />
              </div>
              <Form.Text className="text-muted">Enter the amount you wish to add to your account.</Form.Text>
            </div>

            <div className="bank-input-group">
              <label className="bank-label">Transaction PIN</label>
              <div className="bank-input-wrapper">
                <input
                  className="bank-input"
                  type={showPin ? "text" : "password"}
                  maxLength="4"
                  placeholder="••••"
                  style={{ paddingLeft: "15px", paddingRight: "45px" }}
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  required
                />
                <span
                  onClick={() => setShowPin(!showPin)}
                  style={{ position: 'absolute', right: '15px', cursor: 'pointer', color: '#546e7a' }}
                >
                  <i className={`bi bi-eye${showPin ? '-slash' : ''}-fill`}></i>
                </span>
              </div>
              <Form.Text className="text-muted">For security, please enter your 4-digit PIN.</Form.Text>
            </div>

            <button className="bank-submit-btn shadow-sm" type="submit" disabled={!deposit || pin.length !== 4}>
              Process Deposit
            </button>
          </Form>
        </div>
      </div>
    </div>
  );
}
