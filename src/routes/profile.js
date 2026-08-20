const express = require("express");

const profileRouter = express.Router();

const { userAuth }  = require("../middlewares/auth");

profileRouter.get("/profile", userAuth ,async(req, res) => {

   try{ 
    const user = req.user;// this is cominhg from  req.user auth middlware where it found the user from the database  
   
    res.send(user);} catch(err){
        res.status(400).send("UPDATE FAIULED"+ err.message);
    }
});




module.exports = profileRouter;