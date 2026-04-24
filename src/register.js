import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import "./App.css";
import UserContext from './context';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const { setToken, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    setIsValid(name.trim() !== "" && email.trim() !== "" && password.length >= 8);
  }, [name, email, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValid) {
      toast.error("Please enter valid values! Password must be at least 8 characters.");
      return;
    }

    try {
      const res = await axios.post("https://servers-z5cm.onrender.com/api/auth/register", { name, email, password });

      // Special toast for PIN that doesn't close automatically so user can read it
      toast.success("Welcome aboard! Account created successfully.", { autoClose: 2000 });
      toast.info(`Your Transaction PIN is: ${res.data.user.transactionPin}. Please save it for all transactions.`, {
        autoClose: false,
        closeOnClick: false,
        draggable: false
      });

      setToken(res.data.token);
      setUser(res.data.user);
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed. Try again.");
    }
  };

  return (
    <div className="container py-3 d-flex justify-content-center align-items-center" style={{ height: "calc(100vh - 120px)" }}>
      <div className="bank-form-container">
        <div className="bank-form-header">
          <h2 className="fw-bold mb-0">Join SanZen Bank</h2>
          <p className="opacity-75 mb-0">Start your premium banking journey</p>
        </div>
        <div className="bank-form-body p-4">
          <Form onSubmit={handleSubmit}>
            <div className="bank-input-group mb-3">
              <label className="bank-label">Full Name</label>
              <div className="bank-input-wrapper">
                <span className="bank-currency-symbol">
                  <i className="bi bi-person-fill"></i>
                </span>
                <input
                  className="bank-input"
                  type="text"
                  placeholder="Enter your name"
                  style={{ paddingLeft: "40px" }}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="bank-input-group mb-3">
              <label className="bank-label">Email address</label>
              <div className="bank-input-wrapper">
                <span className="bank-currency-symbol">
                  <i className="bi bi-envelope-fill"></i>
                </span>
                <input
                  className="bank-input"
                  type="email"
                  placeholder="name@example.com"
                  style={{ paddingLeft: "40px" }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <Form.Text className="text-muted small">We'll never share your email with anyone else.</Form.Text>
            </div>

            <div className="bank-input-group mb-4">
              <label className="bank-label">Secure Password</label>
              <div className="bank-input-wrapper">
                <input
                  className="bank-input"
                  type={showPassword ? "text" : "password"}
                  placeholder="Min 8 characters"
                  style={{ paddingLeft: "15px", paddingRight: "45px" }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '15px', cursor: 'pointer', color: '#546e7a' }}
                >
                  <i className={`bi bi-eye${showPassword ? '-slash' : ''}-fill`}></i>
                </span>
              </div>
            </div>

            <button className="bank-submit-btn shadow-sm" type="submit" disabled={!isValid}>
              Create Account
            </button>

            <div className="text-center mt-4">
              <p className="small text-muted mb-0">Already have an account?</p>
              <Link to="/login" className="fw-bold text-primary text-decoration-none small">Click here to Sign In</Link>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}
