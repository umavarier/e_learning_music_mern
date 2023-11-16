const mongoose = require('mongoose');
mongoose.set('strictQuery', true);
function connect() {
  mongoose.connect(process.env.DB_URL,{
    useNewUrlParser: true,
  useUnifiedTopology: true,
  })
  mongoose.connection.once('open',()=>{
    console.log('connection established successfully');
  })
}

module.exports ={
  connect
};