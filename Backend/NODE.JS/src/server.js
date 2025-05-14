import express from 'express';
import bodyParser from 'body-parser';
import session from 'express-session';
import passport from './config/passport.js';
import viewEngine from './config/viewEngine';
import initWebRoutes from './route/web';
import connectDB from './config/connectdb';
import cors from 'cors';

require('dotenv').config();

const app = express();

// Enable CORS
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser config
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Session configuration - MUST be before passport initialization
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // set to true only if using HTTPS
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Initialize Passport and restore authentication state from session
app.use(passport.initialize());
app.use(passport.session());

// View engine setup
viewEngine(app);

// Initialize web routes
initWebRoutes(app);

// Database connection
connectDB();

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ error: 'Something went wrong!' });
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});