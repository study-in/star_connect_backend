import { Request, Response } from 'express';
import * as userService from '../services/userService';

export const getUser = (req: Request, res: Response): void => {
  const userDetails = userService.getUserDetails();
  res.json({ message: 'User details retrieved successfully', user: userDetails });
};

export const createUser = (req: Request, res: Response): void => {
  const result = userService.createOrUpdateUser(req.body);
  res.json({ message: 'User created/updated successfully', result });
};
