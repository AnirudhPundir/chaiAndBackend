const asyncHandlertryCatch = (fn) = async(req, res, next) => {
    try{
        await fn(req, res, next);
    }
    catch(err){
        res.status(err.code || 500).json({
            status : false
        })
    }
};

const asyncHandler = (requestHandler) => {
    (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).catch(err => next(err));
    }
}