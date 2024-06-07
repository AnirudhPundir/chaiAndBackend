import { Playlist } from "../models/playlist.models";
import { ApiError } from "../utils/apiError";
import { ApiResponse } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";

export const createPlaylist = asyncHandler(async(req, res) => {
    // TODO :- create playlist
    // Steps :
    // 1. fetch the name and description and check them
    // 2. fetch the owner id which is the logged in user
    // 3. create playlist record
    const {name, description} = req.params;

    if(!(name && description)) throw new ApiError(401, "Please add the name and description");

    const playlist = await Playlist.create({
        name,
        description,
        owner : req.user?._id
    });

    if(!playlist) throw new ApiError(401, "Playlist was not created");

    return res.status(200).json(new ApiResponse(200, playlist, "Playlist was created successfully"));
});

export const getUserPlaylists = asyncHandler(async(req, res) => {
    // TODO :- get user playlists
    // Steps :- 
    // 1. Fetch the userId, whose playlist we are looking
    // 2. fetch the playlist based on owner id in playlist
    const {userId} = req.params;

    if(!userId) throw new ApiError(401, "User info missing");

    const playlists = await Playlist.find({owner : userId});

    if(!(playlists && playlists.length == 0)) throw new ApiError(401, "No playlists found");

    return res.status(200).json(200, playlists, "User playlist")
});

export const  getUserPlaylistById = asyncHandler(async(req, res) => {
    
})