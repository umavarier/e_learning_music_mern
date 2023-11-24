const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const db = require('./config/db');
const socketIo = require('socket.io');

// const { Server } = require("socket.io");


require('dotenv').config();

const port = process.env.PORT || 4000;

const app = express();


app.use(cors({
  origin: 'https://melodymusic.vercel.app',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials:true
}));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'images')));

const userRouter = require('./routes/users');
const teacherRouter = require('./routes/teacherRoutes');
const courseRoutes = require('./routes/courseRoutes');
const messageRoutes = require('./routes/messageRoute')

// app.use(cors());
app.use(express.static('public'));
app.use('/', userRouter);
app.use('/teachers', teacherRouter);
app.use('/courses', courseRoutes);
app.use('/messages',messageRoutes)

// Connect to MongoDB
async function startApp() {
  try {
    await db.connect();
    const server = app.listen(port, () => {
      console.log(`Server is up and running at ${port}`);
    });

    // Set up socket.io
    const io = socketIo(server, {
      cors: {
        origin: 'https://melodymusic.vercel.app', 
        // origin: 'http://localhost:3000', 
                methods: ['GET', 'POST'],
      },
    });
    require('./socket')(io);
   
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
}

startApp();
