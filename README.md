# Livraison AlloMediaGroup (Part 1: Authentication JWT Backend)

## 1. Introduction

### Project Overview
This project is the backend part of the "Livraison AlloMedia" application, focused on security and user authentication. It is built using Node.js with Express.js and implements JSON Web Token (JWT) authentication and two-factor authentication (2FA). The project also provides a REST API for user, order, and delivery management.


### Purpose and Goals
The goal of this project is to ensure secure user authentication, protect sensitive data, and manage user roles through JWT and 2FA. The application will offer basic CRUD operations for users, orders, and deliveries while maintaining a high level of security(In future Parts).


### Target Audience
This project is designed for developers looking to build secure authentication systems in their Node.js applications. It can also be used by businesses that need a backend for managing deliveries and user roles (clients and delivery agents).


## 2. Getting Started

### Prerequisites
To run this project, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (version 14 or above)
- [MongoDB](https://www.mongodb.com/) (local or cloud-based MongoDB server)
- [Git](https://git-scm.com/)

### Installation Instructions
1. Clone the repository:
   ```bash
   git clone https://github.com/your-repository/allomediagroup.git
2. cd allomediagroup
3. npm install
4. Create .env file that contains what's included in .env.example
5. npm run dev


### Quick Start Guide

** To register a user, send a POST request to /api/auth/register
** JWT Token will be created and sent to your email, click on it in order to verify your account
** To log in, send a POST request to /api/auth/login
** You will receive an OTP via your email . Validate the OTP via /api/auth/verify-otp/:id/:otpCode
or you can just click on button in your email, and write done your OTP Code.
** To Reset password, first you have to submit your valid email to /api/auth/forgetpassword and then you will recieve an email where you can click to reset you password in the route /api/auth/resetpassword/:id/:token



## 3. Project Structure:

### Overview:
allomediagroup/
│
├── config/            # Contains your database connexion
├── controllers/       # Contains logic for handling authentication and user management
├── helpers/           # functions that help controller to avoid repetitve block of code
├── models/            # Mongoose models for User
├── routes/            # API routes for authentication and CRUD operations
├── Test /             # Unit tests for authentication and 2FA
├── .env               # Environment variables
├── server.js          # Main server entry point
├── app.js             # Contains the main application file.
└── package.json       # Project dependencies and scripts

##  4. Features:

## User Registration: 
Users can register by providing their name, email, phone number, password, and phone. An email verification is sent after registration.
## JWT Authentication:
Once users log in with valid credentials, they receive a JWT for secure API access.
## Two-Factor Authentication (2FA): 
Upon login, a One-Time Password (OTP) is sent via email .
## Password Reset:
Users can reset their password using their registered email.


# 5.  Packages Used:

** express: Fast and minimal web framework for Node.js.
** jsonwebtoken: Used for implementing JWT-based authentication.
** mongoose: MongoDB object modeling tool for Node.js.
** bcryptjs: For hashing user passwords before storing them in the database.
** nodemailer: Used to send verification emails and OTP codes.
** joi: For validating user input and ensuring data integrity.
** jest: JavaScript testing framework for writing unit tests.
** supertest: HTTP assertions and integration testing for Node.js.


# 6. Running Tests

npm test
