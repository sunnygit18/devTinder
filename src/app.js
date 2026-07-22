const express = require("express");


const app = express();

app.use("/user",(req,res)=>{
    res.send("HAAHHAHHHAHHAHAHAAA");
});

app.get("/user",(req,res)=>{
    res.send({firstName:"sunny",lastNAMe:"singh"});
});

app.post("/user",(req,res)=>{
    res.send("Data successfully added to Database");
});

app.delete("/user",(req,res)=>{
    res.send("Data deleted successfully");
});


app.get("/",(req,res)=> {

    console.log("GET / was called");
    res.send("Hello hello");
});

app.get("/test",(req,res ) => {
    console.log("GET /test was called");
    res.send("hello from the server ");
});

app.listen(7778, () => {
    console.log("Server is successfully running on port 7778");
});
