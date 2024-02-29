const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { emit } = require("nodemon");
const dotenv = require("dotenv").config();

const app = express()
app.use(cors())
app.use(express.json({limit : "10mb"}))
const PORT = process.env.PORT || 5004

//MongoDB connection
console.log(process.env.MONGODB_URL)
mongoose.set('strictQuery',false);
mongoose.connect(process.env.MONGODB_URL)
.then(()=>console.log("Connect to DB itek...."))
.catch((err)=>console.log(err))

//schema
const userSchema = mongoose.Schema ({
    firstName: String,
    lastName: String,
    email: {
        type : String,
        unique : true,
    },
    password: String,
    confirmPassword: String,
    phone : String,
    image : String,
})

//
const userModel = mongoose.model("user", userSchema)


console.log(userModel)

//api
app.get("/",(req,res)=>{
    res.send("Server is running...")
})

//sign up
app.post("/signup", async (req, res) => {

const { email } = req.body


const existingUser = await userModel.findOne({ email  : email})
if (existingUser) {
  return res.send({ message: "Email is already registered", alert : false })
}
else{
const data = userModel(req.body)
const save = await data.save()
res.send({ message: "Successfully registred",alert : true })
}
}
);


//api login 
app.post("/login", async (req, res) => {
  console.log(req.body)
  const {email} = req.body
  const {password} = req.body
  
 const existingUser = await userModel.findOne({ email : email, password : password})  

 console.log(existingUser)
  if (existingUser) { 
    const dataSend = {
      
      _id: existingUser._id,
      firstName: existingUser.firstName,
      lastName: existingUser.lastName,
      email: existingUser.email,
      phone: existingUser.phone,
      image: existingUser.image,
    };
    
    res.send({ 
      message: "Login Is Successfuly " ,
     alert : true,
      data : dataSend, })
      console.log(dataSend)
    }
    else{
      res.send({ message: "Email Or/End Password Not correct " , alert : false }); 
    }
    
});

//product  section 

const schemaProduct = mongoose.Schema({
  name: String,
  category: String,
  image: String,
  price: String,
  description: String,
});
const productModel = mongoose.model("products",schemaProduct)


//save product in data 
//api
app.post("/uploadProduct",async(req,res)=>{
   console.log(req.body)
  const data = await productModel(req.body)
  const datasave = await data.save()
  res.send({message : "Upload Successfully"})
})

//
app.get("/product",async(req,res)=>{
  const data = await productModel.find({})
  res.send(JSON.stringify(data))
})




// server is running 
app.listen(PORT,()=>console.log(`server is running on port ${PORT}`))
