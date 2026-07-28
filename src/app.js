const express = require("express");

const connectDB = require("./config/database2");
const app = express();
const User = require("./models/user");

app.use(express.json());//this middleware parse json data to server



app.post("/signup", async(req,res)=>{
    console.log("ROUTE HIT");
    console.log(req.body);



 //undefined will be the output bcz our server is not able to read json format data,so we need middleware to convert json into js object
    //Creating a new instance of the User model
    const user = new User(req.body);
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



