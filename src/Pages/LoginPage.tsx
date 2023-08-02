import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import { axiosInstance } from '../Api/Api';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axiosInstance.post('/login', {
        user: {
          email,
          password
        }
      });

      const { user, token } = response.data;
      const decodedToken = jwtDecode(token);

      if (decodedToken) {
        console.log('Login successful:', user);
        localStorage.setItem('jwtToken', token);
        navigate(-1);
      } else {
        console.log('Login failed:', Error);
      }

    } catch (error) {
      console.error('Login failed:', error);

    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};
