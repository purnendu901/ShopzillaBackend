const express = require('express');
const router = express.Router();
const User = require('../models/User')
const Userseller = require('../models/Seller')
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT_CODE = require("../JWTCODE")
const fetchuser = require('../middleware/fetchuser')
const cloudinary = require('cloudinary').v2;

// Configuration 
cloudinary.config({
    cloud_name: "dfstphpp1",
    api_key: "198111167712288",
    api_secret: "FcGoXNVK8c51bDMaqgRkWcTL1Fc"
  });




//---------------------------------------------------------------------------------------------

// Create a user using POST request ( SIGNUP )  --> No signin required
router.post('/signup',

 [ body('email').isEmail(), body('password').isLength({ min: 5 }), body('firstname').isLength({min:3}),body('age').isNumeric() ],

 async (req,res)=>{

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(404).json({ error : errors.array() });
    }


    try {

    let user = await User.findOne({email:req.body.email})
    if(user){
       return res.status(400).json({"error": "a user with the same email already exist"})
    }



    // HASHING AND USING SALT IN PASSWORD

    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds)
    hashedpassword=await bcrypt.hash(req.body.password,salt)

    //CREATE A NEW USER 
    // ------------------------------
    user = await User.create({
        name: req.body.firstname +" "+ req.body.lastname,
        email: req.body.email,
        password: hashedpassword,
        gender : req.body.gender,
        age: req.body.age
      })
      const data = {
        user:{id:user.id}
      }
      const authtoken=jwt.sign(data,JWT_CODE)
    //   res.send(user)
    res.json({signup:true,"authtoken":authtoken})
    
    } catch (error) {
        res.status(500).json({error:"Internal server error"})
    }
    
    
    })





        //------------------------------------------------------------------------------
    // authenticating a user using OTPLESS POST request ( SIGNIN )  --> No signin required

    router.post('/buyerotpless' ,[body('email').isEmail()]
    ,
    async (req,res)=>{

      const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error : errors.array() });
    }

    const {email} = req.body;

        const user = await User.findOne({email})
        if(!user)
        {
          return res.status(400).json({error:"User is not registered"})

        }

        try {
          const data = {
            user:{id:user.id}
          }
          const authtoken=jwt.sign(data,JWT_CODE)
    
          res.json({buyer:true,"authtoken":authtoken,type:"buyer"})

          
        } catch (error) {
          res.status(500).json({error:"Internal server Error"});
        }


    }
     )





    

    //------------------------------------------------------------------------------
    // authenticating a user using POST request ( SIGNIN )  --> No signin required

    router.post('/login',

 [ body('email').isEmail(), body('password','Password cannot be empty').exists() ],

 async (req,res)=>{

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error : errors.array() });
    }

    const {email,password}=req.body

    try {
      
      let user =await User.findOne({email})
      if(!user)
      {
       return res.status(400).json({error:"You have entered an invalid email or password"})
      }

      const comparePassword = await bcrypt.compare(password,user.password)
      if(!comparePassword)
      {
       return res.status(400).json({"error":"You have entered an invalid email or password"})
      }




      const data = {
        user:{id:user.id}
      }
      const authtoken=jwt.sign(data,JWT_CODE)

      res.json({buyer:true,"authtoken":authtoken,type:"buyer"})
    
      


    } catch (error) {
      res.status(500).send("Internal server error")
  }


 })






   //------------------------------------------------------------------------------
    // Get logged in user details using POST request ( SIGNUP )  --> signin required
    // Also use a middleware to decode userid from authtoken 


    router.post('/getuser', fetchuser ,
   
    async (req,res)=>{
      
   

    try {
      const UserId=req.user.id
      const user =await User.findById(UserId).select("-password")
      res.send(user)
      
    } catch (error) {
      res.status(500).send("Internal server error")
      
    }



  })








   //------------------------------------------------------------------------------
    // to delete a user using delete request  --> signin required
    // Also use a middleware to decode userid from authtoken 


    router.delete('/deleteuser', fetchuser ,
   
    async (req,res)=>{
      
   

    try {
      const UserId=req.user.id
      const user =await User.findByIdAndDelete(UserId)
      res.send(user+ " has been deleted")
      
    } catch (error) {
      res.status(500).send("Internal server error")
      
    }



  })

  






















  

//---------------------------------------------------------------------------------------------

// Create a seller using POST request ( SIGNUP )  --> No signin required
router.post('/sellersignup',

 [ body('email').isEmail(), body('password').isLength({ min: 5 }), body('firstname').isLength({min:3}),body('age').isNumeric() ],

 async (req,res)=>{

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(404).json({ error : errors.array() });
    }


    try {

    let user = await Userseller.findOne({email:req.body.email})
    if(user){
       return res.status(400).json({"error": "a user with the same email already exist"})
    }
    const {image} = req.body
    const base64image = await cloudinary.uploader.upload(image, { folder: 'Sellers' });


    // HASHING AND USING SALT IN PASSWORD

    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds)
    hashedpassword=await bcrypt.hash(req.body.password,salt)

    //CREATE A NEW USER 
    // ------------------------------
    user = await Userseller.create({
        name: req.body.firstname +" "+ req.body.lastname,
        email: req.body.email,
        password: hashedpassword,
        gender : req.body.gender,
        age: req.body.age,
        address:req.body.address,
        image:base64image.secure_url
      })
      const data = {
        user:{id:user.id}
      }
      const authtoken=jwt.sign(data,JWT_CODE)
    //   res.send(user)
    res.json({signup:true,"authtoken":authtoken})
    
    } catch (error) {
        res.status(500).json({error:"Internal server error"})
    }
    
    
    })





      
    //------------------------------------------------------------------------------
    // authenticating a seller using OTPLESS POST request ( SIGNIN )  --> No signin required

    router.post('/sellerotpless' ,[body('email').isEmail()]
    ,
    async (req,res)=>{

      const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error : errors.array() });
    }

    const {email} = req.body;

        const seller = await Userseller.findOne({email})
        if(!seller)
        {
          return res.status(400).json({error:"User is not registered"})

        }

        try {
          const data = {
            user:{id:seller.id}
          }
          const authtoken=jwt.sign(data,JWT_CODE)
    
          res.json({seller:true,"authtoken":authtoken,type:"seller"})

          
        } catch (error) {
          res.status(500).json({error:"Internal server Error"});
        }


    }
     )




    

    //------------------------------------------------------------------------------
    // authenticating a seller using POST request ( SIGNIN )  --> No signin required

    router.post('/sellerlogin',

 [ body('email').isEmail(), body('password','Password cannot be empty').exists() ],

 async (req,res)=>{

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error : errors.array() });
    }

    const {email,password}=req.body

    try {
      
      let user =await Userseller.findOne({email})
      if(!user)
      {
       return res.status(400).json({error:"You have entered an invalid email or password"})
      }

      const comparePassword = await bcrypt.compare(password,user.password)
      if(!comparePassword)
      {
       return res.status(400).json({"error":"You have entered an invalid email or password"})
      }




      const data = {
        user:{id:user.id}
      }
      const authtoken=jwt.sign(data,JWT_CODE)

      res.json({seller:true,"authtoken":authtoken,type:"seller"})
    
      


    } catch (error) {
      res.status(500).send("Internal server error")
  }


 })






   //------------------------------------------------------------------------------
    // Get logged in seller details using POST request ( SIGNUP )  --> signin required
    // Also use a middleware to decode userid from authtoken 


    router.post('/sellergetuser', fetchuser ,
   
    async (req,res)=>{
      
   

    try {
      const UserId=req.user.id
      const user =await Userseller.findById(UserId).select("-password")
      res.send(user)
     
      
    } catch (error) {
      res.status(500).send("Internal server error")
      
    }



  })








   //------------------------------------------------------------------------------
    // to delete a seller using delete request  --> signin required
    // Also use a middleware to decode userid from authtoken 


    router.delete('/sellerdeleteuser', fetchuser ,
   
    async (req,res)=>{
      
   

    try {
      const UserId=req.user.id
      const user =await Userseller.findByIdAndDelete(UserId)
      res.send(user+ " has been deleted")
      
    } catch (error) {
      res.status(500).send("Internal server error")
      
    }



  })


module.exports = router