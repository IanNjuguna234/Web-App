// server.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const { poolPromise, sql } = require('./db'); // Import the poolPromise from db.js

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Sample User Schema (MongoDB example)
const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    role: String,  // member, coach, admin
    name: String,  // Coach's name
});

const User = mongoose.model('User ', userSchema);

// Sample Schedule Schema
const scheduleSchema = new mongoose.Schema({
    eventName: String,
    date: String,
    members: [{ id: Number, name: String }],
    coachId: String, // ID of the coach for the event
});

const Schedule = mongoose.model('Schedule', scheduleSchema);

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/tennis_club', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Middleware for checking JWT tokens (authentication)
const authenticateJWT = (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) return res.sendStatus(403);

    jwt.verify(token, 'your_jwt_secret', (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// Admin creates a new schedule
app.post('/api/schedules', authenticateJWT, async (req, res) => {
    if (req.user.role !== 'admin') return res.sendStatus(403);

    const { eventName, date, coachId } = req.body;

    try {
        const newSchedule = new Schedule({
            eventName,
            date,
            coachId,
        });
        await newSchedule.save();
        res.status(201).json(newSchedule);
    } catch (err) {
        console.error('Error creating schedule:', err);
        res.status(500).send('Error creating schedule');
    }
});

// Fetch schedules for a coach
app.get('/api/coach/schedules', authenticateJWT, async (req, res) => {
    if (req.user.role !== 'coach') return res.sendStatus(403);

    try {
        const schedules = await Schedule.find({ coachId: req.user.email });
        res.json(schedules);
    } catch (err) {
        console.error('Error fetching schedules:', err);
        res.status(500).send('Error fetching schedules');
    }
});

// Get coach profile
app.get('/api/coach/profile', authenticateJWT, async (req, res) => {
    if (req.user.role !== 'coach') return res.sendStatus(403);
    
    const coachProfile = await User.findOne({ email: req.user.email });
    res.json(coachProfile);
});

// Start the server
app.listen(5000, () => {
    console.log('Server running on http://localhost:5000');
});