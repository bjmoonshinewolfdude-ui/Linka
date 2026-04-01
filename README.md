# Linker - Real-time Chat Application

A full-stack MERN chat application with real-time messaging, user authentication, and group chat functionality.

## Features

- Real-time messaging with Socket.io
- User authentication and authorization
- One-on-one and group chats
- Search and add users
- Responsive design with Chakra UI
- Typing indicators
- Online status

## Tech Stack

### Frontend
- React 19
- Chakra UI 2.5
- Socket.io Client
- React Router DOM
- Axios

### Backend
- Node.js
- Express.js
- Socket.io
- MongoDB with Mongoose
- JWT Authentication
- bcryptjs

## Deployment
This application is deployed on Railway with serverless backend functions.

## Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd linker-hard-r
   ```

2. **Install all dependencies**
   ```bash
   npm run install-all
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your MongoDB URI and JWT secret
   ```

4. **Start the development servers**
   ```bash
   npm run dev
   ```

This will start both the backend server (port 5000) and frontend development server (port 3000) simultaneously.

## Available Scripts

### Root Level Scripts
- `npm run dev` - Start both backend and frontend in development mode
- `npm run server` - Start only the backend server
- `npm run client` - Start only the frontend development server
- `npm run build` - Build the frontend for production
- `npm run install-all` - Install dependencies for both root and frontend
- `npm run install-client` - Install only frontend dependencies

### Frontend Scripts (in /frontend)
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests

### Backend Scripts
- `npm start` - Start server with nodemon

## Environment Variables

Create a `.env` file in the root directory:

```env
PORT = 5000
MONGO_URI = your_mongodb_connection_string
JWT_SECRET = your_jwt_secret_key
NODE_ENV = development
```

## Project Structure

```
linker-hard-r/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── Context/
│   │   ├── Pages/
│   │   └── Config/
│   └── package.json
├── .env
├── .gitignore
└── package.json
```

## API Endpoints

### Authentication
- `POST /api/user/login` - User login
- `POST /api/user/register` - User registration

### Chat
- `GET /api/chat` - Get all chats for user
- `POST /api/chat` - Create or access a chat
- `POST /api/chat/group` - Create group chat

### Messages
- `GET /api/message/:chatId` - Get all messages for a chat
- `POST /api/message` - Send a message

### Users
- `GET /api/user?search=query` - Search users

## Socket.io Events

### Client Events
- `setup` - Initial connection setup
- `join chat` - Join a chat room
- `new message` - Send a new message
- `typing` - Start typing indicator
- `stop typing` - Stop typing indicator

### Server Events
- `connected` - Connection established
- `message recieved` - New message received
- `typing` - User is typing
- `stop typing` - User stopped typing

## Deployment

### Production Build
```bash
npm run build
```

### Environment Setup for Production
- Set `NODE_ENV=production` in your environment variables
- Ensure MongoDB is accessible from your deployment environment
- Configure CORS for your production domain

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Verify your MongoDB URI is correct
   - Check network connectivity
   - Ensure MongoDB service is running

2. **CORS Issues**
   - Ensure frontend proxy is set to `http://127.0.0.1:5000`
   - Check backend CORS configuration

3. **Socket.io Connection Issues**
   - Verify both frontend and backend are running
   - Check firewall settings
   - Ensure ports are not blocked

4. **Build Errors**
   - Clear node_modules and reinstall: `npm run install-all`
   - Check for missing dependencies

## License

ISC License
