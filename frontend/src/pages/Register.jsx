import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleRegister = async () => {
    const res = await fetch(`${import.meta.env.VITE_BACKEND}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (data.token) {
      setAuth(data.user, data.token);
      navigate('/dashboard');
    } else {
      alert(data.error || "Registration failed");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 space-y-4 bg-gray-50">
      <h1 className="text-2xl font-bold">🚀 Create an Account</h1>

      <input
        name="name"
        type="text"
        placeholder="Name"
        onChange={handleChange}
        className="p-2 border border-gray-300 rounded w-64"
      />
      <input
        name="email"
        type="email"
        placeholder="Email"
        onChange={handleChange}
        className="p-2 border border-gray-300 rounded w-64"
      />
      <input
        name="password"
        type="password"
        placeholder="Password"
        onChange={handleChange}
        className="p-2 border border-gray-300 rounded w-64"
      />

      <button
        onClick={handleRegister}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-64"
      >
        Register
      </button>

      <p className="text-sm">
        Already have an account?{" "}
        <a href="/" className="text-blue-500 underline">Login</a>
      </p>
    </div>
  );
};

export default Register;
