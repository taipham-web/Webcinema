import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Auth.css';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        
        if (!username || !password || !confirmPassword) {
            setError('Vui lòng nhập đầy đủ thông tin!');
            setIsLoading(false);
            return;
        }

        if (password !== confirmPassword) {
            setError('Mật khẩu xác nhận không khớp!');
            setIsLoading(false);
            return;
        }

        if (password.length < 6) {
            setError('Mật khẩu phải có ít nhất 6 ký tự!');
            setIsLoading(false);
            return;
        }

        const res = await register(username, password);
        
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
            
            <div className="auth-box reg-box">
                <h2 className="auth-title">Đăng Ký</h2>
                
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
                            placeholder="Mật khẩu (ít nhất 6 ký tự)" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <input 
                            type="password" 
                            className="form-input" 
                            placeholder="Xác nhận mật khẩu" 
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>
                    
                    <button type="submit" className="auth-btn" disabled={isLoading}>
                        {isLoading ? 'Đang Xử Lý...' : 'Đăng Ký Mới'}
                    </button>
                    
                    <div className="auth-options">
                        <label className="remember-me" style={{ color: '#b3b3b3', fontSize: '13px', marginTop: '10px' }}>
                            Trang này được bảo vệ bởi Google reCAPTCHA để đảm bảo bạn không phải là robot.
                        </label>
                    </div>
                </form>
                
                <div className="auth-footer">
                    <span>Đã có tài khoản CinemaWeb? </span>
                    <Link to="/login" className="auth-link">Đăng nhập.</Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
