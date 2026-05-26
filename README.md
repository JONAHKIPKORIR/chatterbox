# ChatterBox – Real‑Time Chat Application

A full‑stack real‑time chat app built with **Node.js**, **Express**, **Socket.io**, **MongoDB**, and **React** (Vite + Tailwind CSS). Supports one‑on‑one direct messages, group chats, typing indicators, online status, read receipts, and file uploads via Cloudinary.

##  Features

| Feature | Status |
|---------|--------|
| User authentication (JWT)
| Real‑time messaging (WebSockets)
| Direct messages (1‑on‑1) 
| Group chat rooms 
| Typing indicator
| Online / offline status
| Read receipts
| File uploads (images, docs) 
| Emoji picker 
| Responsive design (mobile‑first) 

## Tech Stack

### Backend
- **Node.js** + **Express** – REST API
- **Socket.io** – real‑time WebSocket communication
- **MongoDB** + **Mongoose** – data persistence
- **JWT** – authentication
- **bcryptjs** – password hashing (in controller, not model)
- **Multer** + **Cloudinary** – file uploads
- **CORS**, **dotenv**

### Frontend
- **React** (Vite) – UI framework
- **Tailwind CSS v4** – styling
- **Socket.io‑client** – real‑time events
- **Axios** – HTTP requests
- **Framer Motion** – animations
- **Emoji Picker React** – emoji support
- **React Router** – navigation


## Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account (or local MongoDB)
- Cloudinary account (for file uploads – optional)

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env   # add your MongoDB URI, JWT secret, etc.
npm run dev            # starts on http://localhost:5000


### Frontend Setup
cd frontend
npm install
cp .env.example .env   # set VITE_API_URL=http://localhost:5000/api
npm run dev            # starts on http://localhost:5173
Environment Variables


### Backend (.env)
env
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/dbname
JWT_SECRET=your_super_secret_key
CLIENT_URL=http://localhost:5173
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret


### Frontend (.env)
env
VITE_API_URL=http://localhost:5000/api


### Authentication Flow
User registers → password hashed in controller.

On login, password compared using bcrypt.compare.

JWT returned and stored in localStorage.

JWT sent in Authorization header for protected routes.

Socket.io connection authenticates using the same JWT (handshake auth).

### Socket.io Events
Event (client → server)	Description
send_message	Send a new message (text or file URL)
typing	User is typing (includes roomId and isTyping flag)
mark_read	Mark a message as read by the current user

Event (server → client)	Description
new_message	New message delivered to room
user_typing	Someone is typing in the room
message_read	Receipt that a message has been read
user_status	Online / offline status change

### Testing Locally
Register two users (e.g., alice@example.com, bob@example.com).

Open two browser windows (or incognito) and log in as each.

Start a direct conversation by clicking on a user in the sidebar.

Send messages – they should appear in real‑time.

Upload a file – should appear as a clickable link or preview.

### Deployment
Backend (Render)
Create a new Web Service, connect your GitHub repo.

Set root directory to backend.

Build command: npm install

Start command: npm start

Add all environment variables in Render dashboard.

Frontend (Vercel / Netlify)
Connect your GitHub repo.

Set root directory to frontend.

Build command: npm run build

Publish directory: dist

Add VITE_API_URL pointing to your deployed backend URL.

Add _redirects file for SPA routing: /* /index.html 200

### Key Concepts Learned
WebSockets vs HTTP – persistent, bidirectional connection.

Socket.io rooms – isolate conversations.

JWT authentication for WebSockets – handshake auth.

Optimistic UI – show message instantly, confirm later.

File uploads – multer + Cloudinary.

Typing indicators & read receipts – real‑time UX polish.

Password hashing in controller – avoid Mongoose pre‑save issues.