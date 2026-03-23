import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [watchlist, setWatchlist] = useState([]); // Chứa các MovieID yêu thích

    // Kiểm tra xem đã đăng nhập từ localStorage khi reload trang chưa
    useEffect(() => {
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
            const parsedUser = JSON.parse(userInfo);
            setUser(parsedUser);
        }
        setLoading(false);
    }, []);

    // Tự động fetch Watchlist Ids khi đăng nhập / f5
    useEffect(() => {
        const fetchWatchlist = async () => {
            if (user?.token) {
                try {
                    const { data } = await axios.get(`${API_URL}/../watchlist/${user._id}/ids`, {
                        headers: { Authorization: `Bearer ${user.token}` }
                    });
                    setWatchlist(data);
                } catch (error) {
                    console.error("Lỗi lấy danh sách theo dõi:", error);
                }
            }
        };
        fetchWatchlist();
    }, [user?.token, user?._id]);

    const API_URL = 'http://localhost:5000/api/auth';

    const login = async (username, password) => {
        try {
            const config = { headers: { 'Content-Type': 'application/json' } };
            const { data } = await axios.post(`${API_URL}/login`, { username, password }, config);
            
            setUser(data);
            localStorage.setItem('userInfo', JSON.stringify(data));
            return { success: true };
        } catch (error) {
            return { 
                success: false, 
                message: error.response && error.response.data.message 
                    ? error.response.data.message : error.message 
            };
        }
    };

    const register = async (username, password) => {
        try {
            const config = { headers: { 'Content-Type': 'application/json' } };
            const { data } = await axios.post(`${API_URL}/register`, { username, password }, config);
            
            setUser(data);
            localStorage.setItem('userInfo', JSON.stringify(data));
            return { success: true };
        } catch (error) {
            return { 
                success: false, 
                message: error.response && error.response.data.message 
                    ? error.response.data.message : error.message 
            };
        }
    };

    const updateProfile = async (profileData) => {
        try {
            const config = { 
                headers: { 
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`
                } 
            };
            const { data } = await axios.put(`${API_URL}/profile`, profileData, config);
            
            setUser(data);
            localStorage.setItem('userInfo', JSON.stringify(data));
            return { success: true, data };
        } catch (error) {
            return { 
                success: false, 
                message: error.response && error.response.data.message 
                    ? error.response.data.message : error.message 
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('userInfo');
        setUser(null);
    };

    const value = {
        user,
        login,
        register,
        updateProfile,
        logout,
        watchlist, 
        setWatchlist
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
