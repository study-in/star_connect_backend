// src/services/auth.service.ts
import jwt, { SignOptions } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import ms from 'ms';
import User, { IUser } from '../models/User.model'; // Import the User model
import AppError from '../utils/AppError'; // Assuming AppError utility exists

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const TOKEN_EXPIRATION = process.env.TOKEN_EXPIRATION || "1h";

if (!JWT_SECRET) {
    console.error("FATAL ERROR: JWT_SECRET is not defined.");
    process.exit(1);
}

export const registerUserService = async (userData: Partial<IUser>): Promise<IUser> => {
    // Add validation here (e.g., check if email exists)
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
        throw new AppError('Email already in use', 400);
    }
    if (!userData.password || userData.password.length < 6) {
         throw new AppError('Password must be at least 6 characters long', 400);
    }

    // Create user (password will be hashed by pre-save hook)
    const newUser = await User.create({
        name: userData.name,
        email: userData.email,
        password: userData.password,
        // Set default roles or allow specific roles on registration if needed
        roles: ['user'],
    });
    // Don't send password back, even hashed
    newUser.password = undefined;
    return newUser;
};

export const loginUserService = async (email: string, password: string): Promise<{ user: IUser, token: string }> => {
    if (!email || !password) {
        throw new AppError('Please provide email and password', 400);
    }

    // Find user and explicitly select password
    const user = await User.findOne({ email }).select('+password');

    // Use optional chaining for safety, although findOne should return null or doc
    if (!user || !(await user.correctPassword(password))) {
        throw new AppError('Incorrect email or password', 401); // Use 401 for authentication failure
    }

    // Generate token
    const token = signToken(user.id);

    // Remove password from output
    user.password = undefined;

    return { user, token };
};

// Helper function to sign JWT
const signToken = (id: string): string => {
    const payload = { id }; // Use user ID in payload

    // Calculate expiration
    const msFn = ms as unknown as (value: string) => number;
    const expiresInSeconds = Math.floor(msFn(TOKEN_EXPIRATION) / 1000);

    const signOptions: SignOptions = { expiresIn: expiresInSeconds };

    return jwt.sign(payload, JWT_SECRET!, signOptions);
};
