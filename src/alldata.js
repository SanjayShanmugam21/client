import axios from 'axios';
import { useState, useEffect, useContext } from "react";
import { Container, Table, Button, Card, Row, Col, Form, Modal, Pagination, Badge } from "react-bootstrap";
import UserContext from './context';
import { toast } from 'react-toastify';
import './App.css';

export default function Alldata() {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const { user, token } = useContext(UserContext);

    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };

    useEffect(() => {
        if (user && user.role === 'admin') {
            fetchData();
        }
    }, [user]);

    const fetchData = async () => {
        try {
            const response = await axios.get('https://servers-z5cm.onrender.com/api/users', config);
            setUsers(response.data);
        } catch (error) {
            toast.error("Failed to fetch user data");
            console.error(error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Permanent Action: Are you sure you want to remove this user from the records?")) return;

        try {
            await axios.delete(`https://servers-z5cm.onrender.com/api/users/${id}`, config);
            setUsers(users.filter(u => u._id !== id));
            toast.success("User deleted successfully");
        } catch (error) {
            toast.error("Error deleting user");
        }
    };

    const handleOpenModal = (u) => {
        setSelectedUser({ ...u });
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedUser(null);
    };

    const handleUpdate = async () => {
        try {
            await axios.put(`https://servers-z5cm.onrender.com/api/users/${selectedUser._id}`, selectedUser, config);
            setUsers(users.map(u => (u._id === selectedUser._id ? selectedUser : u)));
            toast.success("User updated successfully");
            handleCloseModal();
        } catch (error) {
            toast.error("Update failed");
        }
    };

    if (!user || user.role !== 'admin') {
        return (
            <Container className="mt-5 text-center">
                <div className="p-5 border rounded-3 bg-light shadow-sm">
                    <i className="bi bi-shield-lock-fill text-danger" style={{ fontSize: "3rem" }}></i>
                    <h2 className="fw-bold mt-3">Access Restricted</h2>
                    <p className="text-muted">You do not have administrative privileges to view this page.</p>
                </div>
            </Container>
        );
    }

    // Filtering & Pagination
    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalAssets = users.reduce((sum, u) => sum + u.amount, 0);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

    return (
        <Container className="mt-4 mb-5">
            <h3 className="fw-bold mb-4 text-dark d-flex align-items-center">
                <i className="bi bi-gear-fill me-3 text-primary"></i> Admin Control Panel
            </h3>

            <Row className="g-3 mb-4">
                <Col md={4}>
                    <Card className="border-0 shadow-sm p-3 text-center bg-primary text-white">
                        <span className="small opacity-75 text-uppercase fw-bold">Total Registered Users</span>
                        <h2 className="fw-bold mb-0">{users.length}</h2>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="border-0 shadow-sm p-3 text-center bg-success text-white">
                        <span className="small opacity-75 text-uppercase fw-bold">Total Bank Assets</span>
                        <h2 className="fw-bold mb-0">₹{totalAssets.toLocaleString()}</h2>
                    </Card>
                </Col>
                <Col md={4}>
                    <Form.Control
                        placeholder="Search by name or email..."
                        className="shadow-sm border-0 p-3 h-100 rounded-3"
                        value={searchTerm}
                        onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                    />
                </Col>
            </Row>

            <Card className="shadow-lg tracking-card border-0">
                <Card.Header className="bg-white border-0 py-3 px-4">
                    <h5 className="fw-bold mb-0">User Registry</h5>
                </Card.Header>
                <Card.Body className="px-4 pb-4 pt-0">
                    <Table hover responsive striped className="history-table border">
                        <thead className="table-light">
                            <tr>
                                <th>Account Holder</th>
                                <th>Role</th>
                                <th>Balance</th>
                                <th>Security PIN</th>
                                <th className="text-end">Maintenance</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentUsers.map((u) => (
                                <tr key={u._id} className="align-middle">
                                    <td>
                                        <div className="fw-bold">{u.name}</div>
                                        <div className="text-muted small">{u.email}</div>
                                    </td>
                                    <td>
                                        <Badge bg={u.role === 'admin' ? 'dark' : 'secondary'} pill style={{ fontSize: '0.7rem' }}>
                                            {u.role.toUpperCase()}
                                        </Badge>
                                    </td>
                                    <td className="fw-bold text-dark small">₹{u.amount.toLocaleString()}</td>
                                    <td><code className="text-primary">{u.transactionPin}</code></td>
                                    <td className="text-end">
                                        <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleOpenModal(u)}>
                                            <i className="bi bi-pencil-square"></i>
                                        </Button>
                                        <Button variant="outline-danger" size="sm" onClick={() => handleDelete(u._id)}>
                                            <i className="bi bi-trash3"></i>
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>

                    {totalPages > 1 && (
                        <div className="d-flex justify-content-between align-items-center mt-4">
                            <div className="text-muted small fw-bold">
                                Page {currentPage} / ({totalPages}) of {filteredUsers.length} users
                            </div>
                            <Pagination className="mb-0 custom-pagination pagination-sm">
                                <Pagination.Prev onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} />
                                {[...Array(totalPages)].map((_, i) => (
                                    <Pagination.Item key={i + 1} active={i + 1 === currentPage} onClick={() => setCurrentPage(i + 1)}>
                                        {i + 1}
                                    </Pagination.Item>
                                ))}
                                <Pagination.Next onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} />
                            </Pagination>
                        </div>
                    )}
                </Card.Body>
            </Card>

            {/* Update User Modal */}
            <Modal show={showModal} onHide={handleCloseModal} centered>
                <Modal.Header closeButton className="border-0">
                    <Modal.Title className="fw-bold">Modify User Account</Modal.Title>
                </Modal.Header>
                <Modal.Body className="px-4 pb-4">
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label className="small fw-bold text-muted">FULL NAME</Form.Label>
                            <Form.Control
                                type="text"
                                className="profile-form-input"
                                value={selectedUser?.name || ""}
                                onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label className="small fw-bold text-muted">EMAIL ADDRESS</Form.Label>
                            <Form.Control
                                type="email"
                                className="profile-form-input"
                                value={selectedUser?.email || ""}
                                onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
                            />
                        </Form.Group>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="small fw-bold text-muted">BALANCE (₹)</Form.Label>
                                    <Form.Control
                                        type="number"
                                        className="profile-form-input"
                                        value={selectedUser?.amount || 0}
                                        onChange={(e) => setSelectedUser({ ...selectedUser, amount: Number(e.target.value) })}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="small fw-bold text-muted">TX PIN</Form.Label>
                                    <Form.Control
                                        type="text"
                                        maxLength="4"
                                        className="profile-form-input"
                                        value={selectedUser?.transactionPin || ""}
                                        onChange={(e) => setSelectedUser({ ...selectedUser, transactionPin: e.target.value })}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Form.Group className="mb-4">
                            <Form.Label className="small fw-bold text-muted">ROLE</Form.Label>
                            <Form.Select
                                className="profile-form-input"
                                value={selectedUser?.role || "user"}
                                onChange={(e) => setSelectedUser({ ...selectedUser, role: e.target.value })}
                            >
                                <option value="user">USER</option>
                                <option value="admin">ADMIN</option>
                            </Form.Select>
                        </Form.Group>
                        <Button variant="primary" className="w-100 py-3 fw-bold shadow-sm" onClick={handleUpdate}>
                            Save Changes
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </Container>
    );
}
