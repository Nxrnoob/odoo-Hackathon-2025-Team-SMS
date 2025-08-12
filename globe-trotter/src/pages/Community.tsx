import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Image } from 'react-bootstrap';
import Header from '../components/Header';
import Footer from '../components/Footer';
import axios from 'axios';

interface Post {
    id: number;
    content: string;
    timestamp: string;
    user: {
        id: number;
        name: string;
        avatar: string;
    };
}

const Community: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>([]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/community/posts');
                setPosts(response.data);
            } catch (error) {
                console.error('Failed to fetch posts:', error);
            }
        };
        fetchPosts();
    }, []);

    return (
        <>
            <Header />
            <Container>
                <h2 className="my-4">Community Feed</h2>

                <Card className="mb-4">
                    <Card.Body>
                        <Form>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                                <Form.Control as="textarea" rows={3} placeholder="Share your travel experiences..." />
                            </Form.Group>
                            <Button variant="primary">Post</Button>
                        </Form>
                    </Card.Body>
                </Card>

                {posts.map((post) => (
                    <Card key={post.id} className="mb-3">
                        <Card.Body>
                            <Row>
                                <Col xs={2} md={1} className="text-center">
                                    <Image src={post.user.avatar} roundedCircle fluid />
                                </Col>
                                <Col xs={10} md={11}>
                                    <p className="mb-0">
                                        <strong>{post.user.name}</strong> <small className="text-muted">· {post.timestamp}</small>
                                    </p>
                                    <p>{post.content}</p>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                ))}
            </Container>
            <Footer />
        </>
    );
};

export default Community;