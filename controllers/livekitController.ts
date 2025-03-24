import { Request, Response } from 'express';
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
