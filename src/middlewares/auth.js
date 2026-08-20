const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res,next) => {
try{
    // Read the cookie from the token
    const {token } = req.cookies;

// to see token ia actually present or not
    if(!token) {
        throw new Error("Token is not valid");
    }
    //validate the token
    const decodeObj = await jwt.verify(token,"DEV@Tinder$798");// this decodeObj will given id 


    const { _id} = decodeObj;// extracting the id

    const user = await User.findOne({_id}); // Finding the user in the database
    if(!user) {
        throw new Error("User not found");

    }
    
    req.user = user;//whatever user i found on database, i will attach to request, hence user will be already prsent in the requesthandler
    next(); // moving to request handler and executing inside code

}  catch(err){
        res.status(400).send("ERROR: "+ err.message);
    }

};

module.exports = {
    userAuth,
};