import mongoose, {Schema} from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const userSchemma = new Schema({
    username: {
        type : String,
        required : true,
        unique : true,
        lowercase : true,
        trim : true,
        index : true
    },
    email: {
        type : String,
        required : true,
        unique : true,
        lowercase : true,
        trim : true
    },
    fullName: {
        type : String,
        required : true,
        trim : true,
        index : true
    },
    avatar : {
        type : String,
        required : true //Cloudinary url
    },
    coverImage : {
        type : String, //Cloudinary url
    },
    watchHistory : [
        {
            type : Schema.Types.ObjectId,
            ref : "Video"
        }
    ],
    password : {
        type : String,
        required: [true, "Password is required"]
    },
    refreshToken : {
        type : String
    }
}, {timestamps: true});

userSchemma.pre("save", async function(next){
    if(this.isModified("password"))
    this.password = await bcrypt.hash(this.password, 10);
    
    next();
});

userSchemma.methods.isPasswordCorrect = async function(password){
    await bcrypt.compare(password, this.password);
}

userSchemma.methods.generateAccessToken = function(){
    jwt.sign({
        _id : this._id,
        email : this.email,
        username :this.username,
        fullName : this.fullName
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    }
    )
}
userSchemma.methods.generateRefreshToken = function(){
    jwt.sign({
        _id : this._id,
        email : this.email,
        username :this.username,
        fullName : this.fullName
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn: process.env.v
    }
    )
}



export const User = mongoose.model("User", userSchemma);