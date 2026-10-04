
const validator = require("validator");
//HELPER FUNCTION

const validateSignupdata = (req) =>{
    const {firstName,lastname,emailId,password} = req.body;

    if(!firstName || !lastname){
        throw new Error("Name is not valid");
    }
    else if(!validator.isEmail(emailId)){
        throw new Error("Email is not valid");
    }
    else if(!validator.isStrongPassword(password)){
        throw new Error("Please eneter a strong password");
    }


};

const validateEditProfileData = (req) => {
    const allowedEditFields = ["firstName","lastname","emailId","gender","age","about","skills","photoUrl"

    ];
    const isEditAllowed = Object.keys(req.body).every((field)=>
    allowedEditFields.includes(field));// it will return a boolean value , just pure javascript

    return isEditAllowed;
}
module.exports= {validateSignupdata,validateEditProfileData};