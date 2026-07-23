const express = require("express");


const app = express();


// ANOTHER WAY TO PRESENT ROUTE HANDLERS 
app.get("/user",(req,res,next)=>{
    console.log("Handling the route user");
   // res.send("REsponse1");
    next();
});
app.get("/user",(req,res,next)=>{
    console.log("Handling the route user2");
    res.send("REsponse 2");
   // next(); // it will end up in infinite loop till timeout
});

app.listen(7778, () => {
    console.log("Server is successfully running on port 7778");
});
