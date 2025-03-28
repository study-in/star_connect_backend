import dotenv from 'dotenv';
dotenv.config();
import './db'; // Connect to MongoDB
import express from 'express';
import path from 'path';
import cors from 'cors';
import fs from 'fs';
import http from 'http';

const app = express();

// Set EJS as the view engine and specify the views directory
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Import route groups and middlewares
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import livekitRoutes from './routes/livekitRoutes';
import authenticateToken from './middlewares/auth';
import logger from './middlewares/logger';

// Middlewares
app.use(express.json());
app.use(cors());
app.use(logger);

// Root route with static text
app.get('/', (req, res) => {
  res.send("Welcome to the Star Connect Backend!");
});

// Route to render dynamic EJS view from 'views'
app.get('/home', (req, res) => {
  res.render('index'); // renders views/index.ejs
});

// Serve static files on /static route (e.g., index.html)
app.use('/static', express.static(path.join(__dirname, 'public')));

// Route groups for authentication, LiveKit token generation, and protected routes
app.use('/auth', authRoutes);
app.use('/livekit', livekitRoutes);
app.use('/user', authenticateToken, userRoutes);

const PORT = process.env.PORT || 3000;

// Conditional server creation: HTTPS if cert files exist, otherwise HTTP
const certPath = path.join(__dirname, 'cert', 'server.cert');
const keyPath = path.join(__dirname, 'cert', 'server.key');

if (fs.existsSync(certPath) && fs.existsSync(keyPath)) {
  const https = require('https');
  const httpsOptions = {
    key: fs.readFileSync(keyPath),
    cert: fs.readFileSync(certPath)
  };
  https.createServer(httpsOptions, app).listen(PORT, () => {
    console.log("HTTPS Server running on port " + PORT);
  });
} else {
  http.createServer(app).listen(PORT, () => {
    console.log("HTTP Server running on port " + PORT);
  });
}
