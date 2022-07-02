const lib = require('../../library/data');
const { hash, createRandomString } = require('../../helpers/utilities');
const { parseString } = require('../../helpers/utilities')


const handler = {};

handler.tokenHandler = (requestProperties, callback) => {
    const methods = ['get', 'post', 'put', 'delete'];

    if (methods.indexOf(requestProperties.method) > -1) {

        handler._token[requestProperties.method](requestProperties, callback);
    } else {
        callback(404, { message: 'Method not accepted' })
    };
};

handler._token = {}

// handle token get request
handler._token.get = (requestProperties, callback) => {
    const tokenId = typeof (requestProperties.query.tokenId) === 'string' && requestProperties.query.tokenId.trim().length === 20 ? requestProperties.query.tokenId : false;
    if (tokenId) {
        lib.read('tokens', tokenId, (err, tokenData) => {
            if (!err && tokenData) {
                const token = { ...parseString(tokenData) }

                callback(200, token)
            } else {
                callback('404', 'token was not found!')
            }
        })
    } else {
        callback(404, { error: 'token was not found!' })
    }
}

// handle token post request
handler._token.post = (requestProperties, callback) => {
    const phone = typeof (requestProperties.body.phone) === 'string' && requestProperties.body.phone.trim().length === 11 ? requestProperties.body.phone : false;

    const password = typeof (requestProperties.body.password) === 'string' && requestProperties.body.password.trim().length >= 6 ? requestProperties.body.password : false;

    if (phone && password) {
        lib.read('users', phone, (err, data) => {
            console.log(err)
            if (!err) {
                const newPass = hash(password);
                const parsedData = parseString(data)
                console.log(parsedData.password, newPass)
                if (newPass === parsedData.password) {
                    const tokenId = createRandomString(20);
                    const expires = Date.now() + 60 * 60 * 1000;
                    const tokenObject = {
                        tokenId,
                        expires,
                        phone,
                    };
                    lib.create('tokens', tokenId, tokenObject, (err) => {
                        if (!err) {
                            callback(200, { message: "Token added successfully" })
                        } else {
                            callback(500, { error: "Token id was not created!" })
                        }
                    })
                } else {
                    callback(500, { error: "Opps! password don't match!" })
                }
            } else {
                callback(500, { error: 'There was a problem in server side' })
            }
        })
    } else {
        callback(400, { error: 'There was problem in your request!' })
    }
}

// handle token put request
handler._token.put = (requestProperties, callback) => {
    const tokenId = typeof (requestProperties.body.tokenId) === 'string' && requestProperties.body.tokenId.trim().length === 20 ? requestProperties.body.tokenId : false;

    const extend = typeof (requestProperties.body.extend) === 'boolean' && requestProperties.body.extend === true;
    // console.log(tokenId, extend)

    if (tokenId && extend) {
        lib.read('tokens', tokenId, (err, tokenData) => {
            console.log(err)
            if (!err && tokenData) {
                const token = { ...parseString(tokenData) }
                if (token.expires > Date.now()) {
                    token.expires = Date.now() + 60 * 60 * 1000;
                    lib.update('tokens', tokenId, token, (err) => {
                        console.log(err)
                        if (!err) {
                            callback(200, { message: 'Token was updated successfully!' })
                        } else {
                            callback(500, { error: 'token was not updated' })
                        }
                    })
                } else {
                    callback(500, { error: 'Token already was expired!' })
                }
            } else {
                callback(500, { error: 'token was already expired' })
            }
        })
    } else {
        callback(400, { error: 'There was a problem in your request!' })
    }
}

// handle token delete request
handler._token.delete = (requestProperties, callback) => {
    const tokenId = typeof (requestProperties.query.tokenId) === 'string' && requestProperties.query.tokenId.trim().length === 20 ? requestProperties.query.tokenId : false;
    if (tokenId) {
        lib.read('tokens', tokenId, (err, data) => {
            if (!err && data) {
                lib.delete('tokens', tokenId, (err) => {
                    if (!err) {
                        callback(200, { message: 'Token was deleted successfully!' })
                    } else {
                        callback(500, { error: 'You can not delete token!' })
                    }
                })
            } else {
                callback(500, { error: 'Token was not found!' })
            }
        })
    } else {
        callback(400, { error: 'There was a problem in your request!' })
    }
}

handler._token.verify = (tokenId, phone, callback) => {
    lib.read('tokens', tokenId, (err, data) => {
        if (!err && data) {
            if (parseString(data).phone === phone && parseString(data).expires > Date.now()) {
                callback(true)
            } else {
                callback(false)
            }
        } else {
            callback(false)
        }
    })
}

module.exports = handler;