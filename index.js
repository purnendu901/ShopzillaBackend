const connect = require('./db');
const express = require('express')
// const fileUpload = require('express-fileupload')
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 5000

connect();

const app = express()
const cors = require('cors');

//if we want to use req.body then

app.use(cors())
app.use(bodyParser.json({ limit: '20mb' }));
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(fileUpload())
// app.use(fileUpload({useTempFiles:true}))



//ROUTES

app.use('/',require('./routes/auth'))
app.use('/',require('./routes/product'))






app.listen(PORT,()=>{console.log(`app listening at http://localhost:5000`)})