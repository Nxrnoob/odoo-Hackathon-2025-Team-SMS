import React from 'react';
import { Container, Row, Col, Card, Button, Carousel, Form, Dropdown, InputGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { FaPlus, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
//here we are creating a LandingPage component that serves as the main entry point for the application, featuring a carousel of images, a search bar, and links to popular destinations and previous trips. It encourages users to plan new trips and explore various travel options.
const LandingPage: React.FC = () => {
  const floatingButtonStyle: React.CSSProperties = {
    position: 'fixed',
    bottom: '30px',
    right: '30px',
    zIndex: 1000,
    borderRadius: '30px',
    padding: '1rem 1.5rem',
    fontSize: '1.2rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  };

  const carouselItemStyle: React.CSSProperties = {
    height: '60vh',
    minHeight: '400px',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };

  const carouselContainerStyle: React.CSSProperties = {
    position: 'relative',
  };

  const carouselControlStyle: React.CSSProperties = {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    zIndex: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    border: 'none',
    borderRadius: '50%',
    width: '50px',
    height: '50px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  return (
    <>
      <Header />
      <div style={carouselContainerStyle} className="mb-5">
        <Carousel
          fade
          indicators={false}
          prevIcon={<span style={{...carouselControlStyle, left: '15px'}}><FaChevronLeft /></span>}
          nextIcon={<span style={{...carouselControlStyle, right: '15px'}}><FaChevronRight /></span>}
        >
          <Carousel.Item>
            <div
              style={{ ...carouselItemStyle, backgroundImage: `url('https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=1920&auto=format&fit=crop')` }}
              role="img"
              aria-label="A beautiful landscape with mountains and a lake"
            />
            <Carousel.Caption>
              <h3>Explore the World</h3>
              <p>Find your next adventure in the world's most beautiful places.</p>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <div
              style={{ ...carouselItemStyle, backgroundImage: `url('https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?q=80&w=1920&auto=format&fit=crop')` }}
              role="img"
              aria-label="A vibrant cityscape at dusk"
            />
            <Carousel.Caption>
              <h3>Discover New Cultures</h3>
              <p>Get lost in the vibrant streets of iconic cities.</p>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <div
              style={{ ...carouselItemStyle, backgroundImage: `url('https://images.unsplash.com/photo-1520454974749-611b7248ffdb?q=80&w=1920&auto=format&fit=crop')` }}
              role="img"
              aria-label="A relaxing beach with a hammock between palm trees"
            />
            <Carousel.Caption>
              <h3>Relax and Unwind</h3>
              <p>Unwind on pristine sands and listen to the waves.</p>
            </Carousel.Caption>
          </Carousel.Item>
        </Carousel>
      </div>

      <Container>
        <Row className="mb-5 align-items-center bg-light p-3 rounded shadow-sm">
          <Col md={8}>
            <InputGroup>
              <Form.Control
                placeholder="Search for a destination..."
                style={{ height: '50px' }}
              />
              <Link to="/search">
                <Button variant="primary">Search</Button>
              </Link>
            </InputGroup>
          </Col>
          <Col md={2}>
            <Dropdown>
              <Dropdown.Toggle variant="outline-secondary" className="w-100" style={{ height: '50px' }}>
                Sort by
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item href="#">Name</Dropdown.Item>
                <Dropdown.Item href="#">Date</Dropdown.Item>
                <Dropdown.Item href="#">Popularity</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Col>
          <Col md={2}>
            <Dropdown>
              <Dropdown.Toggle variant="outline-secondary" className="w-100" style={{ height: '50px' }}>
                Filter
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item href="#">Region</Dropdown.Item>
                <Dropdown.Item href="#">Trip Type</Dropdown.Item>
                <Dropdown.Item href="#">Budget</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Col>
        </Row>

        <h2 className="my-4">Top Regional Selections</h2>
        <Row className="flex-nowrap" style={{ overflowX: 'auto', paddingBottom: '15px' }}>
          {[
            { name: 'Amalfi Coast, Italy', image: 'https://images.unsplash.com/photo-1533656338503-b22f63e96cd8?q=80&w=1073&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
            { name: 'Kyoto, Japan', image: 'https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?q=80&w=800&auto=format&fit=crop' },
            { name: 'Swiss Alps', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=800&auto=format&fit=crop' },
            { name: 'Santorini, Greece', image: 'https://images.unsplash.com/photo-1580502304784-8985b7eb7260?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
            { name: 'Patagonia, Argentina', image: 'https://images.unsplash.com/photo-1529699310859-528a6f6c19f7?q=80&w=800&auto=format&fit=crop' },
            { name: 'Bora Bora, French Polynesia', image: 'https://images.unsplash.com/photo-1506953823076-075a7c673c37?q=80&w=800&auto=format&fit=crop'},
            { name: 'New York City, USA', image: 'https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
            { name: 'Cairo, Egypt', image: 'https://images.unsplash.com/photo-1626692880062-35c360fb6afc?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
          ].map((region, idx) => (
            <Col key={idx} xs={6} md={4} lg={3} className="mb-4">
              <Link to={`/search?q=${encodeURIComponent(region.name)}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <Card className="h-100 shadow-sm">
                  <Card.Img variant="top" src={region.image} style={{ height: '150px', objectFit: 'cover' }} />
                  <Card.Body>
                    <Card.Title>{region.name}</Card.Title>
                  </Card.Body>
                </Card>
              </Link>
            </Col>
          ))}
        </Row>

        <h2 className="my-4">Previous Trips</h2>
        <Row>
          {[...Array(3)].map((_, idx) => (
            <Col key={idx} md={4} className="mb-4">
              <Card>
                <Card.Img variant="top" src={`https://via.placeholder.com/300x200?text=Trip+${idx + 1}`} />
                <Card.Body>
                  <Card.Title>Trip {idx + 1}</Card.Title>
                  <Card.Text>
                    A brief description of a past adventure.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

      </Container>
      <Link to="/create-trip">
        <Button variant="primary" style={floatingButtonStyle} aria-label="Plan a new trip">
          <FaPlus />
          <span className="ms-2">Plan a Trip</span>
        </Button>
      </Link>
      <Footer />
    </>
  );
};

export default LandingPage;
