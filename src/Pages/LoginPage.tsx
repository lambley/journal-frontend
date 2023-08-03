import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import { axiosInstance } from '../Api/Api';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';

interface LoginPageProps {
  onLoginStatusChange: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginStatusChange }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axiosInstance.post('/login', {
        user: {
          email,
          password,
        },
      });

      const { user, token } = response.data;
      const decodedToken = jwtDecode(token);

      if (decodedToken) {
        console.log('Login successful:', user);
        localStorage.setItem('jwtToken', token);
        onLoginStatusChange();
        navigate(-1);
      } else {
        console.log('Login failed:', Error);
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col xs={12} md={6}>
          <h2 className="mb-4">Login</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="password" className='mt-3'>
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>

            <Button variant="primary" type="submit" className='mt-3'>
              Login
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};
