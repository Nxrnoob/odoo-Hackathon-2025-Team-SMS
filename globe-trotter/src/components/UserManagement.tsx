import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Badge } from 'react-bootstrap';
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import axios from 'axios';

interface User {
  id: number;
  name: string;
  email: string;
  trips: number;
  status: 'Active' | 'Suspended';
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/users');
        setUsers(response.data);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
    };
    fetchUsers();
  }, []);

  const toggleStatus = (userId: number) => {
    // This would be an API call in a real application
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'Active' ? 'Suspended' : 'Active' }
        : user
    ));
  };

  return (
    <Card>
      <Card.Header as="h5">User Management</Card.Header>
      <Card.Body>
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Trips</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.trips}</td>
                <td>
                  <Badge bg={user.status === 'Active' ? 'success' : 'danger'} onClick={() => toggleStatus(user.id)} style={{ cursor: 'pointer' }}>
                    {user.status}
                  </Badge>
                </td>
                <td>
                  <Button variant="outline-secondary" size="sm" className="me-2" title="View User's Trips">
                    <FaEye />
                  </Button>
                  <Button variant="outline-primary" size="sm" className="me-2" title="Edit User">
                    <FaEdit />
                  </Button>
                  <Button variant="outline-danger" size="sm" title="Delete User">
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

export default UserManagement;
