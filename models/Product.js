// import mongoose from 'mongoose';
const mongoose = require('mongoose')
const { Schema } = mongoose;



const ProductSchema = new Schema({
    user:{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Userseller'
    },
    title : {
        type : String,
        required : true,
        
        },
    description : {
        type : String,
        required : true
        },
    image: {
        type: String,
        required: true,
    },
    price : {
        type : Number,
        required : true
    },
    quantity : {
        type : Number,
        required : true
    },
    date : {
        type : Date,
        default : Date.now
        },
    category : {
        type : String,
        required : true
    },
    tags:{
        type : String,
        default : "item"
    }
  
});

module.exports=mongoose.model('Product',ProductSchema)