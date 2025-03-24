// createStructure.js
const fs = require('fs');
const path = require('path');

// Define directories to create (all backend code will be in TypeScript)
const directories = [
  'controllers',
  'routes',
  'helpers',
  'models',
  'middlewares',
  'services',
  path.join('public', 'images'),
  path.join('public', 'javascripts'),
  path.join('public', 'stylesheets'),
  'views',
  'cert' // For storing SSL certificate files
];

// Create directories recursively
directories.forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Created directory: ${dir}`);
  } else {
    console.log(`Directory already exists: ${dir}`);
  }
});

// Define sample files with content (all files are TypeScript)
const sampleFiles = [
  // tsconfig.json – Configure for ESM using NodeNext resolution
  {
    filePath: 'tsconfig.json',
    content: `{
  "compilerOptions": {
    "target": "ES2020",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["**/*.ts"]
}
`
  },
  // services/authService.ts
  {
    filePath: path.join('services', 'authService.ts'),
    content: `import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config();

interface User {
  username: string;
  password: string;
}

// In-memory user store for demonstration (replace with a database in production)
const users: User[] = [];

export const registerUser = async (username: string, password: string): Promise<User> => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const user: User = { username, password: hashedPassword };
  users.push(user);
  return user;
};

export const loginUser = async (username: string, password: string): Promise<string> => {
  const user = users.find(u => u.username === username);
  if (!user) {
    throw new Error('Invalid credentials');
  }
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    throw new Error('Invalid credentials');
  }
  const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET as string, {
    expiresIn: process.env.TOKEN_EXPIRATION,
  });
  return token;
};
`
  },
  // services/userService.ts
  {
    filePath: path.join('services', 'userService.ts'),
    content: `export const getUserDetails = () => {
  // Replace with actual logic to retrieve user details
  return { name: "John Doe", email: "john@example.com" };
};

export const createOrUpdateUser = (userData: any) => {
  // Replace with actual logic to create/update user
  return { success: true, user: userData };
};
`
  },
  // services/livekitService.ts
  {
    filePath: path.join('services', 'livekitService.ts'),
    content: `import { AccessToken } from 'livekit-server-sdk';
import dotenv from 'dotenv';
dotenv.config();

const API_KEY = process.env.LIVEKIT_API_KEY || "YOUR_LIVEKIT_API_KEY";
const API_SECRET = process.env.LIVEKIT_API_SECRET || "YOUR_LIVEKIT_API_SECRET";

// Function to generate a LiveKit token for a given room and identity
export const generateToken = (room: string, identity: string): string => {
  try {
    const at = new AccessToken(API_KEY, API_SECRET, { identity, ttl: '1h' });
    at.addGrant({ 
      roomJoin: true,
      room: room,
      canUpdateOwnMetadata: true
    });
    return at.toJwt();
  } catch (error: any) {
    throw new Error("Error generating LiveKit token: " + error.message);
  }
};
`
  },
  // controllers/authController.ts
  {
    filePath: path.join('controllers', 'authController.ts'),
    content: `import { Request, Response } from 'express';
import * as authService from '../services/authService';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;
    await authService.registerUser(username, password);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err: any) {
    res.status(500).json({ message: 'Error registering user', error: err.message });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;
    const token = await authService.loginUser(username, password);
    res.json({ token });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};
`
  },
  // controllers/userController.ts
  {
    filePath: path.join('controllers', 'userController.ts'),
    content: `import { Request, Response } from 'express';
import * as userService from '../services/userService';

export const getUser = (req: Request, res: Response): void => {
  const userDetails = userService.getUserDetails();
  res.json({ message: 'User details retrieved successfully', user: userDetails });
};

export const createUser = (req: Request, res: Response): void => {
  const result = userService.createOrUpdateUser(req.body);
  res.json({ message: 'User created/updated successfully', result });
};
`
  },
  // controllers/livekitController.ts
  {
    filePath: path.join('controllers', 'livekitController.ts'),
    content: `import { Request, Response } from 'express';
import * as livekitService from '../services/livekitService';

export const getToken = (req: Request, res: Response): void => {
  const room = req.query.room as string;
  const identity = req.query.identity as string;
  if (!room || !identity) {
    res.status(400).json({ message: 'Room and identity are required' });
    return;
  }
  try {
    const token = livekitService.generateToken(room, identity);
    res.json({ token });
  } catch (error: any) {
    res.status(500).json({ message: 'Error generating token', error: error.message });
  }
};
`
  },
  // routes/authRoutes.ts
  {
    filePath: path.join('routes', 'authRoutes.ts'),
    content: `import { Router } from 'express';
import * as authController from '../controllers/authController';

const router = Router();

router.post('/register', authController.register);
router.post('/login', authController.login);

export default router;
`
  },
  // routes/userRoutes.ts
  {
    filePath: path.join('routes', 'userRoutes.ts'),
    content: `import { Router } from 'express';
import * as userController from '../controllers/userController';

const router = Router();

router.get('/', userController.getUser);
router.post('/', userController.createUser);

export default router;
`
  },
  // routes/livekitRoutes.ts
  {
    filePath: path.join('routes', 'livekitRoutes.ts'),
    content: `import { Router } from 'express';
import * as livekitController from '../controllers/livekitController';
import authenticateToken from '../middlewares/auth';

const router = Router();

// Endpoint to generate a LiveKit token
// Example: GET /livekit/token?room=demo-room&identity=anonymous
router.get('/token', authenticateToken, livekitController.getToken);

export default router;
`
  },
  // helpers/formatDate.ts
  {
    filePath: path.join('helpers', 'formatDate.ts'),
    content: `export const formatDate = (date: Date): string => {
  return date.toDateString();
};
`
  },
  // middlewares/auth.ts
  {
    filePath: path.join('middlewares', 'auth.ts'),
    content: `import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    res.sendStatus(401);
    return;
  }
  jwt.verify(token, process.env.JWT_SECRET as string, (err, user) => {
    if (err) {
      res.sendStatus(403);
      return;
    }
    (req as any).user = user;
    next();
  });
};

export default authenticateToken;
`
  },
  // middlewares/logger.ts
  {
    filePath: path.join('middlewares', 'logger.ts'),
    content: `import { Request, Response, NextFunction } from 'express';

const logger = (req: Request, res: Response, next: NextFunction): void => {
  console.log(req.method + " " + req.url);
  next();
};

export default logger;
`
  },
  // db.ts - Database connection file (updated for Mongoose 7)
  {
    filePath: 'db.ts',
    content: `import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const mongoURI = process.env.MONGODB_URI as string;

mongoose.connect(mongoURI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((error) => console.error("MongoDB connection error:", error));

export default mongoose;
`
  },
  // app.ts - Main app file with conditional HTTPS/HTTP server configuration, DB connection, and EJS view engine setup
  {
    filePath: 'app.ts',
    content: `import dotenv from 'dotenv';
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
`
  },
  // .env file - Contains environment variables
  {
    filePath: '.env',
    content: `PORT=3000
JWT_SECRET=your_strong_jwt_secret
TOKEN_EXPIRATION=1h
MONGODB_URI=your_mongodb_connection_string
LIVEKIT_API_KEY=APIRqsuKpqCnpdq
LIVEKIT_API_SECRET=ukOpIrNfL66FQPuoqMXsBo2Gh2KDgvjrbLJbYZbPZOP
`
  },
  // package.json - Project configuration
  {
    filePath: 'package.json',
    content: `{
  "name": "star-connect-backend",
  "version": "1.0.0",
  "description": "A Node.js backend with JWT authentication for Star Connect",
  "main": "app.js",
  "scripts": {
    "start": "ts-node app.ts"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "bcryptjs": "^2.4.3",
    "cors": "^2.8.5",
    "dotenv": "^16.0.0",
    "express": "^4.18.2",
    "jsonwebtoken": "^9.0.0",
    "mongoose": "^7.0.0",
    "ejs": "^3.1.9",
    "livekit-server-sdk": "^1.0.0"
  },
  "devDependencies": {
    "ts-node": "^10.9.1",
    "typescript": "^5.0.0",
    "@types/express": "^4.17.17",
    "@types/node": "^20.2.5",
    "@types/cors": "^2.8.12"
  }
}
`
  },
  // public/index.html - Sample static HTML file
  {
    filePath: path.join('public', 'index.html'),
    content: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Star Connect Static Page</title>
</head>
<body>
  <h1>This is the static index page served at /static</h1>
</body>
</html>
`
  },
  // views/index.ejs - Sample EJS view for dynamic rendering
  {
    filePath: path.join('views', 'index.ejs'),
    content: `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>Welcome</title>
  </head>
  <body>
    <h1>Welcome to the Star Connect Backend!</h1>
    <p>This is a dynamic page rendered on the server.</p>
  </body>
</html>
`
  }
];

// Create each sample file if it doesn't exist
sampleFiles.forEach((item) => {
  const filePath = path.join(process.cwd(), item.filePath);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, item.content, 'utf8');
    console.log("Created file: " + item.filePath);
  } else {
    console.log("File already exists: " + item.filePath);
  }
});

console.log("Project structure creation complete.");
