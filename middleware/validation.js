exports.validateSignUpData = async (req, res, next) => {
    const allowedFields = ["email", "name", "address", "phone", "password"];
    const filterObj = {};

    for (const field of allowedFields) {
        if (!req.body[field]) {
            return res.status(400).json({
                status: 'failed',
                message: `Missing required field: ${field}`
            });
        }
        filterObj[field] = req.body[field]; 
    }

    const keysArray = Object.keys(req.body);
    for (const key of keysArray) {
        if (!allowedFields.includes(key)) {
            return res.status(400).json({
                status: 'failed',
                message: `Unknown field: ${key}`
            });
        }
    }

    req.validatedData = filterObj; // Attach filtered data to the request
    next();
};
