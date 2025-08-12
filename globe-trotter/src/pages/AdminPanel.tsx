//on this file, we are creating an AdminPanel component that serves as the main dashboard for administrators, allowing them to manage users and trips, and view analytics.
import React, { useState, useEffect } from 'react';
import { Container, Nav, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import UserManagement from '../components/UserManagement';
import TripManagement from '../components/TripManagement';
import AnalyticsDashboard from '../components/AnalyticsDashboard';
import { FaUsers, FaPlane, FaChartBar } from 'react-icons/fa';

type AdminTab = 'analytics' | 'users' | 'trips';

const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('analytics');
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      if (user.role !== 'admin') {
        navigate('/login'); // Redirect non-admins
      }
    } else {
      navigate('/login'); // Redirect if not logged in
    }
  }, [navigate]);

  const renderContent = () => {
    switch (activeTab) {
      case 'users':
        return <UserManagement />;
      case 'trips':
        return <TripManagement />;
      case 'analytics':
      default:
        return <AnalyticsDashboard />;
    }
  };

  return (
    <>
      <Header />
      <Container className="my-5">
        <h2 className="text-center mb-4" style={{ color: 'var(--primary-color)' }}>Admin Dashboard</h2>
        
        <Nav variant="pills" activeKey={activeTab} onSelect={(k) => setActiveTab(k as AdminTab)} className="justify-content-center mb-4">
          <Nav.Item>
            <Nav.Link eventKey="analytics"><FaChartBar className="me-2" />Analytics</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="users"><FaUsers className="me-2" />Users</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="trips"><FaPlane className="me-2" />Trips</Nav.Link>
          </Nav.Item>
        </Nav>

        <Card>
          <Card.Body>
            {renderContent()}
          </Card.Body>
        </Card>
      </Container>
      <Footer />
    </>
  );
};

export default AdminPanel;