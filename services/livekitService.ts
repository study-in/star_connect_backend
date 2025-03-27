import { AccessToken } from 'livekit-server-sdk';
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
