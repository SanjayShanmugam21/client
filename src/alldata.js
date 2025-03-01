import axios from 'axios';
import { useState, useEffect } from "react";
import './index.css'
export default function Alldata() {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showModal, setShowModal] = useState(false);

    // Fetch data from backend
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get('https://servers-z5cm.onrender.com/data');
            setUsers(response.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    // Delete user function
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this user?")) {
            return;
        }

        try {
            await axios.delete(`https://servers-z5cm.onrender.com/data/${id}`);
           
            setUsers(users.filter(user => user._id !== id));
            console.log(users)
        
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    };

    // Open modal 
    const handleOpenModal = (user) => {
        console.log(user)
        setSelectedUser({ ...user }); 
        setShowModal(true);
    };

    // Close modal
    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedUser(null);
    };

    console.log(showModal)
    const handleInputChange = (e) => {
        setSelectedUser({ ...selectedUser, [e.target.name]: e.target.value });
    };

    const handleUpdate = async () => {
        if (!selectedUser) return;
    
        try {
            await axios.put(`https://servers-z5cm.onrender.com/data/${selectedUser._id}`, selectedUser);
    console.log(selectedUser)
            setUsers(users.map(user => (user._id === selectedUser._id ? selectedUser : user)));
            handleCloseModal();
        } catch (error) {
            console.error("Error updating user:", error);
        }
    };

    let t= ` 
    <style>
    /* General Styles */
body {
  font-family: 'Poppins', sans-serif;
  background-color: #f5f5f5;
  margin: 0;
  padding: 0;
}


button {
  padding: 8px 12px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  transition: 0.3s;
}

button:hover {
  opacity: 0.8;
}

button:nth-child(1) {
  background: #ff4d4d;
  color: white;
}

button:nth-child(2) {
  background: #28a745;
  color: white;
}

/* Modal Styling */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 10px;
  width: 400px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  text-align: center;
  animation: fadeIn 0.3s ease-in-out;
}

.modal-content h2 {
  margin-bottom: 15px;
  color: #333;
}

.modal-content label {
  display: block;
  margin: 10px 0 5px;
  font-weight: bold;
  color: #555;
}

.modal-content input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-bottom: 10px;
  font-size: 14px;
}

.modal-content button {
  margin: 10px 5px;
}

/* Animation */
@keyframes fadeIn {
  from {
      opacity: 0;
      transform: scale(0.9);
  }
  to {
      opacity: 1;
      transform: scale(1);
  }
}

    </style>`

   let show=(showModal===true) ? 
   document.getElementById("show").innerHTML=t
    
: null;
    return (
        <>
            <h1>All Users</h1>
            <table className="table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Password</th>
                        <th>Amount</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user._id}>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.password}</td>
                            <td>{user.amount}</td>
                            <td>
                                <button onClick={() => handleDelete(user._id)}>Delete</button>
                                <button onClick={() => handleOpenModal(user)}>Update</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Update Modal */}
            <div id="show">

            </div>
            {showModal && (
    <div className="modal">
        <div className="modal-content">
            <h2>Update User</h2>
            <label>Name:</label>
            <input
                type="text"
                name="name"
                value={selectedUser?.name || ""}
                onChange={handleInputChange}
            />

            <label>Email:</label>
            <input
                type="email"
                name="email"
                value={selectedUser?.email || ""}
                onChange={handleInputChange}
            />

            <label>Password:</label>
            <input
                type="text"
                name="password"
                value={selectedUser?.password || ""}
                onChange={handleInputChange}
            />

            <label>Amount:</label>
            <input
                type="number"
                name="amount"
                value={selectedUser?.amount || ""}
                onChange={handleInputChange}
            />

            <button onClick={handleUpdate}>Save</button>
            <button onClick={handleCloseModal}>Cancel</button>
        </div>
    </div>
)}


                        
        </>
    );
}
