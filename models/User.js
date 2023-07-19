
const mongoose = require("mongoose")
const { Schema } = mongoose;

const UserSchema = new Schema({
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      unique: true,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    gender: {
      type: String,
      required: true,
      default: "Alien"
    },
    age: {
      type: Number,
      required: true,
    },
    usertype: {
      type: String,
      default: "buyer"
    },
    cartItems: [{
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
      },
      quantity: {
        type: Number,
        default: 1
      }
    }]
  });



module.exports = mongoose.model('user',UserSchema)