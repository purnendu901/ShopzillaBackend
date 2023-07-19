const express = require('express');
const router = express.Router();
const Product = require('../models/Product')
const fetchuser = require('../middleware/fetchuser')
const { body, validationResult } = require('express-validator');
const cloudinary = require('cloudinary').v2;
const User = require('../models/User')



// Configuration 
cloudinary.config({
    cloud_name: "dfstphpp1",
    api_key: "198111167712288",
    api_secret: "FcGoXNVK8c51bDMaqgRkWcTL1Fc"
  });









//----------------------------------------------------------------------------
//To fetch all the products of the seller ---> Login required
router.get('/fetchallproduct',fetchuser, async (req,res)=>{
try {
    
    
        const notes = await Product.find({user : req.user.id})
        res.send(notes)
    
    } catch (error) {
        res.status(500).send("an internal error occured")
        
    }
})



//----------------------------------------------------------------------------
//To add product using post request ---> Login required
router.post('/addproduct',fetchuser,[body('title').isLength({ min: 5 }), body('description').isLength({min:3})],

    async (req,res)=>{

   
    const {title,description,date,price,image,quantity,category,tags}=req.body
    // const image = req.files.image;
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error : errors.array() });
    }

    
    
    try {

        const item = await Product.findOne({title})
        if(item)
        {
          return res.status(401).json({"error":"item already exist"})
        }
        
        const base64image = await cloudinary.uploader.upload(image, { folder: 'Products' });
        
        const prod = await Product.create({title,description,date,tags,user:req.user.id,price,quantity,category,image:base64image.secure_url})
    
        const savedproduct =await prod.save() 
    
        res.send(savedproduct)

    } catch (error) {
        res.status(500).send("an internal error occured")
    }

  })
    





  //--------------------------------------------------------------------------------------
  //TO FETCH DETAILS OF A PRODUCT
  router.get('/productdetails/:id', async (req, res) => {
    try {
      const productId = req.params.id;
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      res.json(product);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server Error' });
    }
  });







    //----------------------------------------------------------------------------
    //To update a note using put request ---> Login required
    router.put('/updateproduct/:id',fetchuser,

    async (req,res)=>{

    // const {title,description}=req.body
    // const newNote = {}
    // if(title){newNote.title=title}
    // if(description){newNote.description=description}

    let note = await Product.findById(req.params.id)
    if(!note){return res.status(450).send("Note not Found")}
    
    if(note.user.toString()!=req.user.id){return res.status(450).send("Access Denied")}

    note = await Product.findByIdAndUpdate(req.params.id,req.body,{new: true})

    //we can do in this way also
    // notes = await Notes.findByIdAndUpdate(req.params.id,{$set:newNote},{new: true})
    res.json(note)
    




    })













    //----------------------------------------------------------------------------
    //To delete a note using delete request ---> Login required
    router.delete('/deleteproduct/:id',fetchuser,

    async (req,res)=>{


    let note = await Product.findById(req.params.id)
    if(!note){return res.status(450).send("Note not Found")}
    
    if(note.user.toString()!=req.user.id){return res.status(450).send("Access Denied")}

    note = await Product.findByIdAndDelete(req.params.id)

    //we can do in this way also
    // notes = await Notes.findByIdAndUpdate(req.params.id,{$set:newNote},{new: true})
    res.json(note+" This note has been deleted been deleted ........... ")

    })



    
//----------------------------------------------------------------------------
//To fetch all the products of the database ---> 
router.get('/api/allproducts', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});








  //----------------------------------------------------------------------------
    //To add a product in buyer cart using post ---> Login required
    router.post('/addtocart/:id', fetchuser, async (req, res) => {
      try {
        const user = await User.findById(req.user.id);
        if (!user) {
          return res.status(404).json({ error: "Invalid user" });
        }
    
        const product = await Product.findById(req.params.id);
        if (!product) {
          return res.status(401).json({ error: "Invalid product" });
        }
    
        const quantity = req.body.quantity || 1;
        
    
        const cartItem = user.cartItems.find(item => String(item.product) === req.params.id);
        if (cartItem) {
          // Product with same ID already exists in cart
          return res.status(400).json({ error: `Product already exists in cart with quantity ${cartItem.quantity}` });
        } else {
          user.cartItems.push({ product: req.params.id, quantity });
          await user.save();
          res.status(200).json({ message: `Product has been added to cart: ${product}` });
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
      }
    });





    //----------------------------------------------------------------------------
//To fetch all the products of the buyer ---> Login required
router.get('/cartproducts',fetchuser, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('cartItems.product');
    const products = user.cartItems.map(item => {
      return {
        product: item.product,
        quantity: item.quantity
      }
    });

    res.status(200).json({ products });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});






//TO REMOVE PRODUCT FROM A CART
router.delete('/removefromcart/:productId', fetchuser, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const cartItem = user.cartItems.find(item => String(item.product) === req.params.productId);
    
    if (!cartItem) {
      return res.status(404).json({ error: "Product not found in cart" });
    }

    user.cartItems = user.cartItems.filter(item => String(item.product) !== req.params.productId); // remove the product from the user's cart array
    await user.save(); // save the changes to the user document

    res.status(204).send(); // send a 204 (No Content) response
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});




//----------------------------------------------------------------------------
//Search produucts 
router.get('/products/search', async (req, res) => {
  try {
    const tags = req.query.tags;
    const products = await Product.find({ tags: { $regex: tags, $options: 'i' } });
    res.json(products);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});


    module.exports = router