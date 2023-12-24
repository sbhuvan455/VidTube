export const AsyncHandler = (fn) => async (req, res, next) => {
    try {
        await fn(req, res, next);
    } catch (error) {
        res.status(err.code || 500).json({
            message: err.message,
            success: false,
        })
    }
}