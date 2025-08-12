import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, InputGroup, Button, Spinner, Alert, OverlayTrigger, Tooltip } from 'react-bootstrap';
import Header from '../components/Header';
import Footer from '../components/Footer';
import axios from 'axios';

interface Poi {
    id: string;
    name: string;
    category: string;
    description?: string;
    pictures?: string[];
    tags?: string[];
}

const Search: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('London'); // Default search term
    const [results, setResults] = useState<Poi[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSearch = async () => {
        if (!searchTerm.trim()) {
            setError("Please enter a city name to search.");
            return;
        }
        // Clear previous results and errors before starting a new search
        setResults([]);
        setError(null);
        setLoading(true);
        
        try {
            const response = await axios.get('http://localhost:3001/api/amadeus/pois', {
                params: { city: searchTerm }
            });
            setResults(response.data);
            if (response.data.length === 0) {
                setError(`No attractions found for "${searchTerm}". Try a different city.`);
            }
        } catch (err: any) {
            console.error('Failed to fetch search results:', err);
            const errorMsg = err.response?.data?.error || 'Failed to fetch search results. Please try again later.';
            setError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const renderTooltip = (props: any) => (
        <Tooltip id="button-tooltip" {...props}>
            Feature coming soon!
        </Tooltip>
    );

    return (
        <>
            <Header />
            <Container className="my-5">
                <h2 className="text-center mb-4" style={{ color: 'var(--primary-color)' }}>Find Your Next Destination</h2>

                <Row className="mb-5 align-items-center bg-light p-3 rounded shadow-sm">
                    <Col md={12}>
                        <InputGroup>
                            <Form.Control
                                placeholder="Search for a city..."
                                style={{ height: '50px' }}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                            />
                            <Button variant="primary" onClick={handleSearch} disabled={loading}>
                                {loading ? <Spinner as="span" animation="border" size="sm" /> : 'Search'}
                            </Button>
                        </InputGroup>
                    </Col>
                </Row>

                {loading && <div className="text-center"><Spinner animation="border" /></div>}
                {error && <Alert variant="danger">{error}</Alert>}
                
                <Row>
                    {results.map((poi) => (
                        <Col key={poi.id} md={4} className="mb-4">
                            <Card className="h-100">
                                <Card.Img 
                                    variant="top" 
                                    src={poi.pictures?.[0] || `https://source.unsplash.com/400x300/?${poi.name.replace(' ', '+')}`} 
                                    style={{ height: '200px', objectFit: 'cover' }}
                                    alt={poi.name}
                                />
                                <Card.Body className="d-flex flex-column">
                                    <Card.Title>{poi.name}</Card.Title>
                                    <Card.Text className="flex-grow-1" style={{ fontSize: '0.9rem' }}>
                                        {poi.description ? `${poi.description.substring(0, 100)}...` : 'No description available.'}
                                    </Card.Text>
                                    <OverlayTrigger
                                        placement="top"
                                        delay={{ show: 250, hide: 400 }}
                                        overlay={renderTooltip}
                                    >
                                        <span className="d-inline-block">
                                            <Button variant="primary" disabled style={{ pointerEvents: 'none' }}>
                                                View Details
                                            </Button>
                                        </span>
                                    </OverlayTrigger>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Container>
            <Footer />
        </>
    );
};

export default Search;