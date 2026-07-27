const express = require("express");

const connectDB = require("./config/database2");
const app = express();
const User = require("./models/user");
const user = require("./models/user");

app.post("/signup", async (req,res)=>{
    // Creating a new instance of the User model
    const user = new User({
        firstName: "Virat",
        lastname: "kohli",
        emailId: "virat@gmail.com",
        password:"Virat1823",
    });
    await user.save();
    res.send("User Added succesfully");
});









connectDB().then(() => {
    console.log("Database connected successfully ");
    
app.listen(7778, () => {
    console.log("Server is successfully running on port 7778");
});

}).catch((err) => {
    console.error(err);
});



