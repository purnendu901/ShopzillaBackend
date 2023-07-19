const mongoose = require("mongoose")
const { Schema } = mongoose;

const SellerSchema = new Schema({
    name : {
        type : String,
        required : true
        },
    email : {
        type : String,
        unique : true,
        required : true
        },
    password : {
        type : String,
        required : true
        },
    gender : {
        type : String,
        required : true
        
        },
    age : {
        type : Number,
        required : true
        },
    usertype :{
        type : String,
        default : "seller"
    },
    address :{
        type : String,
        required : true
    },
    image :{
        type : String,
        
    },

    
    
  
});


module.exports = mongoose.model('Userseller',SellerSchema)