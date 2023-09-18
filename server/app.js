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

app.use('/', userRouter);
async function startApp() {
    try {  
      db.connect()
      app.listen(port, () => {
        console.log(`Server is up and running at ${port}`);
      });  
  
    } catch (error) {
      console.error('Error connecting to MongoDB:', error.message);
      process.exit(1);
    }
  }
  
  startApp()












module.exports = app;