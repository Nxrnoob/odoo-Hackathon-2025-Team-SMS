import React, { useState, useEffect } from 'react';
import { Container, Button, Card, Row, Col, ListGroup, Form, InputGroup, Spinner, Alert } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { FaPlus, FaSearch, FaSave } from 'react-icons/fa';
import axios from 'axios';

interface ItineraryItem {
    id: string | number;
    poi_name: string;
    poi_category: string;
    scheduled_day: number;
}

interface Poi {
    id: string;
    name: string;
    category: string;
    tags: string[];
}
// This component allows users to build an itinerary for a specific trip by searching for points of interest (POIs) and adding them to their itinerary.
const BuildItinerary: React.FC = () => {
    const { tripId } = useParams<{ tripId: string }>();
    const navigate = useNavigate();
    const [trip, setTrip] = useState<{ destination?: string } | null>(null);
    const [items, setItems] = useState<ItineraryItem[]>([]);
    const [pois, setPois] = useState<Poi[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (!tripId) {
            setError("No trip specified.");
            return;
        }
        
        const fetchTripData = async () => {
            setLoading(true);
            try {
                const tripRes = await axios.get(`http://localhost:3001/api/trips/${tripId}`);
                setTrip(tripRes.data);
                setSearchTerm(tripRes.data.destination); // Set search term to the trip's destination

                const itemsRes = await axios.get(`http://localhost:3001/api/trips/${tripId}/itinerary`);
                setItems(itemsRes.data);
            } catch (err) {
                setError("Failed to load trip data.");
            } finally {
                setLoading(false);
            }
        };

        fetchTripData();
    }, [tripId]);

    const handleSearchPois = async () => {
        if (!searchTerm) return;
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get('http://localhost:3001/api/amadeus/pois', {
                params: { city: searchTerm }
            });
            setPois(response.data);
        } catch (err) {
            setError('Failed to find points of interest.');
        } finally {
            setLoading(false);
        }
    };

    const handleAddItem = async (poi: Poi) => {
        if (!tripId) return;

        const newItem: ItineraryItem = {
            id: poi.id,
            poi_name: poi.name,
            poi_category: poi.category,
            scheduled_day: 1, // Default to day 1 for now
        };

        // Avoid adding duplicates
        if (items.find(item => item.poi_name === newItem.poi_name)) {
            alert("This item is already in your itinerary.");
            return;
        }

        try {
            const response = await axios.post('http://localhost:3001/api/itinerary', {
                trip_id: tripId,
                poi_name: newItem.poi_name,
                poi_category: newItem.poi_category,
                scheduled_day: newItem.scheduled_day,
            });
            // Add the new item with the ID from the database
            setItems([...items, { ...newItem, id: response.data.id }]);
        } catch (err) {
            setError("Failed to save item to itinerary.");
        }
    };

    return (
        <>
            <Header />
            <Container className="my-5">
                <h2 className="text-center mb-4">Build Your Itinerary for {trip?.destination || '...'}</h2>

                <Card className="mb-4">
                    <Card.Header as="h4">Find Attractions</Card.Header>
                    <Card.Body>
                        <InputGroup className="mb-3">
                            <Form.Control
                                placeholder="Enter a city or landmark..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <Button onClick={handleSearchPois} disabled={loading}>
                                <FaSearch className="me-2" />
                                {loading ? 'Searching...' : 'Search'}
                            </Button>
                        </InputGroup>
                        
                        {loading && <div className="text-center"><Spinner animation="border" /></div>}
                        {error && <Alert variant="danger">{error}</Alert>}

                        {pois.length > 0 && (
                            <ListGroup>
                                {pois.map(poi => (
                                    <ListGroup.Item key={poi.id} className="d-flex justify-content-between align-items-center">
                                        <div><strong>{poi.name}</strong> <br /><small className="text-muted">{poi.category}</small></div>
                                        <Button variant="outline-primary" size="sm" onClick={() => handleAddItem(poi)}><FaPlus /> Add</Button>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        )}
                    </Card.Body>
                </Card>

                <Card>
                    <Card.Header as="h4">Current Itinerary</Card.Header>
                    <Card.Body>
                        {items.length > 0 ? (
                            <ListGroup variant="flush">
                                {items.map(item => (
                                    <ListGroup.Item key={item.id}>{item.poi_name}</ListGroup.Item>
                                ))}
                            </ListGroup>
                        ) : (
                            <p>Search for attractions to add them to your plan.</p>
                        )}
                        <Button variant="success" className="mt-3" onClick={() => navigate(`/itinerary/${tripId}`)}>
                            <FaSave className="me-2" /> View Saved Itinerary
                        </Button>
                    </Card.Body>
                </Card>
            </Container>
            <Footer />
        </>
    );
};

export default BuildItinerary;