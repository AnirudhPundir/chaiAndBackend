import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/apiResponse.js";
import jwt  from "jsonwebtoken";

const generateAccessAndRefreshTokens = async(userId) => {
    try{
        const user = await User.findById("661df9ad337f3a0e0c80b094");
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        //saving the refresh token in DB
        user.refreshToken = refreshToken;
        // To skip validation for fields like password we add properties like ValidationBeforeSave
        user.save({validateBeforeSave : false});

        return {refreshToken, accessToken};
    }
    catch(err){
        throw new ApiError(500, "Something went wrong while generating the refresh and access tokens");
    }
}

export const registerUser = asyncHandler(async(req, res) => {
        
        //get user details from frontend
        //validation
        //check if user already exists or not, check via email or username
        //check for images, check for avatar, if available upload them to cloudinary
        //create user object, create entry in db
        //remove password and refresh token field from response
        //return res
        const {fullName, username, email, password} = req.body;
        
        
        //validations for fields
        if([fullName, username, email, password].some(field => field?.trim() === "")){
            throw new ApiError(400, "All fields are required")
        }

        //records's existence
        const userExisted = await User.findOne({
            $or : [{email}, {username}]
        })
        if(userExisted){
            throw new ApiError(409, "User already exists")
        }

        //fetch files
        const avatarLocalPath = req.files?.avatar[0]?.path;
        // TODO : MULTER IMPLEMENTATION FOR MULTIPLE FILES
        // const coverImageLocalPath = req.files?.coverImage[0]?.path;
        console.log("Avatar Local Path : ", avatarLocalPath);
        // console.log("Cover Image Local Path : ", coverImageLocalPath);
        
        if(!avatarLocalPath){
            throw new ApiError(400, "Avatar Image not found");
        }

        const avatar = await uploadOnCloudinary(avatarLocalPath);
        // const coverImage = await uploadOnCloudinary(coverImageLocalPath);

        if(!avatar){
            throw new ApiError(400, "Avatar file is required");
        }

        //upload data in db
        const user = await User.create({
            fullName : fullName,
            avatar: avatar.url,
            password,
            username : username.toLowerCase(),
            email
        });
        console.log("CREATED USER ID :- ",user._id);
        const createdUser = await User.findById(user._id).select("-password -refreshToken");

        if(!createdUser){
            throw new ApiError("400", "Something went wrong while registering the user");
        }
        console.log("CREATED USER :- ",createdUser);
        return res.status(201).json(new ApiResponse(200, createdUser, "Record created successfully"))


        res.status(200).json({
        message : "Ok"
    });
});

export const loginUser = asyncHandler(async(req, res) => {
    // req body -> data
    // username or email
    // find the user
    // verify password
    // generate access and refresh token
    // send (secure)cookie

    const {username, email, password} = req.body;

    if(!(username || email)){        throw new ApiError(400, "username or email is required");
    }

    //check if a record is present in DB with 
    //the aforementioned username or email 
    //using the $or mongoose operator
    
    const user = await User.findOne({
        $or : [{username}, {email}]
    }) 

    if(!user){
        throw new ApiError(404, "user does not exist")
    }
    // methods like isPasswordCorrect created in userschemma are part of the record returned from the database 
    const isPasswordCorrect = await user.isPasswordCorrect(password);

    if(!isPasswordCorrect){
        throw new ApiError(401, "Invalied User credentials");
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id);

    //Fetch updated logged in user data, filter password and refresh token
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");
    
    //send cookies
    
    //options to make cookies only readable 
    const options = {
        httpOnly : true,
        secure : true
    }

    return res.status(200).cookie("accessToken", accessToken, options).cookie("refreshToken", refreshToken, options).json(
        new ApiResponse(200, {
            user: loggedInUser, 
            accessToken, 
            refreshToken
        }, "User logged In Successfullt")
    )
})

export const logoutUser = asyncHandler(async(req, res) => {
    // remove cookies
    // remove refreshToken
    
    // find the record by id and update the refresh token property with $set operator, new is added to fetch the updated record
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new : true
        }
    )

    const options = {
        httpOnly : true,
        secure : true
    }

    return res.status(200).clearCookie("accessToken", options).clearCookie("refreshToken", options).json(new ApiResponse(200, {}, "User logged out"))

});

export const refreshAccessToken = asyncHandler(async(req, res) => {
    try {
        const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;
    
        if(!incomingRefreshToken) throw new ApiError(401, "Refresh token N/A");
    
        // verify refresh token
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
    
        //fetch user details based on decodedToken
        const user = await User.findById(decodedToken?._id);
    
        if(!user) throw new ApiError(401, 'Invalid Refresh token');
    
        if(incomingRefreshToken !== user?.refreshToken) throw new ApiError(401, 'Refresh token Expired');
    
        //generate new access and refresh tokens
    
        const options = {
            httpOnly : true,
            secure : true
        };
    
        const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id);
    
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(200, {accessToken, refreshToken}, "Access token refreshed"))
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid Refresh token");
    }

})

