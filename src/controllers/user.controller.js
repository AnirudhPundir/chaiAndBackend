import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/apiResponse.js";

export const registerUser = asyncHandler(async(req, res) => {
        //get user details from frontend
        //validation
        //check if user already exists or not, check via email or username
        //check for images, check for avatar, if available upload them to cloudinary
        //create user object, create entry in db
        //remove password and refresh token field from response
        //return res
        const {fullname, userName, email, password} = req.body;
        console.log(email);
        //validations for fields
        if([fullname, userName, email, password].some(field => field?.trim() === "")){
            throw new ApiError(400, "All fields are required")
        }

        //records's existence
        const userExisted = User.findOne({
            $or : [{email}, {userName}]
        })
        if(userExisted){
            throw new ApiError(409, "User already exists")
        }

        //fetch files
        const avatarLocalPath = req.files?.avatar[0]?.path;
        const coverImageLocalPath = req.files?.coverImage[0]?.path;
        
        if(!avatarLocalPath){
            throw new ApiError(400, "Avatar Image not found");
        }

        const avatar = await uploadOnCloudinary(avatarLocalPath);
        const coverImage = await uploadOnCloudinary(coverImageLocalPath);

        if(!avatar){
            throw new ApiError(400, "Avatar file is required");
        }

        //upload data in db
        const user = User.create({
            fullName : fullname,
            avatar: avatar.url,
            coverImage: coverImage.url,
            password,
            username : userName.toLowerCase(),
            email
        });

        const createdUser = User.findById(user._id).select("-password -refreshToken");

        if(!createdUser){
            throw new ApiError("400", "Something went wrong while registering the user");
        }

        return res.status(201).json(new ApiResponse(200, createdUser, "Record created successfully"))


        res.status(200).json({
        message : "Ok"
    });
});

