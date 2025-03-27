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
    content: `import jwt, { SignOptions } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import ms from 'ms';
dotenv.config();

interface User {
  username: string;
  password: string;
}

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
  
  // Retrieve TOKEN_EXPIRATION from environment; default to "1h"
  const expirationValue: string = process.env.TOKEN_EXPIRATION || "1h";
  const msFn = ms as unknown as (value: string) => number;
  const expirationMs: number = msFn(expirationValue);
  const expirationSeconds: number = expirationMs / 1000;
  
  const signOptions: SignOptions = { expiresIn: expirationSeconds };
  
  const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET as string, signOptions);
  return token;
};
`
  },
  // services/userService.ts
  {
    filePath: path.join('services', 'userService.ts'),
    content: `export const getUserDetails = () => {
  return { name: "John Doe", email: "john@example.com" };
};

export const createOrUpdateUser = (userData: any) => {
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
  // db.ts - Database connection file (using Mongoose)
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
    "@types/cors": "^2.8.12",
    "@types/jsonwebtoken": "^9.0.1",
    "@types/bcryptjs": "^2.4.2"
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
  },
  // ----- Updated Model Schemas in Mongoose -----
  // models/User.ts
  {
    filePath: path.join('models', 'User.ts'),
    content: `import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password_hash: string;
  role: string;
  phone?: string;
  created_at: Date;
  updated_at: Date;
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password_hash: { type: String, required: true },
  role: { type: String, required: true },
  phone: { type: String },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

export default mongoose.model<IUser>('User', UserSchema);
`
  },
  // models/ExpertProfile.ts
  {
    filePath: path.join('models', 'ExpertProfile.ts'),
    content: `import mongoose, { Schema, Document } from 'mongoose';

export interface IExpertProfile extends Document {
  user_id: mongoose.Types.ObjectId;
  bio?: string;
  expertise?: string;
  qualifications?: string;
  pricing?: number;
  availability?: any;
  bank_details?: any;
  verified: boolean;
  created_at: Date;
  updated_at: Date;
}

const ExpertProfileSchema: Schema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  bio: { type: String },
  expertise: { type: String },
  qualifications: { type: String },
  pricing: { type: Number },
  availability: { type: Schema.Types.Mixed },
  bank_details: { type: Schema.Types.Mixed },
  verified: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

export default mongoose.model<IExpertProfile>('ExpertProfile', ExpertProfileSchema);
`
  },
  // models/Appointment.ts
  {
    filePath: path.join('models', 'Appointment.ts'),
    content: `import mongoose, { Schema, Document } from 'mongoose';

export interface IAppointment extends Document {
  user_id: mongoose.Types.ObjectId;
  expert_id: mongoose.Types.ObjectId;
  call_type: string;
  subject?: string;
  duration?: number;
  scheduled_at?: Date;
  status?: string;
  livekit_room_id?: string;
  livekit_token?: string;
  call_status?: string;
  group_details?: any;
  created_at: Date;
  updated_at: Date;
}

const AppointmentSchema: Schema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  expert_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  call_type: { type: String, required: true },
  subject: { type: String },
  duration: { type: Number },
  scheduled_at: { type: Date },
  status: { type: String },
  livekit_room_id: { type: String },
  livekit_token: { type: String },
  call_status: { type: String },
  group_details: { type: Schema.Types.Mixed },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

export default mongoose.model<IAppointment>('Appointment', AppointmentSchema);
`
  },
  // models/Message.ts
  {
    filePath: path.join('models', 'Message.ts'),
    content: `import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
  sender_id: mongoose.Types.ObjectId;
  receiver_id: mongoose.Types.ObjectId;
  content: string;
  message_type: string;
  status?: string;
  livekit_flag?: boolean;
  created_at: Date;
  updated_at: Date;
}

const MessageSchema: Schema = new Schema({
  sender_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  receiver_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  message_type: { type: String, required: true },
  status: { type: String },
  livekit_flag: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

export default mongoose.model<IMessage>('Message', MessageSchema);
`
  },
  // models/StarWishOrder.ts
  {
    filePath: path.join('models', 'StarWishOrder.ts'),
    content: `import mongoose, { Schema, Document } from 'mongoose';

export interface IStarWishOrder extends Document {
  user_id: mongoose.Types.ObjectId;
  expert_id: mongoose.Types.ObjectId;
  recipient_name: string;
  recipient_email: string;
  video_type: string;
  instructions?: string;
  tone?: string;
  video_length?: number;
  privacy?: string;
  delivery_time?: string;
  status?: string;
  created_at: Date;
  updated_at: Date;
}

const StarWishOrderSchema: Schema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  expert_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  recipient_name: { type: String, required: true },
  recipient_email: { type: String, required: true },
  video_type: { type: String, required: true },
  instructions: { type: String },
  tone: { type: String },
  video_length: { type: Number },
  privacy: { type: String },
  delivery_time: { type: String },
  status: { type: String },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

export default mongoose.model<IStarWishOrder>('StarWishOrder', StarWishOrderSchema);
`
  },
  // models/PaymentTransaction.ts
  {
    filePath: path.join('models', 'PaymentTransaction.ts'),
    content: `import mongoose, { Schema, Document } from 'mongoose';

export interface IPaymentTransaction extends Document {
  user_id: mongoose.Types.ObjectId;
  expert_id?: mongoose.Types.ObjectId;
  amount: number;
  payment_method: string;
  transaction_type: string;
  status?: string;
  sslcommerz_transaction_id?: string;
  sslcommerz_response?: any;
  payment_verified_at?: Date;
  created_at: Date;
  updated_at: Date;
}

const PaymentTransactionSchema: Schema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  expert_id: { type: Schema.Types.ObjectId, ref: 'User' },
  amount: { type: Number, required: true },
  payment_method: { type: String, required: true },
  transaction_type: { type: String, required: true },
  status: { type: String },
  sslcommerz_transaction_id: { type: String },
  sslcommerz_response: { type: Schema.Types.Mixed },
  payment_verified_at: { type: Date },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

export default mongoose.model<IPaymentTransaction>('PaymentTransaction', PaymentTransactionSchema);
`
  },
  // models/PromoCode.ts
  {
    filePath: path.join('models', 'PromoCode.ts'),
    content: `import mongoose, { Schema, Document } from 'mongoose';

export interface IPromoCode extends Document {
  code: string;
  discount_type: string;
  discount_value: number;
  applicable_to: string;
  expiry_date?: Date;
  created_at: Date;
}

const PromoCodeSchema: Schema = new Schema({
  code: { type: String, required: true, unique: true },
  discount_type: { type: String, required: true },
  discount_value: { type: Number, required: true },
  applicable_to: { type: String },
  expiry_date: { type: Date },
  created_at: { type: Date, default: Date.now }
});

export default mongoose.model<IPromoCode>('PromoCode', PromoCodeSchema);
`
  },
  // models/Referral.ts
  {
    filePath: path.join('models', 'Referral.ts'),
    content: `import mongoose, { Schema, Document } from 'mongoose';

export interface IReferral extends Document {
  referrer_id: mongoose.Types.ObjectId;
  referred_id: mongoose.Types.ObjectId;
  credit_awarded: number;
  status?: string;
  created_at: Date;
}

const ReferralSchema: Schema = new Schema({
  referrer_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  referred_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  credit_awarded: { type: Number, required: true },
  status: { type: String },
  created_at: { type: Date, default: Date.now }
});

export default mongoose.model<IReferral>('Referral', ReferralSchema);
`
  },
  // models/Review.ts
  {
    filePath: path.join('models', 'Review.ts'),
    content: `import mongoose, { Schema, Document } from 'mongoose';

export interface IReview extends Document {
  expert_id: mongoose.Types.ObjectId;
  user_id: mongoose.Types.ObjectId;
  rating: number;
  comment?: string;
  created_at: Date;
  updated_at: Date;
}

const ReviewSchema: Schema = new Schema({
  expert_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true },
  comment: { type: String },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

export default mongoose.model<IReview>('Review', ReviewSchema);
`
  }
];

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
