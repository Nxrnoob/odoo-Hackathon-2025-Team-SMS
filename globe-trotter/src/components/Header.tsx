import React, { useState, useEffect } from 'react';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
    const [user, setUser] = useState<any | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('user');
        setUser(null);
        navigate('/login');
    };

    return (
        <Navbar bg="light" expand="lg" className="shadow-sm" style={{ padding: '1rem 0' }}>
            <Container>
                <Navbar.Brand as={Link} to="/" style={{ fontWeight: 'bold', fontSize: '1.5rem', color: 'var(--primary-color)' }}>
                    GlobeTrotter
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto">
                        <Nav.Link as={Link} to="/" className="fw-bold">Home</Nav.Link>
                        <Nav.Link as={Link} to="/community" className="fw-bold">Community</Nav.Link>
                        {user ? (
                            <>
                                <Nav.Link as={Link} to="/trips" className="fw-bold">My Trips</Nav.Link>
                                <Nav.Link as={Link} to="/calendar" className="fw-bold">Calendar</Nav.Link>
                                <Nav.Link as={Link} to="/profile" className="fw-bold">Profile</Nav.Link>
                                <Nav.Link as={Link} to="/admin" className="fw-bold">Admin</Nav.Link>
                                <Button variant="outline-primary" onClick={handleLogout} className="ms-2">Logout</Button>
                            </>
                        ) : (
                            <>
                                <Nav.Link as={Link} to="/login" className="fw-bold">Login</Nav.Link>
                                <Nav.Link as={Link} to="/register" className="fw-bold">Register</Nav.Link>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default Header;
// as the same file is a header component for a React application, it provides navigation links and user authentication options for the GlobeTrotter application. It uses React Router for navigation and Bootstrap for styling.