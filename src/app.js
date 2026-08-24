const express = require("express");

const connectDB = require("./config/database2");
const app = express();
const cookieParser = require("cookie-parser");


app.use(express.json());//this middleware parse json data to server
app.use(cookieParser());// used to read cookie

const authRouter = require("./routes/auth"); // here we are importing these router in app.js
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);
app.use("/",userRouter);




connectDB().then(() => {
    console.log("Database connected successfully ");
    
app.listen(7778, () => {
    console.log("Server is successfully running on port 7778");
});

}).catch((err) => {
    console.error(err);
});



