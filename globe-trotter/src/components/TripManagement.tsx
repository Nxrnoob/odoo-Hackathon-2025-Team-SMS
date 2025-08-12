import React, { useState, useEffect } from 'react';
import { Card, Table, Button } from 'react-bootstrap';
import { FaEye, FaTrash } from 'react-icons/fa';
import axios from 'axios';

interface Trip {
  id: number;
  destination: string;
  user: string;
  duration: string;
}
//from this file, we are creating a TripManagement component that fetches and displays trips in a table format with options to view or delete each trip.
const TripManagement: React.FC = () => {
  const [trips, setTrips] = useState<Trip[]>([]);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/trips');
        setTrips(response.data);
      } catch (error) {
        console.error('Failed to fetch trips:', error);
      }
    };
    fetchTrips();
  }, []);

  return (
    <Card>
      <Card.Header as="h5">Trip Management</Card.Header>
      <Card.Body>
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>Destination</th>
              <th>User</th>
              <th>Duration</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {trips.map(trip => (
              <tr key={trip.id}>
                <td>{trip.id}</td>
                <td>{trip.destination}</td>
                <td>{trip.user}</td>
                <td>{trip.duration}</td>
                <td>
                  <Button variant="outline-primary" size="sm" className="me-2">
                    <FaEye />
                  </Button>
                  <Button variant="outline-danger" size="sm">
                    <FaTrash />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
};

export default TripManagement;