import express from 'express';
import cors from 'cors';
import moment from 'moment';
import { initializeDatabase, db } from './database.js';
import amadeus from './amadeus.js';
const app = express();
const port = 3001;
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());
// User Registration
app.post('/api/register', (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        const stmt = db.prepare('INSERT INTO Users (name, email, password, status) VALUES (?, ?, ?, ?)');
        const result = stmt.run(name, email, password, 'Active');
        res.status(201).json({ message: 'User registered successfully', userId: result.lastInsertRowid });
    }
    catch (error) {
        console.error('Failed to register user:', error);
        if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
            return res.status(409).json({ error: 'Email already exists.' });
        }
        res.status(500).json({ error: 'Failed to register user' });
    }
});
// User Login
app.post('/api/login', (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }
        const stmt = db.prepare('SELECT * FROM Users WHERE email = ? AND password = ?');
        const user = stmt.get(email, password);
        if (user) {
            res.json({ message: 'Login successful', user });
        }
        else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    }
    catch (error) {
        console.error('Failed to login:', error);
        res.status(500).json({ error: 'Failed to login' });
    }
});
// User Management
app.get('/api/users', (req, res) => {
    try {
        const stmt = db.prepare('SELECT Users.*, COUNT(Trips.id) as tripCount FROM Users LEFT JOIN Trips ON Users.id = Trips.user_id GROUP BY Users.id');
        const users = stmt.all();
        res.json(users);
    }
    catch (error) {
        console.error('Failed to fetch users:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});
app.put('/api/users/:id/status', (req, res) => {
    try {
        const { status } = req.body;
        if (!['Active', 'Suspended'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }
        const stmt = db.prepare('UPDATE Users SET status = ? WHERE id = ?');
        stmt.run(status, req.params.id);
        res.json({ message: 'User status updated successfully' });
    }
    catch (error) {
        console.error('Failed to update user status:', error);
        res.status(500).json({ error: 'Failed to update user status' });
    }
});
// Trip Management
app.get('/api/users/:id/trips', (req, res) => {
    try {
        const stmt = db.prepare('SELECT * FROM Trips WHERE user_id = ?');
        const trips = stmt.all(req.params.id);
        res.json(trips);
    }
    catch (error) {
        console.error('Failed to fetch user trips:', error);
        res.status(500).json({ error: 'Failed to fetch user trips' });
    }
});
app.get('/api/trips', (req, res) => {
    try {
        const stmt = db.prepare('SELECT Trips.*, Users.name as userName FROM Trips JOIN Users ON Trips.user_id = Users.id');
        const trips = stmt.all();
        res.json(trips);
    }
    catch (error) {
        console.error('Failed to fetch trips:', error);
        res.status(500).json({ error: 'Failed to fetch trips' });
    }
});
app.post('/api/trips', (req, res) => {
    try {
        const { destination, startDate, endDate, user_id } = req.body;
        if (!destination || !startDate || !endDate || !user_id) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        const duration = `${moment(endDate).diff(moment(startDate), 'days')} days`;
        const stmt = db.prepare('INSERT INTO Trips (destination, duration, start_date, end_date, user_id) VALUES (?, ?, ?, ?, ?)');
        const result = stmt.run(destination, duration, startDate, endDate, user_id);
        res.status(201).json({ message: 'Trip created successfully', tripId: result.lastInsertRowid });
    }
    catch (error) {
        console.error('Failed to create trip:', error);
        const errorMessage = error.message || 'An unknown error occurred';
        res.status(500).json({ error: 'Failed to create trip', details: errorMessage });
    }
});
app.delete('/api/trips/:id', (req, res) => {
    try {
        const stmt = db.prepare('DELETE FROM Trips WHERE id = ?');
        stmt.run(req.params.id);
        res.json({ message: 'Trip deleted successfully' });
    }
    catch (error) {
        console.error('Failed to delete trip:', error);
        res.status(500).json({ error: 'Failed to delete trip' });
    }
});
// Amadeus Points of Interest (POI) - Now with Geocoding
app.get('/api/amadeus/pois', async (req, res) => {
    const { city } = req.query;
    if (!city) {
        return res.status(400).json({ error: 'A city name is required.' });
    }
    try {
        // Step 1: Geocode the city name to get coordinates
        const citySearchResponse = await amadeus.referenceData.locations.cities.get({
            keyword: city,
            max: 1
        });
        // Robustly check for valid geocode data
        if (!citySearchResponse.data || citySearchResponse.data.length === 0 || !citySearchResponse.data[0].geoCode) {
            return res.status(404).json({ error: `Could not find a city named "${city}". Please try another name.` });
        }
        const { latitude, longitude } = citySearchResponse.data[0].geoCode;
        // Ensure coordinates are valid before using them
        if (typeof latitude !== 'number' || typeof longitude !== 'number') {
            return res.status(404).json({ error: `Could not find valid coordinates for "${city}".` });
        }
        // Step 2: Fetch POIs using the obtained coordinates
        const poiResponse = await amadeus.shopping.activities.get({
            latitude,
            longitude,
            radius: 20 // search within a 20km radius
        });
        res.json(poiResponse.data);
    }
    catch (error) {
        console.error('Amadeus API Error:', error);
        const errorDetails = error.response ? error.response.data : { message: error.message };
        res.status(500).json({
            error: 'Failed to fetch data from Amadeus.',
            details: errorDetails
        });
    }
});
// Itinerary and Points of Interest (POI)
// Mock POI data since we don't have a live API key
const mockPois = {
    paris: [
        { id: 1, name: 'Eiffel Tower', category: 'Landmark', photo: 'https://images.unsplash.com/photo-1502602898657-3e91760c0341?q=80&w=800&auto=format&fit=crop' },
        { id: 2, name: 'Louvre Museum', category: 'Museum', photo: 'https://images.unsplash.com/photo-1598605272254-16f0c0ecdfa4?q=80&w=800&auto=format&fit=crop' },
        { id: 3, name: 'Cathédrale Notre-Dame', category: 'Cathedral', photo: 'https://images.unsplash.com/photo-1558813529-c422acc15332?q=80&w=800&auto=format&fit=crop' },
        { id: 4, name: 'Montmartre', category: 'District', photo: 'https://images.unsplash.com/photo-1592133543320-997f53ad3e58?q=80&w=800&auto=format&fit=crop' },
    ],
    tokyo: [
        { id: 5, name: 'Shibuya Crossing', category: 'Landmark', photo: 'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?q=80&w=800&auto=format&fit=crop' },
        { id: 6, name: 'Senso-ji Temple', category: 'Temple', photo: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?q=80&w=800&auto=format&fit=crop' },
        { id: 7, name: 'Tokyo Skytree', category: 'Tower', photo: 'https://images.unsplash.com/photo-1536599018102-9f803c140fc1?q=80&w=800&auto=format&fit=crop' },
        { id: 8, name: 'Ghibli Museum', category: 'Museum', photo: 'https://images.unsplash.com/photo-1578637387934-0516a4d22465?q=80&w=800&auto=format&fit=crop' },
    ],
    default: [
        { id: 9, name: 'Local Market', category: 'Market', photo: 'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?q=80&w=800&auto=format&fit=crop' },
        { id: 10, name: 'City Park', category: 'Park', photo: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?q=80&w=800&auto=format&fit=crop' },
    ]
};
app.get('/api/pois', (req, res) => {
    const destination = (req.query.destination || '').toLowerCase();
    if (destination.includes('paris')) {
        res.json(mockPois.paris);
    }
    else if (destination.includes('tokyo')) {
        res.json(mockPois.tokyo);
    }
    else {
        res.json(mockPois.default);
    }
});
app.get('/api/trips/:tripId/itinerary', (req, res) => {
    try {
        const stmt = db.prepare('SELECT * FROM ItineraryItems WHERE trip_id = ? ORDER BY scheduled_day');
        const items = stmt.all(req.params.tripId);
        res.json(items);
    }
    catch (error) {
        console.error('Failed to fetch itinerary items:', error);
        res.status(500).json({ error: 'Failed to fetch itinerary items' });
    }
});
app.post('/api/itinerary', (req, res) => {
    try {
        const { trip_id, poi_name, poi_category, poi_photo_url, scheduled_day, notes } = req.body;
        if (!trip_id || !poi_name) {
            return res.status(400).json({ error: 'Trip ID and POI name are required' });
        }
        const stmt = db.prepare('INSERT INTO ItineraryItems (trip_id, poi_name, poi_category, poi_photo_url, scheduled_day, notes) VALUES (?, ?, ?, ?, ?, ?)');
        const result = stmt.run(trip_id, poi_name, poi_category, poi_photo_url, scheduled_day, notes);
        res.status(201).json({ message: 'Itinerary item added', id: result.lastInsertRowid });
    }
    catch (error) {
        console.error('Failed to add itinerary item:', error);
        res.status(500).json({ error: 'Failed to add itinerary item' });
    }
});
// Community Page
app.get('/api/community/posts', (req, res) => {
    try {
        const stmt = db.prepare(`
            SELECT Posts.*, Users.name, Users.email 
            FROM Posts 
            JOIN Users ON Posts.user_id = Users.id 
            ORDER BY Posts.id DESC
        `);
        const posts = stmt.all().map((post) => ({
            ...post,
            user: {
                id: post.user_id,
                name: post.name,
                avatar: `https://i.pravatar.cc/150?u=${post.email}`
            }
        }));
        res.json(posts);
    }
    catch (error) {
        console.error('Failed to fetch posts:', error);
        res.status(500).json({ error: 'Failed to fetch posts' });
    }
});
// Analytics
app.get('/api/analytics', (req, res) => {
    try {
        const totalUsers = db.prepare('SELECT COUNT(*) as count FROM Users').get().count;
        const totalTrips = db.prepare('SELECT COUNT(*) as count FROM Trips').get().count;
        const popularDestinations = db.prepare(`
            SELECT destination as name, COUNT(*) as value 
            FROM Trips 
            GROUP BY destination 
            ORDER BY value DESC 
            LIMIT 5
        `).all();
        // Mock user demographics as we don't have age data
        const userDemographics = [
            { name: '18-24', value: Math.floor(Math.random() * 500) },
            { name: '25-34', value: Math.floor(Math.random() * 500) },
            { name: '35-44', value: Math.floor(Math.random() * 500) },
            { name: '45-54', value: Math.floor(Math.random() * 500) },
            { name: '55+', value: Math.floor(Math.random() * 500) },
        ];
        const analyticsData = {
            totalUsers,
            totalTrips,
            popularDestinations,
            userDemographics,
        };
        res.json(analyticsData);
    }
    catch (error) {
        console.error('Failed to fetch analytics data:', error);
        res.status(500).json({ error: 'Failed to fetch analytics data' });
    }
});
// Calendar
app.get('/api/events', (req, res) => {
    try {
        const stmt = db.prepare('SELECT id, destination, start_date, end_date FROM Trips');
        const trips = stmt.all();
        const events = trips
            .map((trip) => {
            // Ensure dates are valid before creating Date objects
            const start = trip.start_date ? new Date(trip.start_date) : null;
            const end = trip.end_date ? new Date(trip.end_date) : null;
            if (start && end && !isNaN(start.getTime()) && !isNaN(end.getTime())) {
                return {
                    id: trip.id,
                    title: trip.destination,
                    start,
                    end,
                };
            }
            return null;
        })
            .filter(Boolean); // Remove any null entries from invalid dates
        res.json(events);
    }
    catch (error) {
        console.error('Failed to fetch events:', error);
        res.status(500).json({ error: 'Failed to fetch events' });
    }
});
const startServer = () => {
    try {
        initializeDatabase();
        app.listen(port, () => {
            console.log(`Backend server listening at http://localhost:${port}`);
        });
    }
    catch (err) {
        console.error("Failed to start server:", err);
        process.exit(1);
    }
};
startServer();
//# sourceMappingURL=server.js.map