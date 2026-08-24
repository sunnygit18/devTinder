const express = require("express");
const userRouter = express.Router();

const {userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");

const USER_SAFE_DATA = "firstName lastname age gender about skills";

//Get all the pending connection request for the loggedIn user
userRouter.get("/user/request/received",userAuth,async(req,res)=>{
    try{
        const loggedInUser = req.user;
        const connectionRequest = await ConnectionRequest.find({
        toUserId: loggedInUser._id,
        status: "interested"// we want pending request
        }).populate("fromUserId","firstName lastname age gender about skills");
res.json({
    message: "DATA FETCHED SUCCEFULLY",
    data: connectionRequest,
});


    }catch(err){
        res.status(400).send("ERROR" + err.message);
    }
});
// to fetch data of all connected people or connections like linkedin
userRouter.get("/user/connections", userAuth, async(req,res)=> {
    try{
        const loggedInUser = req.user;

        const connectionRequest = await ConnectionRequest.find({
            $or: [
                { toUserId: loggedInUser._id, status:"accepted"},
                {
                    fromUserId: loggedInUser._id, status: "accepted"
                },
            ],
        })
        .populate("fromUserId",USER_SAFE_DATA)
        .populate("toUserId",USER_SAFE_DATA);
        
        console.log(connectionRequest);

        const data = connectionRequest.map((row)=>{
            if(row.fromUserId._id.toString()===loggedInUser.id.toString()){
                return row.toUserId;
            }
            return row.fromUserId;
        });
        res.json({data});


    } catch(err){ res.status(400).send({
        message:err.message
    });

    }
});

module.exports = userRouter;

