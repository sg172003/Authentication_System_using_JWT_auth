#Fullstack Authentication System

Project Overview

This repository contains a production ready authentication backend built using Node.js, Express, and MongoDB.
The project is built step by step with a strong focus on fundamentals, security concepts, and clean backend architecture.

The goal of this project is not just to make authentication work, but to understand how authentication works internally in real world applications.

This repository is ideal for backend beginners, full stack learners, and students preparing for internships or entry level roles.

What You Will Learn

• Difference between authentication and authorization
• How JWT works internally
• Access token and refresh token lifecycle
• Secure password storage using bcrypt
• Token expiration handling
• Backend project structuring
• Writing clean and maintainable Express code

Features

• User signup with secure password hashing
• User login with credential validation
• JWT based authentication system
• Access token and refresh token flow
• Token expiration handling
• Secure logout mechanism
• Protected routes using authentication middleware
• Environment variable based configuration
• Clean and scalable backend architecture

Tech Stack

Backend
• Node.js
• Express.js

Database
• MongoDB
• Mongoose

Authentication and Security
• JSON Web Token
• bcrypt

Utilities
• dotenv
• cors
• nodemon

Folder Structure

server
controllers
routes
models
middlewares
utils
config
app.js
server.js

Folder Explanation

app.js
This file configures the Express application.
It sets up middleware and base routes.
It does not start the server.

server.js
This is the entry point of the application.
It loads environment variables.
It connects to MongoDB.
It starts the server only after a successful database connection.

controllers
Contains the business logic for handling requests.
Keeps route files clean and readable.

routes
Defines API endpoints.
Maps routes to controller functions.

models
Contains Mongoose schemas.
Defines how data is stored in MongoDB.

middlewares
Contains custom middleware.
Used mainly for authentication and route protection.

utils
Contains helper functions such as token generation.

config
Contains configuration related logic such as database setup.

Environment Variables

Create a .env file inside the server folder.

Example values.

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_ACCESS_SECRET=your_access_token_secret
JWT_REFRESH_SECRET=your_refresh_token_secret

Never push the .env file to GitHub.

How to Run Locally

Clone the repository

Navigate to the server folder

Install dependencies

npm install

Create a .env file with required variables

Start the development server

npm run dev

The server will start only after a successful MongoDB connection.


