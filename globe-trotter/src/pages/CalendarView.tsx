import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './CalendarView.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Container } from 'react-bootstrap';
import axios from 'axios';

const localizer = momentLocalizer(moment);

const CalendarView: React.FC = () => {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/events');
                // The dates need to be converted to Date objects for the calendar
                const formattedEvents = response.data.map((event: any) => ({
                    ...event,
                    start: new Date(event.start),
                    end: new Date(event.end),
                }));
                setEvents(formattedEvents);
            } catch (error) {
                console.error('Failed to fetch events:', error);
            }
        };
        fetchEvents();
    }, []);

    return (
        <>
            <Header />
            <Container className="my-5">
                <h2 className="text-center mb-4" style={{ color: 'var(--primary-color)' }}>
                    Trip Calendar
                </h2>
                <div style={{ height: '70vh' }}>
                    <Calendar
                        localizer={localizer}
                        events={events}
                        startAccessor="start"
                        endAccessor="end"
                        style={{ height: '100%' }}
                    />
                </div>
            </Container>
            <Footer />
        </>
    );
};

export default CalendarView;