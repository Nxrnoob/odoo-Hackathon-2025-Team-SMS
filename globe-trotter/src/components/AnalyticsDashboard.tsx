import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { FaUsers, FaPlane, FaCity } from 'react-icons/fa';
import axios from 'axios';

interface AnalyticsData {
    totalUsers: number;
    totalTrips: number;
    popularDestinations: { name: string; value: number }[];
    userDemographics: { name: string; value: number }[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];

const AnalyticsDashboard: React.FC = () => {
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/analytics');
                setData(response.data);
            } catch (err) {
                setError('Failed to fetch analytics data.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, []);

    if (loading) {
        return <div className="text-center"><Spinner animation="border" /> Loading Analytics...</div>;
    }

    if (error) {
        return <Alert variant="danger">{error}</Alert>;
    }

    if (!data) {
        return <Alert variant="warning">No analytics data available.</Alert>;
    }

    const mostPopularCity = data.popularDestinations.length > 0 ? data.popularDestinations[0].name : 'N/A';

    return (
        <>
            {/* Key Metrics */}
            <Row className="mb-4">
                <Col md={4}>
                    <Card className="text-center">
                        <Card.Body>
                            <FaUsers size="2em" className="text-primary mb-2" />
                            <Card.Title>Total Users</Card.Title>
                            <Card.Text className="fs-4 fw-bold">{data.totalUsers}</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="text-center">
                        <Card.Body>
                            <FaPlane size="2em" className="text-success mb-2" />
                            <Card.Title>Total Trips</Card.Title>
                            <Card.Text className="fs-4 fw-bold">{data.totalTrips}</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="text-center">
                        <Card.Body>
                            <FaCity size="2em" className="text-info mb-2" />
                            <Card.Title>Most Popular City</Card.Title>
                            <Card.Text className="fs-4 fw-bold">{mostPopularCity}</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row>
                {/* Popular Destinations */}
                <Col md={6} className="mb-4">
                    <Card>
                        <Card.Body>
                            <Card.Title>Popular Destinations</Card.Title>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart layout="vertical" data={data.popularDestinations}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis type="number" />
                                    <YAxis dataKey="name" type="category" width={80} />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="value" name="Trips" fill="var(--secondary-color)" />
                                </BarChart>
                            </ResponsiveContainer>
                        </Card.Body>
                    </Card>
                </Col>

                {/* User Demographics */}
                <Col md={6} className="mb-4">
                    <Card>
                        <Card.Body>
                            <Card.Title>User Demographics (Age)</Card.Title>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie data={data.userDemographics} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label>
                                        {data.userDemographics.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default AnalyticsDashboard;