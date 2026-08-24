const express = require("express");


const requestRouter = express.Router();

const { userAuth }  = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

requestRouter.post("/request/send/:status/:toUserId",userAuth,async (req,res) => {
   
    try{
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        // to check only interest and ignored route is done 
        const allowedStatus = [ "interested","ignored"];
        if (!allowedStatus.includes(status)){
            return res.status(400).json({message: "Invalid status type: " + status});
        }



        // to check utoUserId exist in our database or not
        const toUser = await User.findById(toUserId);
        if (!toUser){
            return res.status(484).json({
                message : "User not Found"
            });
        }

        // IF THERE IS AN EXIXSTING ConnectionRequested
        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or: [
                { fromUserId, toUserId},
                { fromUserId: toUserId, toUserId: fromUserId},
            ],
        });

        if(existingConnectionRequest){
            return res.status(400).send({messsage: "Connection Request Already exists"});
        }

        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        });

        const data = await connectionRequest.save();

        res.json({
            message:req.user.firstName + " is " + status + " in " + toUser.firstName,
            data,
        });


    }catch(err){
        res.status(400).send("Error"+ err.message);
    }
    res.send(user.firstName + "sent the connection Request");
});

requestRouter.post("/request/review/:status/:requestId",userAuth,async (req,res)=>{
    try{
        const loggedInUser = req.user;// here  the req.user is toUserId because toUserId has to login to accept/reject the requestid
     const {status, requestId } = req.params;

     const allowedStatus = ["accepted","rejected"]; // no gibberish status 
     if (!allowedStatus.includes(status)){
        return res.status(400).json({ message : "Status Not Allowed"});
     }

     // these things must be present in database
     const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested"
     });
     if(!connectionRequest) {
        return res.status(404).json({ message: "Connection request not found"});
     }


     connectionRequest.status =status;
     const data = await connectionRequest.save();

     res.json({ message: "Connection request " + status, data});

    }catch(err){
        res.status(400).send("ERROR: " + err.message);
    }
});
module.exports = requestRouter;