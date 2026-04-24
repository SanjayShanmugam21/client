import { useState, useContext, useEffect } from "react";
import { Container, Card, Form, Button, Alert, Image } from "react-bootstrap";
import axios from "axios";
import UserContext from "./context";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

export default function Profile() {
    const { user, setUser } = useContext(UserContext);
    const [pin, setPin] = useState("");
    const [name, setName] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [showPin, setShowPin] = useState(false);

    useEffect(() => {
        if (user) {
            setPin(user.transactionPin || "");
            setName(user.name || "");
        }
    }, [user]);

    const handleUpdate = async (e) => {
        e.preventDefault();

        if (pin.length !== 4) {
            toast.error("PIN must be exactly 4 digits.");
            return;
        }

        try {
            const res = await axios.put("https://servers-z5cm.onrender.com/api/users/profile-update", {
                name,
                transactionPin: pin
            });
            setUser(res.data.updatedUser);
            toast.success("Profile updated successfully!");
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to update profile.");
        }
    };

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handlePhotoUpload = async (e) => {
        e.preventDefault();
        if (!selectedFile) {
            toast.error("Please select a file first.");
            return;
        }

        const formData = new FormData();
        formData.append("photo", selectedFile);

        setUploading(true);

        try {
            const res = await axios.post("https://servers-z5cm.onrender.com/api/users/upload-photo", formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
            setUser(res.data.user);
            toast.success("Photo uploaded successfully!");
            setSelectedFile(null);
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to upload photo.");
        } finally {
            setUploading(false);
        }
    };

    if (!user) return <Container className="mt-5"><h3>Please login to view your profile.</h3></Container>;

    return (
        <Container className="mt-3">
            <Card className="shadow-lg border-0 overflow-hidden mx-auto" style={{ borderRadius: "15px", maxWidth: "1100px" }}>
                <div className="profile-cover">
                    <div className="profile-avatar-container">
                        <div className="profile-avatar-wrapper">
                            <Image
                                src={user.profilePhoto ? `https://servers-z5cm.onrender.com${user.profilePhoto}` : "https://via.placeholder.com/150"}
                                className="profile-avatar-img"
                            />
                            <label htmlFor="photoUpload" className="profile-upload-btn shadow-sm">
                                <i className="bi bi-camera-fill"></i>
                            </label>
                            <input
                                type="file"
                                id="photoUpload"
                                className="d-none"
                                onChange={handleFileChange}
                                accept="image/*"
                            />
                        </div>
                    </div>
                </div>

                <div className="profile-content-header d-flex justify-content-between align-items-center">
                    <div>
                        <h4 className="fw-bold mb-0 text-dark">{user.name}</h4>
                        <p className="text-secondary mb-0 small"><i className="bi bi-envelope-fill me-2"></i>{user.email}</p>
                    </div>
                    {selectedFile && (
                        <Button
                            variant="primary"
                            size="sm"
                            className="rounded-pill px-3 py-1 small"
                            onClick={handlePhotoUpload}
                            disabled={uploading}
                        >
                            {uploading ? "Saving..." : "Save Photo"}
                        </Button>
                    )}
                </div>

                <Card.Body className="px-4 pb-4 pt-0">
                    <hr className="my-3 opacity-10" />

                    <div className="row g-3">
                        <div className="col-lg-4">
                            <div className="profile-section-card">
                                <h6 className="fw-bold mb-3 text-dark divider-left">Account Overview</h6>
                                <div className="mb-3">
                                    <span className="profile-label-main">Current Balance</span>
                                    <span className="profile-value-main text-primary fw-bold d-block">₹{user.amount.toLocaleString()}</span>
                                </div>
                                <div className="mb-3">
                                    <span className="profile-label-main">Account Type</span>
                                    <span className="profile-value-main small">Standard Savings</span>
                                </div>
                                <div className="mb-0">
                                    <span className="profile-label-main">Member Since</span>
                                    <span className="profile-value-main small">October 2024</span>
                                </div>
                                {user.role?.toLowerCase().trim() === 'admin' && (
                                    <div className="mt-4 pt-3 border-top">
                                        <Link to="/alldata">
                                            <Button variant="outline-primary" size="sm" className="w-100 fw-bold shadow-sm rounded-pill">
                                                <i className="bi bi-people-fill me-2"></i> All User Details
                                            </Button>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="col-lg-8">
                            <div className="profile-section-card">
                                <h6 className="fw-bold mb-3 text-dark divider-left">Security & Preferences</h6>
                                <Form onSubmit={handleUpdate}>
                                    <div className="row">
                                        <div className="col-md-6 mb-2">
                                            <Form.Group>
                                                <Form.Label className="fw-bold text-secondary" style={{ fontSize: '0.7rem', textTransform: 'uppercase' }}>Full Name</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    size="sm"
                                                    className="profile-form-input"
                                                    value={name}
                                                    onChange={(e) => setName(e.target.value)}
                                                    required
                                                />
                                            </Form.Group>
                                        </div>
                                        <div className="col-md-6 mb-2">
                                            <Form.Group style={{ position: 'relative' }}>
                                                <Form.Label className="fw-bold text-secondary" style={{ fontSize: '0.7rem', textTransform: 'uppercase' }}>4-Digit PIN</Form.Label>
                                                <Form.Control
                                                    type={showPin ? "text" : "password"}
                                                    size="sm"
                                                    maxLength="4"
                                                    className="profile-form-input"
                                                    style={{ paddingRight: '35px' }}
                                                    value={pin}
                                                    onChange={(e) => setPin(e.target.value)}
                                                    required
                                                />
                                                <span
                                                    onClick={() => setShowPin(!showPin)}
                                                    style={{ position: 'absolute', right: '10px', bottom: '10px', cursor: 'pointer', zIndex: 10, color: '#546e7a' }}
                                                >
                                                    <i className={`bi bi-eye${showPin ? '-slash' : ''}-fill`}></i>
                                                </span>
                                            </Form.Group>
                                        </div>
                                    </div>
                                    <div className="mt-3">
                                        <Button
                                            variant="dark"
                                            type="submit"
                                            size="sm"
                                            className="px-4 py-1 fw-bold shadow-sm rounded-pill"
                                        >
                                            Save Changes
                                        </Button>
                                    </div>
                                </Form>
                            </div>
                        </div>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );
}
