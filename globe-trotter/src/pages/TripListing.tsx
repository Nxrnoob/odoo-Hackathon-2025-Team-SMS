import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Dropdown, Spinner, Alert, Stack } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import axios from 'axios';
//as therefore this file is a TripListing component that displays a list of trips planned by the user, allowing them to view itineraries or cancel trips. It fetches trip data from an API and handles loading states and errors gracefully.
interface Trip {
    id: number;
    destination: string;
    duration: string;
    user_id: number;
}

const TripListing: React.FC = () => {
    const [trips, setTrips] = useState<Trip[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        if (user && user.id) {
            fetchTrips(user.id);
        } else {
            setLoading(false);
        }
    }, [user.id]);

    const fetchTrips = async (userId: number) => {
        try {
            const response = await axios.get(`http://localhost:3001/api/users/${userId}/trips`);
            setTrips(response.data);
        } catch (error) {
            console.error('Failed to fetch trips:', error);
            setError('Failed to load trips.');
        } finally {
            setLoading(false);
        }
    };

    const handleCancelTrip = async (tripId: number) => {
        if (window.confirm('Are you sure you want to cancel this trip?')) {
            try {
                await axios.delete(`http://localhost:3001/api/trips/${tripId}`);
                setTrips(trips.filter(trip => trip.id !== tripId));
            } catch (error) {
                console.error('Failed to cancel trip:', error);
                alert('There was an error canceling the trip. Please try again.');
            }
        }
    };

    const renderTripCard = (trip: Trip) => (
        <Col key={trip.id} md={4} className="mb-4">
            <Card>
                <Card.Img variant="top" src={`https://source.unsplash.com/400x300/?${trip.destination.replace(' ', '+')}`} />
                <Card.Body>
                    <Card.Title>{trip.destination}</Card.Title>
                    <Card.Text>Duration: {trip.duration}</Card.Text>
                    <Stack direction="horizontal" gap={2}>
                        <Link to={`/itinerary/${trip.id}`}>
                            <Button variant="primary">View Itinerary</Button>
                        </Link>
                        <Button variant="outline-danger" onClick={() => handleCancelTrip(trip.id)}>
                            Cancel
                        </Button>
                    </Stack>
                </Card.Body>
            </Card>
        </Col>
    );

    return (
        <>
            <Header />
            <Container className="my-5">
                <h2 className="text-center mb-4" style={{ color: 'var(--primary-color)' }}>My Trips</h2>
                <div className="d-flex justify-content-center justify-content-md-end mb-4">
                    {/* Filter/Sort Dropdowns can remain as they are */}
                </div>

                {loading && (
                    <div className="text-center">
                        <Spinner animation="border" /> Loading your trips...
                    </div>
                )}

                {error && <Alert variant="danger">{error}</Alert>}

                {!loading && !error && (
                    trips.length > 0 ? (
                        <Row>{trips.map(renderTripCard)}</Row>
                    ) : (
                        <p className="text-center">You haven't planned any trips yet. <Link to="/create-trip">Create one now!</Link></p>
                    )
                )}
            </Container>
            <Footer />
        </>
    );
};

export default TripListing;