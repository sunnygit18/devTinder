const express = require("express");
const bcrypt = require("bcrypt");
const profileRouter = express.Router();

const { userAuth }  = require("../middlewares/auth");
const {validateEditProfileData} = require("../utils/validation");

profileRouter.get("/profile/view", userAuth ,async(req, res) => {

   try{ 
    const user = req.user;// this is cominhg from  req.user auth middlware where it found the user from the database  
   
    res.send(user);} catch(err){
        res.status(400).send("UPDATE FAIULED"+ err.message);
    }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res)=>{
     console.log("PROFILE EDIT ROUTE HIT");
    try{
        if(!validateEditProfileData(req)){
            throw new Error("Invalid Edit Request");
        }
        const loggedInUser = req.user;// it comes from auth middleware 
         
        
        Object.keys(req.body).forEach((key)=> (loggedInUser[key] = req.body[key]));
 
         await loggedInUser.save();

 res.send("Profile update is  SUCCESSFUL BROSKIE");

    }catch(err){
        console.log("PROFILE EDIT ERROR:", err);
    res.status(400).send("ERROR : " + err.message);
    }

});

profileRouter.patch("/profile/password",userAuth, async(req,res)=>{
try{
    const { oldPassword, newPassword } = req.body;

    const user = req.user;

    const isPasswordCorrect =  await bcrypt.compare(oldPassword,user.password);

    if(!isPasswordCorrect){
        throw new Error("INVALID CREDENTIALS");
    }
     const hashedPassword = await bcrypt.hash(newPassword, 10);

        // 4. Update password
        user.password = hashedPassword;

        // 5. Save user
        await user.save();

        res.send("Password updated successfully");





}catch(err){
    res.status(400).send("ERROR : " + err.message);
}
});


module.exports = profileRouter;