const express = require("express");

const connectDB = require("./config/database2");
const app = express();
const User = require("./models/user");

app.use(express.json());//this middleware parse json data to server



app.post("/signup", async(req,res)=>{
try{console.log("ROUTE HIT");
    console.log(req.body);



 //undefined will be the output bcz our server is not able to read json format data,so we need middleware to convert json into js object
    //Creating a new instance of the User model
    const user = new User(req.body);
    await user.save();
        res.send("User Added succesfully");}
        catch(err){
            res.status(400).json({
                error:err.message
            });
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



