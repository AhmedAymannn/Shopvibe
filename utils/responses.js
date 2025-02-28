module.exports = {
    created: (res, message, data) => {
        res.status(201).json({
            status : 'success',
            message,
            data
        })
    },
    ok : (res, message,data)=>{
        res.status(200).json({
            status : 'success',
            message,
            data
        })
    },
    badRequest: (res, message) => {
        res.status(400).json({
            message
        })
    },
    unAuthorized: (res, message) => {
        res.status(401).json({
            status: 'failed',
            message
        })
    },
    forbidden: (res, message) => {
        res.status(403).json({
            status: 'failed',
            message
        })
    },
    notFound: (res, message) => {
        res.status(404).json({
            status: 'failed',
            message
        })
    },
    serverError: (res, error) => {
        res.status(500).json({
            message: error.message
        })
    },
    conflict : (res, message) => {
        res.status(409 ).json({
            status : 'failed',
            message
        });
    },
}
