import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        if (username === 'andrii3' && password === 'andrii3') {
            navigate('/dashboard');
        } else {
            setError('Невірний логін або пароль');
        }
    };

    return (
        <div className="container">
            <h2>WeatherApp</h2>
            <form onSubmit={handleLogin}>
                <input
                    type="text"
                    placeholder="Логін"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Пароль"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Увійти</button>
            </form>
            {error && <p className="error">{error}</p>}
        </div>
    );
};

export default LoginPage;
