import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { Server } from 'socket.io';
import http from 'http';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import { initializeSongs } from './config/initializeSongs.js';
import authRoutes from './routes/auth.js';
import rehearsalRoutes from './routes/rehearsal.js';

dotenv.config();
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.use('/api/auth', authRoutes);
app.use('/api/rehearsal', rehearsalRoutes);

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] },
});
app.set('io', io);

io.on('connection', (socket) => {
  socket.on('disconnect', (reason) => {
    console.log(`User disconnected: ${socket.id}. Reason: ${reason}`);
  });

  socket.on('error', (error) => {
    console.error(`Socket error on ${socket.id}:`, error);
  });
});

connectDB()
  .then(() => {
    initializeSongs(); 
    server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((error) => {
    console.error('Failed to connect to the database:', error);
    process.exit(1); 
  });
