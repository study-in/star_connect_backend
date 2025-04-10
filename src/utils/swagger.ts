// src/utils/swagger.ts
import swaggerJsdoc, { Options } from 'swagger-jsdoc';
import path from 'path';
import { fileURLToPath } from 'url';
import config from '../config/index.js'; // Use .js

// ES Module equivalents for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Basic Swagger definition
// You should expand this with more details about your API
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: `${config.server_name} API Documentation`,
    version: '1.0.0', // Update version as needed
    description: `API endpoints for the ${config.server_name} application.`,
    license: {
      name: 'ISC', // Match your package.json license
      // url: 'Your license URL here',
    },
    contact: {
      name: 'Your Name/Company',
      // url: 'Your website',
      // email: 'Your email',
    },
  },
  servers: [
    {
      url: `http://localhost:${config.port}/api/v1`, // Development server
      description: 'Development Server',
    },
    // Add production server URL if applicable
    // {
    //   url: 'Your Production URL/api/v1',
    //   description: 'Production Server',
    // }
  ],
   components: {
    securitySchemes: {
      bearerAuth: { // Name for the security scheme
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT', // Optional, for documentation purposes
        description: 'Enter JWT Bearer token **_only_**',
      },
    },
    // Define common schemas here if needed
    // schemas: {
    //   ErrorResponse: {
    //     type: 'object',
    //     properties: {
    //       success: { type: 'boolean', example: false },
    //       message: { type: 'string' },
    //       errorMessages: {
    //         type: 'array',
    //         items: {
    //           type: 'object',
    //           properties: {
    //             path: { type: 'string' },
    //             message: { type: 'string' }
    //           }
    //         }
    //       },
    //       stack: { type: 'string', description: 'Only in development mode' }
    //     }
    //   }
    // }
  },
  security: [ // Apply the security scheme globally
    {
      bearerAuth: [], // Requires the 'bearerAuth' scheme defined above
    },
  ],
   tags: [ // Optional: Define tags for grouping routes
        { name: 'Auth', description: 'Authentication endpoints' },
        { name: 'Users', description: 'User management' },
        { name: 'Experts', description: 'Expert profile and services management' },
        { name: 'Bookings', description: 'Booking management' },
        { name: 'Payments', description: 'Payment processing' },
        { name: 'LiveKit', description: 'LiveKit related endpoints' },
        { name: 'Reviews', description: 'Review management' },
        { name: 'Notifications', description: 'Notification management' },
        // Add more tags as needed
    ],
};

// Options for swagger-jsdoc
const options: Options = {
  swaggerDefinition,
  // Path to the API docs (route files using JSDoc comments)
  // Adjust the glob pattern to match your route file locations
  apis: [
    path.join(__dirname, '../app/modules/**/*.route.ts'), // Route files using .ts
    path.join(__dirname, '../app/modules/**/*.route.js'), // Route files using .js (after build)
    // Add paths to interfaces/schemas if you define them there with JSDoc
    // path.join(__dirname, '../interfaces/**/*.ts'),
  ],
};

// Initialize swagger-jsdoc
export const swaggerSpec = swaggerJsdoc(options);

// Optional: Swagger UI options for customization
export const swaggerUiOptions = {
    // explorer: true, // Show the explorer search bar
    // customCss: '.swagger-ui .topbar { display: none }', // Hide the top bar
    customSiteTitle: `${config.server_name} API Docs`,
    // Add other UI options here
};
