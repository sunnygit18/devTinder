const express = require("express");


const app = express();

app.use((req, res) => {
    res.send("HELLO FROM THE SERVER");
});


app.listen(7777, () => {
    console.log("Server is successfully running on port 7777");
});
