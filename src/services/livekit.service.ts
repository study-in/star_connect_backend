// src/services/livekit.service.ts
import { AccessToken, RoomServiceClient, Room } from 'livekit-server-sdk';
import dotenv from 'dotenv';
dotenv.config();

const API_KEY = process.env.LIVEKIT_API_KEY;
const API_SECRET = process.env.LIVEKIT_API_SECRET;
const LIVEKIT_URL = process.env.LIVEKIT_URL; // Add LiveKit URL to .env if using RoomServiceClient

if (!API_KEY || !API_SECRET) {
    console.warn("LiveKit API Key or Secret not found in .env. LiveKit features may not work.");
}

// Optional: Initialize RoomServiceClient if you need server-side room management
const roomService = (LIVEKIT_URL && API_KEY && API_SECRET) ? new RoomServiceClient(LIVEKIT_URL, API_KEY, API_SECRET) : null;

/**
 * Generates a LiveKit access token for a client.
 * @param room - The name of the room the user wants to join.
 * @param identity - The unique identity of the user (e.g., User._id).
 * @param name - Optional display name for the user.
 * @param metadata - Optional metadata string.
 * @returns The generated JWT token.
 */
export const generateTokenService = (room: string, identity: string, name?: string, metadata?: string): string => {
    if (!API_KEY || !API_SECRET) {
        throw new Error("LiveKit API Key or Secret not configured.");
    }
    try {
        const at = new AccessToken(API_KEY, API_SECRET, {
            identity: identity,
            name: name, // Pass name if provided
            ttl: '1h' // Token Time-to-Live (e.g., 1 hour)
        });

        // Define permissions
        at.addGrant({
            roomJoin: true,
            room: room,
            canPublish: true, // Allow publishing audio/video
            canSubscribe: true, // Allow subscribing to others
            canPublishData: true, // Allow sending data messages
            canUpdateOwnMetadata: true, // Allow updating own metadata
            // Add other permissions as needed (e.g., roomAdmin)
        });

        if (metadata) {
            at.metadata = metadata; // Add metadata if provided
        }

        return at.toJwt();
    } catch (error: any) {
        console.error("Error generating LiveKit token:", error);
        throw new Error("Error generating LiveKit token: " + error.message);
    }
};

// --- Optional: Server-side room management functions ---
export const listRoomsService = async (): Promise<Room[]> => {
    if (!roomService) throw new Error("LiveKit URL not configured for RoomServiceClient.");
    return await roomService.listRooms();
};

export const createRoomService = async (roomName: string): Promise<Room> => {
    if (!roomService) throw new Error("LiveKit URL not configured for RoomServiceClient.");
    // Add room options if needed (e.g., max participants)
    return await roomService.createRoom({ name: roomName });
};

export const deleteRoomService = async (roomName: string): Promise<void> => {
     if (!roomService) throw new Error("LiveKit URL not configured for RoomServiceClient.");
     await roomService.deleteRoom(roomName);
};
