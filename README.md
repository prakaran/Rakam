# Rakam

> A modern, minimalistic peer-to-peer digital wallet application.

Rakam is a fintech platform built to facilitate seamless money transfers between users. It features a secure backend API and a fast, responsive frontend designed with a focus on modern UX/UI principles.

## Features

- **User Authentication**: Secure signup and login with JWT and bcrypt.
- **Dashboard**: Real-time overview of wallet balance and recent activity.
- **Money Transfers**: Peer-to-peer transactions between users.
- **Transaction History**: Detailed logs of all incoming and outgoing transfers.
- **Minimalist UI**: Clean, responsive, and intuitive interface with a fintech aesthetic.

## Tech Stack

### Frontend
- **React** (via Vite)
- **TailwindCSS** for utility-first styling
- **React Query** for server state management
- **React Router** for navigation
- **HeadlessUI & HeroIcons** for accessible components

### Backend
- **Node.js** & **Express**
- **MongoDB** with **Mongoose**
- **JWT** (JSON Web Tokens) for authentication
- **BcryptJS** for secure password hashing

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- MongoDB running locally or a MongoDB Atlas URI

### Installation

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd Rakam
   ```

2. **Setup the Backend:**
   ```bash
   cd backend
   npm install
   ```
   Create a `.env` file in the `backend` directory (e.g., based on `.env.example` if available) with your configuration:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```
   Start the server:
   ```bash
   npm start
   ```

3. **Setup the Frontend:**
   ```bash
   cd ../frontend
   npm install
   ```
   Start the frontend development server:
   ```bash
   npm run dev
   ```

## License

This project is licensed under the ISC License.
