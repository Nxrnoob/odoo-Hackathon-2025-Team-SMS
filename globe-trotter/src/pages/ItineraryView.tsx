import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, ListGroup, ProgressBar, Spinner, Alert } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { FaMapMarkerAlt, FaDollarSign, FaClipboardList, FaWallet } from 'react-icons/fa';
import axios from 'axios';
//where this file is a React component that displays the itinerary for a specific trip, including details about the trip and a list of scheduled activities grouped by day. It fetches data from an API and handles loading states and errors gracefully.
interface Trip {
    id: number;
    destination: string;
    duration: string;
    start_date: string;
    end_date: string;
}

interface ItineraryItem {
    id: number;
    poi_name: string;
    notes?: string;
    scheduled_day: number;
}

const ItineraryView: React.FC = () => {
    const { tripId } = useParams<{ tripId: string }>();
    const [trip, setTrip] = useState<Trip | null>(null);
    const [items, setItems] = useState<ItineraryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!tripId) return;

        const fetchItineraryData = async () => {
            setLoading(true);
            try {
                // Fetch both trip details and itinerary items
                const tripDetailsPromise = axios.get(`http://localhost:3001/api/trips/${tripId}`);
                const itineraryItemsPromise = axios.get(`http://localhost:3001/api/trips/${tripId}/itinerary`);
                
                const [tripResponse, itemsResponse] = await Promise.all([tripDetailsPromise, itineraryItemsPromise]);

                setTrip(tripResponse.data);
                setItems(itemsResponse.data);
                setError(null);
            } catch (err) {
                console.error('Failed to fetch itinerary data:', err);
                setError('Failed to load itinerary. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchItineraryData();
    }, [tripId]);

    // Group items by day
    const itemsByDay = items.reduce((acc, item) => {
        const day = item.scheduled_day || 1;
        if (!acc[day]) {
            acc[day] = [];
        }
        acc[day].push(item);
        return acc;
    }, {} as Record<number, ItineraryItem[]>);

    if (loading) {
        return <div className="text-center my-5"><Spinner animation="border" /> Loading Itinerary...</div>;
    }

    if (error) {
        return <Alert variant="danger" className="my-5">{error}</Alert>;
    }

    if (!trip) {
        return <Alert variant="warning" className="my-5">Trip details could not be found.</Alert>;
    }

    return (
        <>
            <Header />
            <Container className="my-5">
                <h2 className="text-center mb-4" style={{ color: 'var(--primary-color)' }}>
                    Itinerary for {trip.destination}
                </h2>

                {/* This is a placeholder for budget summary. A real implementation would need budget data. */}
                <Card className="mb-5">
                    <Card.Body className="text-center">
                        <Card.Title as="h4">Trip Dates</Card.Title>
                        <p className="lead">{new Date(trip.start_date).toLocaleDateString()} - {new Date(trip.end_date).toLocaleDateString()}</p>
                    </Card.Body>
                </Card>

                {Object.keys(itemsByDay).length > 0 ? (
                    Object.entries(itemsByDay).map(([day, dayItems]) => (
                        <div key={day}>
                            <h3 className="mb-3"><FaClipboardList className="me-2" />Day {day}</h3>
                            <Card className="mb-4">
                                <ListGroup variant="flush">
                                    {dayItems.map(item => (
                                        <ListGroup.Item key={item.id}>
                                            <FaMapMarkerAlt className="me-2" />{item.poi_name}
                                            {item.notes && <p className="text-muted mb-0 ms-4">{item.notes}</p>}
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            </Card>
                        </div>
                    ))
                ) : (
                    <Alert variant="info">This itinerary is empty. Go to the "Build Itinerary" page to add activities!</Alert>
                )}
            </Container>
            <Footer />
        </>
    );
};

export default ItineraryView;