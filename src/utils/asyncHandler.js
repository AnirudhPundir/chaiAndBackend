const asyncHandlertryCatch = (fn) => async(req, res, next) => {
    try{
        await fn(req, res, next);
    }
    catch(err){
        res.status(err.code || 500).json({
            status : false
        })
    }
};

export const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).catch(err => next(err));
    }
}