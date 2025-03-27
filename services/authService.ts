import jwt, { SignOptions } from 'jsonwebtoken';
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
