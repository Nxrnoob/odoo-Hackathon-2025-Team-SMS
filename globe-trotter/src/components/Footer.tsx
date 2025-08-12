import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer: React.FC = () => {
  return (
    <footer className="bg-light text-center text-lg-start mt-5" style={{ borderTop: '1px solid #dee2e6' }}>
      <Container className="p-4">
        <Row>
          <Col lg={6} md={12} className="mb-4 mb-md-0">
            <h5 className="text-uppercase" style={{ color: 'var(--primary-color)' }}>GlobeTrotter</h5>
            <p>
              Your ultimate companion for planning, sharing, and reliving your travel adventures.
            </p>
          </Col>
          <Col lg={3} md={6} className="mb-4 mb-md-0">
            <h5 className="text-uppercase">Links</h5>
            <ul className="list-unstyled mb-0">
              <li>
                <a href="#!" className="text-dark">About Us</a>
              </li>
              <li>
                <a href="#!" className="text-dark">Careers</a>
              </li>
              <li>
                <a href="#!" className="text-dark">Press</a>
              </li>
            </ul>
          </Col>
          <Col lg={3} md={6} className="mb-4 mb-md-0">
            <h5 className="text-uppercase">Connect</h5>
            <ul className="list-unstyled mb-0">
              <li>
                <a href="#!" className="text-dark">Facebook</a>
              </li>
              <li>
                <a href="#!" className="text-dark">Twitter</a>
              </li>
              <li>
                <a href="#!" className="text-dark">Instagram</a>
              </li>
            </ul>
          </Col>
        </Row>
      </Container>
      <div className="text-center p-3" style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
        &copy; {new Date().getFullYear()} GlobeTrotter. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
// as this file is a footer component for a React application, it provides a consistent footer layout with links and branding for the GlobeTrotter application.