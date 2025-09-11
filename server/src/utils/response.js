export const asyncHandler = (fn) => {
    return async (req, res, next) => {
        await fn(req, res, next).catch(error => {
            return next(error);
        })
    }
}

export const glopalErrorHandler = (error, req, res, next) => {
    return res.status(error.cause || 400).json({
        message: error.message,
        // stack: error.stack,
        error,
    })
}


export const succsesResponse = ({ res, message = "Done", info,
    status = 200, data } = {}) => {
    return res.status(status).json({
        message,
        info,
        data
    })
}