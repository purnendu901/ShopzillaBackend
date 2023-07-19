const mongoose = require("mongoose");
require('dotenv').config()
const database = process.env.DATABASEURL;
const connect = () => {

  mongoose.connect(
   
    database,{useNewUrlParser:true,useUnifiedTopology:true}
    
  );

};
  // const connect =()=>{mongoose.connect("mongodb://0.0.0.0:27017/demoprojectdatabase")}
  module.exports = connect;
