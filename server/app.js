var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const cors=require('cors')
const mongoose=require('mongoose');
const jwt = require('jsonwebtoken')
const db =require('./config/db')
require('dotenv').config();

const port = process.env.PORT || 4000;

var app = express();


app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'images')));

const userRouter = require('./routes/users');
const teacherRouter = require('./routes/teacherRoutes')
const websocket = require('./websoket');
const courseRoutes = require('./routes/courseRoutes');


app.use('/', userRouter);
app.use('/teachers', teacherRouter);
app.use('/courses',courseRoutes)
app.use(express.static('public'))
async function startApp() {
    try {  
      db.connect()
     const server= app.listen(port, () => {
        console.log(`Server is up and running at ${port}`);
      });  
      websocket(server);
    } catch (error) {
      console.error('Error connecting to MongoDB:', error.message);
      process.exit(1);
    }
  }
  
  startApp()

module.exports = app;