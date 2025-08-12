import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Image, Stack } from 'react-bootstrap';
import Header from '../components/Header';
import Footer from '../components/Footer';
import axios from 'axios';
import { Link } from 'react-router-dom';

interface User {
    id: number;
    name: string;
    email: string;
}

interface Trip {
    id: number;
    destination: string;
    duration: string;
    user_id: number;
}

const UserProfile: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [trips, setTrips] = useState<Trip[]>([]);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            fetchTrips(parsedUser.id);
        }
    }, []);

    const fetchTrips = async (userId: number) => {
        try {
            const response = await axios.get(`http://localhost:3001/api/users/${userId}/trips`);
            setTrips(response.data);
        } catch (error) {
            console.error('Failed to fetch trips:', error);
        }
    };

    const handleCancelTrip = async (tripId: number) => {
        if (window.confirm('Are you sure you want to cancel this trip?')) {
            try {
                await axios.delete(`http://localhost:3001/api/trips/${tripId}`);
                // Optimistically update the UI
                setTrips(trips.filter(trip => trip.id !== tripId));
            } catch (error) {
                console.error('Failed to cancel trip:', error);
                alert('There was an error canceling the trip. Please try again.');
            }
        }
    };

    if (!user) {
        return (
            <>
                <Header />
                <Container className="text-center my-5">
                    <h2>Please log in to view your profile.</h2>
                </Container>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Header />
            <Container>
                <Row className="my-4 align-items-center">
                    <Col md={2} className="text-center">
                        <Image src={`https://i.pravatar.cc/150?u=${user.email}`} roundedCircle fluid />
                    </Col>
                    <Col md={10}>
                        <h2>{user.name}</h2>
                        <p>Email: {user.email}</p>
                        <Button variant="outline-primary">Edit Profile</Button>
                    </Col>
                </Row>

                <h3 className="my-4">My Trips</h3>
                <Row>
                    {trips.length > 0 ? (
                        trips.map((trip) => (
                            <Col key={trip.id} md={4} className="mb-4">
                                <Card>
                                    <Card.Body>
                                        <Card.Title>{trip.destination}</Card.Title>
                                        <Card.Text>Duration: {trip.duration}</Card.Text>
                                        <Stack direction="horizontal" gap={2}>
                                            <Link to={`/itinerary/${trip.id}`}>
                                                <Button variant="primary">View Details</Button>
                                            </Link>
                                            <Button variant="outline-danger" onClick={() => handleCancelTrip(trip.id)}>
                                                Cancel
                                            </Button>
                                        </Stack>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))
                    ) : (
                        <p>You have no planned trips. <Link to="/create-trip">Create one now!</Link></p>
                    )}
                </Row>
            </Container>
            <Footer />
        </>
    );
};

export default UserProfile;


