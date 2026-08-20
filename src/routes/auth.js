const express = require("express");
const authRouter = express.Router();

const {validateSignupdata} = require("../utils/validation");
const User = require("../models/user");
const bcrypt = require("bcrypt");



authRouter.post("/signup", async(req,res)=>{
    console.log("ROUTE HIT");
    console.log(req.body);
try{
    // In order to secure the password first thing we need to do validate the data and then encrypt the password
    // Validation od Data
    validateSignupdata(req);
    const {firstName,lastname,emailId,password} =req.body;

    //Encrypt the password
    const passwordHash = await bcrypt.hash(password,10);
    console.log(passwordHash);

 //undefined will be the output bcz our server is not able to read json format data,so we need middleware to convert json into js object
    
 //Creating a new instance of the User model
    const user = new User({
        firstName,
        lastname,
        emailId,
        password:passwordHash,
    });
    await user.save();
        res.send("User Added succesfully");}
        catch(err){
            res.status(400).json({
                error:err.message
            });
        }
});

authRouter.post("/login",async(req,res) =>{
try{ 
    const{ emailId, password}= req.body;  // first we get emailId and password from req.body

    const user = await User.findOne({ emailId: emailId});  ////then we will check whether this emailId is present in db

    // if user is not in db ,throw an error
    if(!user){
        throw new Error("Invalid credentials");// dont throw email not present ,just invalid
    }

// if pressent then it checks valid password using comparinng in db , here passoword is taken from user and user.password is hashed password in db
    const isPasswordValid = await user.validatePassword(password); // here password is validated by helper function validatePasswordValid in user.js 

    if(isPasswordValid){
      //Create a JWT Token

      const token = await user.getJWT(); // using helperb function in user.js ( jwt token is being created here)

      //Add thr token to cookie and send the response back to user
      res.cookie("token", token);

        res.send("LOgin Successfull");
    }
    else{
        throw new Error("Invalid credetials");//dont throw password incorrect, just invalid (no one sd know its right or wrong)
    }


}catch(err){
        res.status(400).send("UPDATE FAIULED"+ err.message);
    }
});


module.exports = authRouter;