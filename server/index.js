import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import connectDB from './config/db.js';
import dns from 'dns';

// Force Node.js to use Google's Public DNS to bypass local ISP blocking of MongoDB Atlas SRV records
dns.setServers(['8.8.8.8', '8.8.4.4']);


// Routes
import authRoutes from './routes/auth.js';
import otpRoutes from './routes/otp.js';
import venueRoutes from './routes/venues.js';
import bookingRoutes from './routes/bookings.js';
// import paymentRoutes from './routes/payments.js';
import userRoutes from './routes/users.js';

dotenv.config();
connectDB();

const app = express();
const httpServer = createServer(app);

// Socket.io setup
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/otp', otpRoutes);
app.use('/api/venues', venueRoutes);
app.use('/api/bookings', bookingRoutes);
// app.use('/api/payments', paymentRoutes);
app.use('/api/users', userRoutes);

// Socket.io connection
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('join_room', (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);
  });

  socket.on('send_message', (data) => {
    io.to(data.roomId).emit('receive_message', data);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));
