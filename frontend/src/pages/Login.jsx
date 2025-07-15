import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { setAuth } = useAuthStore();
    const navigate = useNavigate();

    const handleLogin = async () => {
        const res = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (data.token) {
            setAuth(data.user, data.token);
            navigate('/dashboard');
        }
    };

    return (
        <div className="flex flex-col items-center p-6 space-y-4">
            <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} className="p-2 border" />
            <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} className="p-2 border" />
            <button onClick={handleLogin} className="bg-blue-500 text-white px-4 py-2 rounded">Login</button>

            <p className="text-sm">
                Don't have an account?{" "}
                <a href="/register" className="text-blue-500 underline">SignUp</a>
            </p>
        </div>
    );
};

export default Login;
