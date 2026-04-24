import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || '');

    useEffect(() => {
        if (token) {
            localStorage.setItem('token', token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            fetchProfile();
        } else {
            localStorage.removeItem('token');
            delete axios.defaults.headers.common['Authorization'];
            setUser(null);
        }
    }, [token]);

    const fetchProfile = async () => {
        try {
            const res = await axios.get('https://servers-z5cm.onrender.com/api/users/profile');
            setUser(res.data);
        } catch (err) {
            console.error('Error fetching profile', err);
            logout();
        }
    };

    const logout = () => {
        setToken('');
        setUser(null);
    };

    return (
        <UserContext.Provider value={{ user, setUser, token, setToken, logout }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserContext;