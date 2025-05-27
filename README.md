# FullStack MERN Application

## Overview

This project is a full-stack web application built using the MERN (MongoDB, Express.js, React, Node.js) stack.

It serves as a platform for users to share and discover "memories" – short posts that can include text, tags, and an accompanying image. The application emphasizes a modern, responsive user interface and robust backend functionalities.

The primary goal of this project is to provide a practical demonstration of building a complete MERN stack application, covering essential concepts such as user authentication, CRUD operations, state management with Redux, and responsive design with Material-UI.

## Features

- **Create, Read, Update, Delete (CRUD) Posts:**
  - Users can create new memory posts, including a title, message, creator's name, tags, and an image.
  - All posts are displayed on the main feed.
  - Authenticated users can edit their own posts.
  - Authenticated users can delete their own posts.
- **User Authentication & Authorization:**
  - Secure sign-up and login functionalities.
  - Users can log in using email/password or Google OAuth.
  - Protected routes ensure only authenticated users can perform certain actions (e.g., liking, editing, and deleting posts).
  - JWT-based authentication for secure session management.
- **Like Functionality:**
  - Authenticated users can like posts.
  - The like count is displayed on each post.
  - Users can see if they have already liked a post.
- **Image Upload:**
  - Seamless image upload for memory posts, supporting base64 conversion for storage.
- **Tagging System:**
  - Posts can be categorized using tags, making them searchable and discoverable.
- **Search & Filtering:**
  - Users can search for posts by title or message content.
  - Users can filter posts by tags.
- **Responsive Design:**
  - The application is designed to be fully responsive, using Material-UI to provide an optimal viewing experience across various devices (desktops, tablets, and mobile phones).
- **Pagination:**
  - Efficiently loads posts in chunks to improve performance and user experience when dealing with many memories.

## Technologies

### Frontend:

- **Vite:** For building dynamic and interactive user interface components.
- **Redux:** For centralized state management, making data flow predictable and easier to debug.
- **Redux Thunk:** Middleware for Redux, enabling asynchronous actions (e.g., API calls).
- **Material-UI (MUI):** A popular React UI framework for creating modern and responsive designs.
- **Moment.js:** For parsing, validating, manipulating, and formatting dates.

### Backend:

- **Node.js:** JavaScript runtime for building server-side applications.
- **Express.js:** A fast, unopinionated, minimalist web framework for Node.js, used for building RESTful APIs.
- **Mongoose:** An ODM (Object Data Modeling) library for MongoDB and Node.js, simplifying database interactions.
- **JSON Web Token (JWT):** For secure user authentication and authorization.
- **Bcrypt.js:** For hashing passwords securely.
- **Dotenv:** For loading environment variables from a `.env` file.

### Database:

- **MongoDB:** A NoSQL document database used for storing memory posts and user data.

## Setup Instructions

Follow these steps to get the Memories application running on your local machine.

### Prerequisites

- **Node.js & npm:** Ensure Node.js (which includes npm) is installed on your system. You can download it from [nodejs.org](https://nodejs.org/).
- **MongoDB:** You will need a running MongoDB instance. You can either:
  - Install MongoDB locally (refer to [MongoDB installation guides](https://docs.mongodb.com/manual/installation/)).
  - Use a cloud-hosted MongoDB service like MongoDB Atlas (recommended for ease of setup).

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/bostiog1/Full-Stack-MERN.git
    cd fullstack mern
    ```

2.  **Navigate into the `server` directory and install dependencies:**

    ```bash
    cd server
    npm install
    ```

3.  **Create a `.env` file in the `server` directory** and add your MongoDB connection URI and JWT secret:

    ```
    CONNECTION_URL=mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/memories_db?retryWrites=true&w=majority
    JWT_SECRET=your_super_secret_key
    ```

    _Replace `<username>`, `<password>`, and `cluster0.abcde.mongodb.net` with your MongoDB Atlas connection details or local MongoDB URI._
    _Choose a strong, random string for `JWT_SECRET`._

4.  **Navigate back to the root directory and then into the `client` directory and install dependencies:**
    ```bash
    cd ../client
    npm install
    ```

### Running the Application

1.  **Start the Backend Server:**
    From the `server` directory:

    ```bash
    npm start
    ```

    The backend server will typically run on `http://localhost:5000`.

2.  **Start the Frontend Development Server:**
    From the `client` directory:
    ```bash
    npm run dev
    ```
    The frontend application will typically open in your browser at `http://localhost:5173`.

You should now have the Memories application running locally!
