import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Form, Button, Card, Row, Col, Alert } from 'react-bootstrap';
import axios from 'axios';

const Registration: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);
        setSuccess(null);

        if (!name || !email || !password) {
            setError('Please fill in all fields.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:3001/api/register', { name, email, password });
            setSuccess(response.data.message);
            setTimeout(() => navigate('/login'), 2000); // Redirect to login after 2 seconds
        } catch (err) {
            if (axios.isAxiosError(err) && err.response) {
                setError(err.response.data.error || 'Registration failed. Please try again.');
            } else {
                setError('An unexpected error occurred.');
            }
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center vh-100">
            <Card style={{ width: '40rem' }}>
                <Card.Body>
                    <h2 className="text-center mb-4">Register</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    {success && <Alert variant="success">{success}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <Row className="mb-3">
                            <Form.Group as={Col} controlId="formGridName">
                                <Form.Label>Full Name</Form.Label>
                                <Form.Control
                                    placeholder="Full Name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </Form.Group>
                        </Row>
                        <Row className="mb-3">
                            <Form.Group as={Col} controlId="formGridEmail">
                                <Form.Label>Email Address</Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder="Enter email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </Form.Group>
                        </Row>
                        <Row className="mb-3">
                            <Form.Group as={Col} controlId="formGridPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </Form.Group>
                        </Row>
                        <Button variant="primary" type="submit" className="w-100">
                            Register Now
                        </Button>
                    </Form>
                    <div className="text-center mt-3">
                        <Link to="/login">Already have an account? Login</Link>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default Registration;