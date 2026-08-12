const express = require("express");

const connectDB = require("./config/database2");
const app = express();
const User = require("./models/user");
const {validateSignupdata} = require("./utils/validation");
const bcrypt = require("bcrypt");


app.use(express.json());//this middleware parse json data to server



app.post("/signup", async(req,res)=>{
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

app.post("/login",async(req,res) =>{
try{ // first we get emailId and password from req.body
    const{ emailId, password}= req.body;

    //then we will check whether this emailId is present in db
    const user = await User.findOne({ emailId: emailId});
    // ii user is not in db ,throw an error
    if(!user){
        throw new Error("Invalid credentials");// dont throw email not present ,just invalid
    }
// if pressent then it checks valid password using comparinng in db , here passoword is taken from user and user.password is hashed password in db
    const isPasswordValid = await bcrypt.compare(password,user.password);

    if(isPasswordValid){
        res.send("LOgin Successfull");
    }
    else{
        throw new Error("Invalid credetials");//dont throw password incorrect, just invalid (no one sd know its right or wrong)
    }


}catch(err){
        res.status(400).send("UPDATE FAIULED"+ err.message);
    }
});

//patch api UPDATE THE DATA OF THE USER
app.patch("/user/:userId",async (req,res)=>{
    const userId = req.params?.userId;
    const data = req.body;
    try{
        const ALLOWED_UPDATES = ["photoUrl","about","gender","age","skills"];
        const isUpdateAllowed = Object.keys(data).every((k)=>
        ALLOWED_UPDATES.includes(k));
        if(!isUpdateAllowed){
            throw new Error("Update not allowed");
        }


        const user = await User.findByIdAndUpdate({ _id:userId },data ,{
            returnDocument: "after",
            runValidators:true,
        });
        console.log(user);
        res.send("USER UPDATED SUCCESSFULLY");

    }
    catch(err){
        res.status(400).send("UPDATE FAIULED"+ err.message);
    }
});


// Get user by email
app.get("/user",async(req,res) => {
    const userEmail = req.body.emailId;
     
    try{
        const users = await User.find({emailId: userEmail});
        
        if(users.length === 0){
            res.status(484).send("user not found");
        } else{
              res.send(users);
        }
    }
    catch(err){
        res.status(400).send("Something went wrong");
    }
});


//get all data of the feed
app.get("/feed", async (req,res)=>{
try{ 
    const users =  await User.find({});
    res.send(users);


}catch(err){
        res.status(400).send("Something went wrong");
    }
});


connectDB().then(() => {
    console.log("Database connected successfully ");
    
app.listen(7778, () => {
    console.log("Server is successfully running on port 7778");
});

}).catch((err) => {
    console.error(err);
});



