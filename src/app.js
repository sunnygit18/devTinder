const express = require("express");


const app = express();


//app.use("/routr", [rH1,rH2,rH3],rh4,rH5); you can wrap route handlers in array for neat code but it doesnt have any effect on it

app.use("/user",(req , res, next)=> {
    console.log("handling the routr user1");
   // res.send("1st response");//user 3 response will be sent,them next wont proceed to next route route handler
    next();// if next is put above then it will move to next route handler i.e send response of user3 and comeback and wont execute the user 1 becuase resonse is already sent
    // res.send("1st response");
},
(req,res, next) =>{
    console.log("Hnadling the user 3");
   // res.send("3rd response");
next();
},
(req,res, next) =>{
    console.log("Hnadling the user 4");
    //res.send("4th response");
next();
},
(req,res, next) =>{
    console.log("Hnadling the user 5");
    res.send("5th response");
//next(); // corner case it will show cant GET because no available route handler next
}
);

app.listen(7778, () => {
    console.log("Server is successfully running on port 7778");
});
