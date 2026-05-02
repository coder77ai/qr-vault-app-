# QR Scanner App

A modern full-stack web application for storing, organizing, and retrieving your payment QR codes (from shops, mechanics, services, etc.) built with React, Node.js, Express, and **ValKey** (as the data store).

## Prerequisites

- Node.js installed (v16+)
- **ValKey** (or Redis) server running locally on standard port `6379`.

## Setup Instructions

### 1. Backend

1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server (make sure ValKey/Redis is running):
   ```bash
   node index.js
   ```
   > The backend runs on `http://localhost:5000`

### 2. Frontend

1. Open a new terminal and navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   > The frontend will run on an available port (usually `http://localhost:5173`). Open the link in your browser.

## Features & Aesthetic
- Premium dark mode aesthetic with glassmorphism and subtle gradients
- Add QR images manually with Title, Recipient, and Categories
- Search through your saved QR codes easily
- Seamless data fetching with loading states and empty view fallbacks
- View large-size QRs that can be easily scanned for payments

**Note regarding Database**: The app uses `ioredis` to seamlessly connect to your locally running ValKey data store.
