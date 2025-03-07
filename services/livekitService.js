const { AccessToken } = require('livekit-server-sdk');
require('dotenv').config();

// Using provided LiveKit API key and secret from the .env file
const API_KEY = process.env.LIVEKIT_API_KEY || "YOUR_LIVEKIT_API_KEY";
const API_SECRET = process.env.LIVEKIT_API_SECRET || "YOUR_LIVEKIT_API_SECRET";

// Function to generate a LiveKit token for a given room and identity
exports.generateToken = (room, identity) => {
  try {
    const at = new AccessToken(API_KEY, API_SECRET, { identity, ttl: '1h' });
    at.addGrant({ 
      roomJoin: true,
      room: room,
      canUpdateOwnMetadata: true, 
    });
    return at.toJwt();
  } catch (error) {
    throw new Error("Error generating LiveKit token: " + error.message);
  }
};
