import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from 'react-icons-kit';
import { eyeOff } from 'react-icons-kit/feather/eyeOff';
import { eye } from 'react-icons-kit/feather/eye';

import './Login.css';

const Login = () => {
    useEffect(() => {
        document.title = "Login"; // Change this to the desired title
    }, []);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [type, setType] = useState('password');
    const [icon, setIcon] = useState(eyeOff);
    const navigate = useNavigate();

    const handleLogin = () => {
        if (!username || !password) {
            setError('Username and Password are required');
            return;
        }
        setError('');
        setLoading(true);

        setTimeout(() => {
            setLoading(false);
            console.log('Logged in with:', username, password);

            if (username === 'student') {
                navigate('/student-dashboard');
            } else if (username === 'teacher') {
                navigate('/teacher-dashboard');
            } else {
                setError('Invalid credentials');
            }
        }, 1500);
    };

    const handleToggle = () => {
        if (type === 'password') {
            setIcon(eye);
            setType('text');
        } else {
            setIcon(eyeOff);
            setType('password');
        }
    };

    return (
        <div className="login-background">
            <div className="form-container">
                <h2>Welcome! Please login to continue.</h2>
                {error && <p className="error">{error}</p>}
                {loading ? (
                    <div className="spinner"></div>
                ) : (
                    <>
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <div className="password-container">
                            <input
                                type={type}
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <span className="toggle-icon" onClick={handleToggle}>
                                <Icon icon={icon} size={20} />
                            </span>
                        </div>
                        <button onClick={handleLogin}>Login</button>
                        <p>
                            <a href="/forgot-password">Forgot Password?</a>
                        </p>
                        <p>
                            Don't have an account? <a href="/register">Register</a>
                        </p>
                    </>
                )}
            </div>
        </div>
    );
};

export default Login;
