import { useState, useContext } from 'react';
import { Form, Button, Card, Container, InputGroup } from 'react-bootstrap';
import axios from 'axios';
import UserContext from './context';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { setToken, setUser } = useContext(UserContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('https://servers-z5cm.onrender.com/api/auth/login', { email, password });
            setToken(res.data.token);
            setUser(res.data.user);
            toast.success("Login Successful! Welcome back.");
            navigate('/');
        } catch (err) {
            toast.error(err.response?.data?.message || "Login failed. Please check your credentials.");
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ height: "calc(100vh - 120px)" }}>
            <div className="bank-form-container">
                <div className="bank-form-header">
                    <h2 className="fw-bold mb-0">Secure Login</h2>
                    <p className="opacity-75 mb-0">Access your account safely</p>
                </div>
                <div className="bank-form-body p-4">
                    <Form onSubmit={handleSubmit}>
                        <div className="bank-input-group mb-3">
                            <label className="bank-label">Email Address</label>
                            <div className="bank-input-wrapper">
                                <span className="bank-currency-symbol">
                                    <i className="bi bi-envelope-fill"></i>
                                </span>
                                <input
                                    className="bank-input"
                                    type="email"
                                    placeholder="your@email.com"
                                    style={{ paddingLeft: "40px" }}
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="bank-input-group mb-4">
                            <label className="bank-label">Password</label>
                            <div className="bank-input-wrapper">
                                <input
                                    className="bank-input"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    style={{ paddingLeft: "15px", paddingRight: "45px" }}
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
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

                        <button className="bank-submit-btn shadow-sm" type="submit">
                            Sign In
                        </button>

                        <div className="text-center mt-4">
                            <p className="small text-muted mb-0">Don't have an account?</p>
                            <Link to="/register" className="fw-bold text-primary text-decoration-none small">Create a new account</Link>
                        </div>
                    </Form>
                </div>
            </div>
        </Container>
    );
}
