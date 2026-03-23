import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Auth.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        
        if (!username || !password) {
            setError('Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu!');
            setIsLoading(false);
            return;
        }

        const res = await login(username, password);
        
        if (res.success) {
            navigate('/');
        } else {
            setError(res.message);
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-overlay"></div>
            <img 
                className="auth-bg" 
                src="https://images.unsplash.com/photo-1574267432553-4b462808152a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" 
                alt="Cinema Background" 
            />
            
            <div className="auth-box">
                <h2 className="auth-title">Đăng Nhập</h2>
                
                {error && <div className="auth-error">{error}</div>}
                
                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <input 
                            type="text" 
                            className="form-input" 
                            placeholder="Tên đăng nhập" 
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    
                    <div className="form-group">
                        <input 
                            type="password" 
                            className="form-input" 
                            placeholder="Mật khẩu" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    
                    <button type="submit" className="auth-btn" disabled={isLoading}>
                        {isLoading ? 'Đang Đăng Nhập...' : 'Đăng Nhập'}
                    </button>
                    
                    <div className="auth-options">
                        <label className="remember-me">
                            <input type="checkbox" /> Ghi nhớ tôi
                        </label>
                        <a href="#" className="forgot-pass">Bạn quên mật khẩu?</a>
                    </div>
                </form>
                
                <div className="auth-footer">
                    <span>Bạn mới tham gia CinemaWeb? </span>
                    <Link to="/register" className="auth-link">Đăng ký ngay.</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
