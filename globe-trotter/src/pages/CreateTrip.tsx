import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Card, Row, Col, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import axios from 'axios';
import moment from 'moment';

const CreateTrip: React.FC = () => {
    const [user, setUser] = useState<any | null>(null);
    const [destination, setDestination] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);
        setSuccess(null);

        if (!destination || !startDate || !endDate) {
            setError('Please fill in all fields.');
            return;
        }

        if (!user) {
            setError('You must be logged in to create a trip.');
            return;
        }

        const duration = moment(endDate).diff(moment(startDate), 'days');
        if (duration < 0) {
            setError('End date cannot be before the start date.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:3001/api/trips', {
                destination,
                startDate,
                endDate,
                user_id: user.id,
            });
            setSuccess('Trip created successfully! Redirecting to itinerary builder...');
            // Redirect to the build itinerary page for the new trip
            setTimeout(() => {
                navigate(`/build-itinerary/${response.data.tripId}`);
            }, 2000);
        } catch (err) {
            if (axios.isAxiosError(err) && err.response) {
                setError(err.response.data.error || 'Failed to create trip.');
            } else {
                setError('An unexpected error occurred.');
            }
        }
    };

    if (!user) {
        return (
            <>
                <Header />
                <Container className="text-center my-5">
                    <h2>Please log in to plan a new trip.</h2>
                    <Link to="/login">
                        <Button variant="primary" className="mt-3">Login</Button>
                    </Link>
                </Container>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Header />
            <Container className="my-5">
                <Card className="p-4 p-md-5 shadow-sm">
                    <Card.Body>
                        <h2 className="text-center mb-4" style={{ color: 'var(--primary-color)' }}>Plan Your Next Adventure</h2>
                        {error && <Alert variant="danger">{error}</Alert>}
                        {success && <Alert variant="success">{success}</Alert>}
                        <Form onSubmit={handleSubmit}>
                            <Row className="mb-4">
                                <Col md={6}>
                                    <Form.Group controlId="formGridPlace">
                                        <Form.Label>Destination</Form.Label>
                                        <Form.Control
                                            size="lg"
                                            placeholder="e.g., Paris, France"
                                            value={destination}
                                            onChange={(e) => setDestination(e.target.value)}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={3}>
                                    <Form.Group controlId="formGridStartDate">
                                        <Form.Label>Start Date</Form.Label>
                                        <Form.Control
                                            size="lg"
                                            type="date"
                                            value={startDate}
                                            onChange={(e) => setStartDate(e.target.value)}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={3}>
                                    <Form.Group controlId="formGridEndDate">
                                        <Form.Label>End Date</Form.Label>
                                        <Form.Control
                                            size="lg"
                                            type="date"
                                            value={endDate}
                                            onChange={(e) => setEndDate(e.target.value)}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <div className="text-center">
                                <Button variant="primary" size="lg" type="submit">
                                    Create Trip
                                </Button>
                            </div>
                        </Form>
                        </Card.Body>
                </Card>
            </Container>
            <Footer />
        </>
    );
};

export default CreateTrip;
