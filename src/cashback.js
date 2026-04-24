import { useState, useContext } from "react";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import "bootstrap/dist/css/bootstrap.min.css";
import UserContext from './context';
import { toast } from "react-toastify";

export default function Withdraw() {
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [pin, setPin] = useState("");
  const [showPin, setShowPin] = useState(false);
  const { user, setUser } = useContext(UserContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const amountToWithdraw = parseFloat(withdrawAmount);
    if (isNaN(amountToWithdraw) || amountToWithdraw <= 0) {
      toast.error("Please enter a valid withdrawal amount.");
      return;
    }

    if (pin.length !== 4) {
      toast.error("Transaction PIN must be 4 digits.");
      return;
    }

    try {
      const response = await axios.post("https://servers-z5cm.onrender.com/api/users/withdraw", {
        amount: amountToWithdraw,
        pin: pin
      });

      toast.success(`Successfully withdrawn ₹${amountToWithdraw}.`);
      setUser({ ...user, amount: response.data.newBalance, transactions: response.data.transactions });
      setWithdrawAmount("");
      setPin("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Withdrawal failed. Please try again.");
    }
  };

  if (!user) return <div className="container mt-5"><h3>Please login to withdraw money.</h3></div>;

  return (
    <div className="container pb-5">
      <div className="bank-form-container">
        <div className="bank-form-header" style={{ background: "linear-gradient(135deg, #2c3e50 0%, #34495e 100%)" }}>
          <h2 className="fw-bold mb-0">Withdraw Funds</h2>
          <p className="opacity-75 mb-0">Secure Cash Withdrawal</p>
          <div className="bank-balance-card mt-3">
            <span className="d-block small text-uppercase opacity-75">Available Balance</span>
            <span className="h3 fw-bold mb-0">₹{user.amount.toLocaleString()}</span>
          </div>
        </div>

        <div className="bank-form-body">

          <Form onSubmit={handleSubmit}>
            <div className="bank-input-group">
              <label className="bank-label">Withdrawal Amount</label>
              <div className="bank-input-wrapper">
                <span className="bank-currency-symbol">₹</span>
                <input
                  className="bank-input"
                  type="number"
                  placeholder="0.00"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  required
                />
              </div>
              <Form.Text className="text-muted">Funds will be deducted from your available balance.</Form.Text>
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
              <Form.Text className="text-muted">Enter your secure 4-digit PIN to authorize this withdrawal.</Form.Text>
            </div>

            <button
              className="bank-submit-btn shadow-sm"
              type="submit"
              style={{ background: "#2c3e50" }}
              onMouseOver={(e) => e.target.style.background = "#34495e"}
              onMouseOut={(e) => e.target.style.background = "#2c3e50"}
              disabled={!withdrawAmount || pin.length !== 4}
            >
              Verify & Withdraw
            </button>
          </Form>
        </div>
      </div>
    </div>
  );
}
