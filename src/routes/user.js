const express = require("express");
const userRouter = express.Router();

const {userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const USER_SAFE_DATA = "firstName lastname age gender about skills photoUrl";

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
            if(row.fromUserId._id.toString()===loggedInUser._id.toString()){
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

userRouter.get("/feed",userAuth,async(req,res)=>{
try{
// User should see all the user cards except
//1.his own cards 2.his connections(already accepted) 3.ignored people 4.already sent the connection request
// now go to connection requsest and find whosent the request/ who got the request and select only these two fields

const loggedInUser = req.user;

const page = parseInt(req.query.page) || 1;
let limit = parseInt(req.query.limit) || 10;
limit = limit > 50? 50 : limit;

const skip = (page - 1) * limit;
const connectionRequest = await ConnectionRequest.find({
    $or: [{fromUserId:loggedInUser._id},{ toUserId: loggedInUser._id}],
}).select("fromUserId toUserId");

const hideUserFromFeed = new Set();// data structure is created to hold user needed to hide
connectionRequest.forEach((req)=>{//  iterate connectionrequest(above created)..take fromid and to user & add to set as string cz its objId
    hideUserFromFeed.add(req.fromUserId.toString());
    hideUserFromFeed.add(req.toUserId.toString());
});
console.log(hideUserFromFeed);

const users = await User.find({
    $and: [
        {_id:{ $nin: Array.from(hideUserFromFeed)}},
        {_id: {$ne: loggedInUser._id}},
    ],// give all user who are not present in thid hideuserfromfeed also ne(not equal to) my ID// here nin requires array
}).select(USER_SAFE_DATA)
.skip(skip)
.limit(limit);

res.send(users);

}catch(err){
    res.status(400).json({message: err.message});
}
});

module.exports = userRouter;

