//import statements
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
// Get the directory name of the current module to ensure a consistent DB path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Place the database in the project's root directory (`globe-trotter`)
const dbPath = path.resolve(__dirname, '..', '..', 'globetrotter.db');
// Create a single, exported database connection
// The connection is synchronous and persistent
export const db = new Database(dbPath, { verbose: console.log });
export const initializeDatabase = () => {
    console.log('Connected to the SQLite database with better-sqlite3.');
    db.exec(`
        CREATE TABLE IF NOT EXISTS Users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            status TEXT NOT NULL CHECK(status IN ('Active', 'Suspended')),
            role TEXT NOT NULL DEFAULT 'user' CHECK(role IN ('user', 'admin'))
        );
    `);
    db.exec(`
        CREATE TABLE IF NOT EXISTS Trips (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            destination TEXT NOT NULL,
            duration TEXT NOT NULL,
            start_date TEXT NOT NULL,
            end_date TEXT NOT NULL,
            user_id INTEGER,
            FOREIGN KEY (user_id) REFERENCES Users (id)
        );
    `);
    db.exec(`
        CREATE TABLE IF NOT EXISTS Posts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            content TEXT NOT NULL,
            timestamp TEXT NOT NULL,
            FOREIGN KEY (user_id) REFERENCES Users (id)
        );
    `);
    db.exec(`
        CREATE TABLE IF NOT EXISTS ItineraryItems (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            trip_id INTEGER NOT NULL,
            poi_name TEXT NOT NULL,
            poi_category TEXT,
            poi_photo_url TEXT,
            scheduled_day INTEGER,
            notes TEXT,
            FOREIGN KEY (trip_id) REFERENCES Trips (id) ON DELETE CASCADE
        );
    `);
    console.log('Tables created successfully.');
    // Add a column to Users table for existing databases
    try {
        db.exec("ALTER TABLE Users ADD COLUMN role TEXT NOT NULL DEFAULT 'user'");
        console.log("Added role column to Users table.");
    }
    catch (error) {
        if (!error.message.includes('duplicate column name')) {
            console.error('Failed to alter Users table:', error);
        }
    }
    const userCount = db.prepare('SELECT COUNT(*) as count FROM Users').get();
    if (userCount && userCount.count === 0) {
        const insertUser = db.prepare("INSERT INTO Users (name, email, password, status, role) VALUES (?, ?, ?, ?, ?)");
        insertUser.run('Admin', 'admin@globetrotter.com', 'admin123', 'Active', 'admin');
        insertUser.run('Alice', 'alice@example.com', 'password123', 'Active', 'user');
        insertUser.run('Bob', 'bob@example.com', 'password123', 'Active', 'user');
        insertUser.run('Charlie', 'charlie@example.com', 'password123', 'Suspended', 'user');
        console.log('Inserted mock users.');
    }
    else {
        // Ensure admin exists
        const admin = db.prepare("SELECT * FROM Users WHERE role = 'admin'").get();
        if (!admin) {
            const insertAdmin = db.prepare("INSERT INTO Users (name, email, password, status, role) VALUES (?, ?, ?, ?, ?)");
            insertAdmin.run('Admin', 'admin@globetrotter.com', 'admin123', 'Active', 'admin');
            console.log('Inserted admin user.');
        }
    }
    const tripCount = db.prepare('SELECT COUNT(*) as count FROM Trips').get();
    if (tripCount && tripCount.count === 0) {
        const insertTrip = db.prepare("INSERT INTO Trips (destination, duration, start_date, end_date, user_id) VALUES (?, ?, ?, ?, ?)");
        insertTrip.run('Paris', '7 days', '2025-08-01', '2025-08-10', 1);
        insertTrip.run('Tokyo', '10 days', '2025-08-15', '2025-08-25', 2);
        insertTrip.run('New York', '5 days', '2025-09-05', '2025-09-10', 3);
        console.log('Inserted mock trips.');
    }
    const postCount = db.prepare('SELECT COUNT(*) as count FROM Posts').get();
    if (postCount && postCount.count === 0) {
        const insertPost = db.prepare("INSERT INTO Posts (user_id, content, timestamp) VALUES (?, ?, ?)");
        insertPost.run(1, 'Just got back from an amazing trip to Paris! #travel #eiffeltower', '2 hours ago');
        insertPost.run(2, 'Exploring the vibrant streets of Tokyo. Any recommendations for good sushi places?', '5 hours ago');
        insertPost.run(3, 'Planning a trip to New York next month. What are the must-see spots?', '1 day ago');
        insertPost.run(1, 'Loved the beaches in Bali! #sunset #beachlife', '2 days ago');
        console.log('Inserted mock posts.');
    }
    console.log('Database initialized.');
};
// Close the database connection when the process exits
process.on('exit', () => db.close());
//# sourceMappingURL=database.js.map
//Db queries and operations can be added here as needed