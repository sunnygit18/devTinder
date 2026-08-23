const mongoose = require('mongoose');
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    firstName:  {
        type: String,
        required:true, //required is used to make the this field mandatory
        minLength:4,
        maxLength:50,
    },
    lastname:  {
        type: String,
    },
    emailId:  {
        type: String,
        required:true,
        unique:true,// this keeps check about not putting same emailid login
        lowercase:true,
        trim:true,
        validate(value){
            if (!validator.isEmail(value)){
                throw new Error("Invalid email address" + value);
            }
        }

    },
    password:  {
        type: String,
        validate(value){
            if (!validator.isStrongPassword(value)){
                throw new Error("Enter a strong password" + value);
            }
        }
        
    },
    age:   {
        type: Number,
        min:18,//for string its minLength and for number its just min
    },
    gender:  {
        type: String,
        validate(value){// it will only run if you craete new object then this validator function will run ,
            //for updating you have to mention runValidator =true; in patch api
            if(!["male","female","others"].includes(value)){
                throw new Error("Gender data is not valid");
            }
        },
    },
    photoUrl:{
        type:String,
        default:"https://static.everypixel.com/ep-pixabay/0329/8099/0858/84037/3298099085884037069-head.png",
        validate(value){
            if (!validator.isURL(value)){
                throw new Error("Invalid Photo url" + value);
            }
        }

    },
    about:{
        type:String,
        default:"This is a deafault about the user",//this is deafult presented in database if about not mentionedby user
    },
    skills:{
        type:[String],
    },
},{
    timestamps:true,
});

userSchema.index({ firstName:1 ,lastname: 1});// compound indexing

// reusable jwt token creation component
userSchema.methods.getJWT = async function () {
    const user = this; //this means the user logged in

    const token = await jwt.sign({ _id: user._id},"DEV@Tinder$798",{
        expiresIn: "7d",
      });
      return token;

};

userSchema.methods.validatePassword = async function (passwordInputByUser){
    const user = this;
    const passwordHash = user.password;
    const isPasswordValid = await bcrypt.compare(passwordInputByUser,passwordHash);

    return isPasswordValid;
    
}


module.exports = mongoose.model("User",userSchema);
