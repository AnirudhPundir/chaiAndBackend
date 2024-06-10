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
    // TODO : get playlist by Id

    const {playlistId} = req.params;

    if(!playlistId) throw new ApiError(401, "Playlist Id not present");

    const playlist = await Playlist.findById(playlistId);

    if(!playlist) throw new ApiError(401, "Playlist not found");

    return res.status(200).json(200, playlist, "Playlist found"); 
});

export const addVideoToPlaylist = asyncHandler(async(req, res) => {
    const {playlistId, videoId} = req.params;
    
    if(!(playlistId && videoId)) throw new ApiError(401, "Playlist or video is missing");

    const playlist = await Playlist.findByIdAndUpdate(playlistId, {
        $push : {
            videos: videoId
        }
    }, {new: true})

    if(!playlist) throw new ApiError(401, "Video wasn't addded");;

    return res.status(200).json(200, playlist, "Video was added tio the playlist");
});

export const removeVideoFromPlaylist = asyncHandler(async(req, res) => {
    const {playlistId, videoId} = req.params;

    if(!(playlistId && videoId)) throw new ApiError(401, "Playlist or video is missing");

    const playlist = await Playlist.findByIdAndUpdate(playlistId, {
        $pull: {videos: {$in: [videoId]}}
    });

    if(!playlist) throw new ApiError(401, "Video wasn't removed");

    return res.status(200).json(200, playlist, "Video was removed");
});

export const  deletePlaylist = asyncHandler(async(req, res) => {
    const {playlistId} = req.params;

    if(!playlistId) throw new ApiError(401, "Playlist Id not present");

    Playlist.findByIdAndDelete(playlistId, (err, docs) => {
        if(err) {
            console.log(err)
        }
    });

    return res.status(200).json(200, {}, "Playlist removed")
});

export const updatePlaylist = asyncHandler( async(req, res) => {
    const {playlistId} = req.params;

    const {name, description} = req.body;

    if(!playlistId) throw new ApiError(401, "Invalid input: PlaylistId not present");

    if(!(name || description)) throw new ApiError(401, "Invalid input: name or/and description are missing");

    const playlist = await Playlist.findByIdAndUpdate(playlistId, {
        $set: {
            name, 
            description
        }
    }, {new: true});
    

    if(!playlist) throw new ApiError(401, "Operation Failed: Playlist not updated");

    return res.status(200).json(200, playlist, "Playlist updated successfully");
})