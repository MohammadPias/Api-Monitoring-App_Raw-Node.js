const handlers = {};

handlers.sampleHandler = (requestProperties, callback) => {
    console.log(requestProperties);
    callback(400, {
        message: 'This is Sample Handler'
    })
}

module.exports = handlers;