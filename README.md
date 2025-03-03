# **Star Connect Backend**

**Description:**  
Star Connect Backend is a Node.js backend application featuring JWT-based authentication, modular architecture with controllers, services, and routes, dynamic server-side rendering using EJS, and cloud MongoDB integration via Mongoose. The server conditionally runs over HTTPS if SSL certificates are provided; otherwise, it defaults to HTTP.

---

## **Features**

* **JWT-based Authentication:**  
  Secure user registration and login using JSON Web Tokens.  
* **Modular Architecture:**  
  Separation of concerns with dedicated directories for controllers, services, routes, middlewares, models, helpers, and views.  
* **Dynamic Views:**  
  Server-side rendering using EJS templates for dynamic content generation.  
* **MongoDB Integration:**  
  Cloud-hosted MongoDB via Mongoose for persistent data storage.  
* **Conditional HTTPS Support:**  
  Automatically runs over HTTPS if SSL certificates are provided in the `cert` directory.  
* **Static Assets:**  
  Serves static files from the `public` folder under the `/static` route.

---

## **Installation**

**1\. **Clone the Repository:**  
   Open your terminal and run:

   `git clone https://github.com/yourusername/star-connect-backend.git`

`cd star-connect-backend`

**2\. Install Dependencies:**  
	Install the required Node.js dependencies by running:  
	  
	`npm install`

**3\. Configure Environment Variables:**  
Create a file named `.env` in the project root and add the following:

`PORT=3000`  
`JWT_SECRET=your_strong_jwt_secret`  
`TOKEN_EXPIRATION=1h`  
`MONGODB_URI=your_mongodb_connection_string`

1. Replace `your_strong_jwt_secret` and `your_mongodb_connection_string` with your actual values.  
2. **Set Up SSL Certificates (Optional):**  
   To run the server over HTTPS, place your `server.cert` and `server.key` files inside the `cert` directory.

---

## **Usage**

1. **Starting the Server:**  
   To start the backend server, run:

   `npm start`  
   1. If SSL certificates are present, the server will run over HTTPS on the specified port.  
   2. If no certificates are provided, the server will run over HTTP.

2. **Routes:**  
   1. **Root Route:**  
      `GET /` returns a welcome message: "Welcome to the Star Connect Backend\!"  
   2. **Dynamic View Route:**  
      `GET /home` renders a dynamic page using an EJS template (located in the `views` folder).  
   3. **Static Assets:**  
      Static files (like `index.html`) are available under the `/static` route.  
   4. **Authentication Routes:**  
      Routes under `/auth` handle user registration and login.  
   5. **Protected User Routes:**  
      Routes under `/user` are protected by JWT authentication middleware.

---

## **Project Structure**

The project is organized as follows:

1. **controllers/**  
   Contains controllers that handle incoming requests. Controllers delegate business logic to services.  
2. **services/**  
   Contains service modules that encapsulate business logic. Controllers call these services to perform operations.  
3. **routes/**  
   Contains route definitions for different parts of the application (e.g., authentication, user-related routes).  
4. **middlewares/**  
   Contains middleware functions such as authentication (JWT verification) and logging.  
5. **models/**  
   Contains Mongoose models for interacting with the MongoDB database.  
6. **helpers/**  
   Contains utility functions that support various operations.  
7. **views/**  
   Contains EJS templates for server-side rendered pages.  
8. **public/**  
   Contains static assets (HTML, CSS, JavaScript, images) served via the `/static` route.  
9. **cert/**  
   Contains SSL certificate files (`server.cert` and `server.key`) for HTTPS support.  
10. **db.js**  
    Handles the connection to the MongoDB database via Mongoose.  
11. **app.js**  
    The main application file that sets up middleware, routes, view engine (EJS), and conditional HTTPS/HTTP server configuration.  
12. **.env**  
    Contains environment variables (this file is excluded from version control).  
13. **package.json**  
    Contains project metadata, dependencies, and scripts.

---

## **Contributing**

Contributions are welcome\! Please fork this repository and submit a pull request with your improvements. Make sure to follow best practices and update tests as necessary.

---

## **License**

This project is licensed under the MIT License.

---

## **Additional Notes**

1. **Cloud MongoDB:**  
   This project is configured to use a cloud MongoDB instance via Mongoose. Update the `MONGODB_URI` in your `.env` file with your connection string from MongoDB Atlas or another cloud provider.  
2. **Security:**  
   Ensure that sensitive files such as `.env` and SSL certificates are not committed to your Git repository. Use a `.gitignore` file to exclude these.  
3. **.gitignore:**  
   A sample `.gitignore` file is included in the repository to exclude `node_modules`, `.env`, logs, and other unnecessary files from version control.
