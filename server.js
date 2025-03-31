//importing all required external modules after installation

const express=require('express')
const mongoose=require('mongoose')
require('dotenv').config()
const User=require('./models/User')
const bcrypt = require('bcryptjs')
//middleware
const PORT=3000
const app=express()
app.use(express.json())

//connecting Mongodb Atlas
mongoose.connect(process.env.MONGO_URL).then(
    ()=>console.log("DB connected successfully...")
).catch(
    (err)=>console.log("err")
)
//API landing page https://localhost:3000/regiter
app.get('/',async(req,res)=>{
    try{
        res.send("<h1 align=center>MAVI</h1>")
    }
    catch(err){
        console.log(err)
    }

})
//API registration page

app.post("/register",async(req,res)=>{
    const{user,email,password}=req.body
    try{ 
        const hashPassword=await bcrypt.hash(password,10)
        const newUser=new User({user,email,password:hashPassword})
        await newUser.save()
        console.log("New user is registered successfully")
        res.json({message:'Registration successfull'})
    }
    catch(err){
        console.log(err)
    }

})
//API login page
app.post("/login",async(req,res)=>{
    const{email,password}=req.body
    try{
        const user=await User.findOne({email});
        if(!user || !(await bcrypt.compare(password,user.password))){
            return res.status(400).json({message:'Invalid credentials'})
        }
        res.json({message: "Login Successful",username: user.username})
    }
    catch(err){
        console.log(err)
    }
})

//server running and testing
app.listen(PORT,(err)=>{
    if(err){
     console.log(err)
    } 
    console.log("server is running on port | Vikas :"+PORT)
})

