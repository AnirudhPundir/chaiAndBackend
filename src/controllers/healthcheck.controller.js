import { asyncHandler } from "../utils/asyncHandler"

export const healthcheck = asyncHandler(async(req, res)=> {
    //TODO: build a healthcheck response that simply returns the OK status as json with a message   
    res.status(200).json(200, {}, "Everything is fine");
}) 