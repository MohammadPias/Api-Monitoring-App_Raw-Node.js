const lib = require('../../library/data');
const { hash, createRandomString } = require('../../helpers/utilities');
const { parseString } = require('../../helpers/utilities');
const tokenHandlers = require('../../handlers/routeHandlers/tokenHandler');
const { maxChecks } = require('../../helpers/environments')


const handler = {};

handler.checkHandler = (requestProperties, callback) => {
    const methods = ['get', 'post', 'put', 'delete'];

    if (methods.indexOf(requestProperties.method) > -1) {

        handler._check[requestProperties.method](requestProperties, callback);
    } else {
        callback(404, { message: 'Method not accepted' })
    };
};

handler._check = {}

// handle check get request
handler._check.get = (requestProperties, callback) => {

    const checkId = typeof requestProperties.query.checkId === 'string' && requestProperties.query.checkId.trim().length === 10 ? requestProperties.query.checkId : false;

    if (checkId) {

        const tokenId = typeof requestProperties.headers.token === 'string' ? requestProperties.headers.token : false;

        if (tokenId) {
            lib.read('tokens', tokenId, (err, data) => {
                if (!err && data) {
                    const tokenData = parseString(data);
                    const phone = tokenData.phone;
                    tokenHandlers._token.verify(tokenId, phone, (isTokenValid) => {
                        if (isTokenValid) {
                            lib.read('checks', checkId, (err, data) => {
                                if (!err && data) {
                                    callback(200, parseString(data))
                                } else {
                                    callback(403, { error: 'Can nod read Check data!' })
                                }
                            })
                        } else {
                            callback(403, { error: 'User was unauthenticated!!' })
                        }
                    })

                } else {
                    callback(500, { error: 'Can not find token data' })
                }
            })
        } else {
            callback(500, { error: 'Check list was not found!' })
        }
    } else {
        callback(400, { error: 'There was a problem in your request!' })
    }
}

// handle check post request
handler._check.post = (requestProperties, callback) => {
    const protocol = typeof requestProperties.body.protocol === 'string' && ['http', 'https'].indexOf(requestProperties.body.protocol) > -1 ? requestProperties.body.protocol : false;

    const url = typeof requestProperties.body.url === 'string' && requestProperties.body.url.trim().length > 0 ? requestProperties.body.url : false;

    const method = typeof requestProperties.body.method === 'string' && ['GET', 'POST', 'PUT', 'Delete'].indexOf(requestProperties.body.method) > -1 ? requestProperties.body.method : false;

    const successCode = typeof requestProperties.body.successCode === 'object' && requestProperties.body.successCode instanceof Array ? requestProperties.body.successCode : false;

    const timeout = typeof requestProperties.body.timeout === 'number' && requestProperties.body.timeout >= 1 && requestProperties.body.timeout <= 5 ? requestProperties.body.timeout : false;

    if (protocol && url && method && successCode && timeout) {

        const tokenId = typeof requestProperties.headers.token === 'string' ? requestProperties.headers.token : false;

        lib.read('tokens', tokenId, (err, data) => {
            if (!err && data) {
                const phone = parseString(data).phone;

                tokenHandlers._token.verify(tokenId, phone, (isValidToken) => {
                    if (isValidToken) {
                        lib.read('users', phone, (err, data) => {
                            if (!err && data) {
                                const userData = parseString(data);
                                const userChecks = typeof userData.checks === 'object' && userData.checks instanceof Array ? userData.checks : [];

                                if (userChecks.length < maxChecks) {
                                    checkId = createRandomString(10);
                                    checkData = {
                                        checkId,
                                        phone,
                                        protocol,
                                        url,
                                        method,
                                        successCode,
                                        timeout
                                    }

                                    lib.create('checks', checkId, checkData, (err) => {
                                        if (!err) {
                                            userData.checks = userChecks;
                                            userData.checks.push(checkId)

                                            if (userData.checks.length > 0) {
                                                lib.update('users', phone, userData, (err) => {
                                                    if (!err) {
                                                        callback(200, checkData)
                                                    } else {
                                                        callback(500, { error: 'Can not update user check id' })
                                                    }
                                                })
                                            } else {
                                                callback(500, { error: 'Can not add check in in user' })
                                            }
                                        } else {
                                            callback(500, { error: 'There was a server side problem!' })
                                        }
                                    })
                                } else {
                                    callback(500, { error: 'Users reached already max check limit!' })
                                }
                            } else {
                                callback(500, { error: 'User was not found!' })
                            }
                        })
                    } else {
                        callback(500, { error: 'User was unauthenticated!' })
                    }
                })

            } else {
                callback(500, { error: 'Invalid user token!' })
            }
        })
    } else {
        callback(400, { error: 'There was a problem in your request!' })
    }
}

// handle check put request
handler._check.put = (requestProperties, callback) => {
    const checkId = typeof requestProperties.body.checkId === 'string' && requestProperties.body.checkId.trim().length === 10 ? requestProperties.body.checkId : false;

    const protocol = typeof requestProperties.body.protocol === 'string' && ['http', 'https'].indexOf(requestProperties.body.protocol) > -1 ? requestProperties.body.protocol : false;

    const url = typeof requestProperties.body.url === 'string' && requestProperties.body.url.trim().length > 0 ? requestProperties.body.url : false;

    const method = typeof requestProperties.body.method === 'string' && ['GET', 'POST', 'PUT', 'Delete'].indexOf(requestProperties.body.method) > -1 ? requestProperties.body.method : false;

    const successCode = typeof requestProperties.body.successCode === 'object' && requestProperties.body.successCode instanceof Array ? requestProperties.body.successCode : false;

    const timeout = typeof requestProperties.body.timeout === 'number' && requestProperties.body.timeout >= 1 && requestProperties.body.timeout <= 5 ? requestProperties.body.timeout : false;

    if (checkId) {
        if (protocol && url && method && successCode && timeout) {

            const tokenId = typeof requestProperties.headers.token === 'string' ? requestProperties.headers.token : false;

            if (tokenId) {
                lib.read('tokens', tokenId, (err, data) => {
                    if (!err && data) {
                        const tokenData = parseString(data);
                        const phone = tokenData.phone;

                        tokenHandlers._token.verify(tokenId, phone, (isTokenValid) => {
                            if (isTokenValid) {
                                lib.read('checks', checkId, (err, data) => {
                                    if (!err && data) {
                                        const checkData = parseString(data);

                                        if (protocol) {
                                            checkData.protocol = protocol;
                                        }
                                        if (url) {
                                            checkData.url = url;
                                        }
                                        if (method) {
                                            checkData.method = method;
                                        }
                                        if (successCode) {
                                            checkData.successCode = successCode;
                                        }
                                        if (timeout) {
                                            checkData.timeout = timeout;
                                        }

                                        lib.update('checks', checkId, checkData, (err) => {
                                            if (!err) {
                                                callback(200, { message: 'Your Check Data was updated!' })
                                            } else {
                                                callback(500, { error: 'Can not update Check data!' })
                                            }
                                        })
                                    } else {
                                        callback(500, { error: 'Can not read Check data!' })
                                    }
                                })
                            } else {
                                callback(403, { error: 'User was unauthenticated!!' })
                            }
                        })

                    } else {
                        callback(500, { error: 'Can not read token data' })
                    }
                })
            } else {
                callback(500, { error: 'Check list was not found!' })
            }
        } else {
            callback(403, { error: 'Please input at least one field' })
        }
    } else {
        callback(400, { error: 'There was a problem in your request!' })
    }
}

// handle check delete request
handler._check.delete = (requestProperties, callback) => {
    const checkId = typeof requestProperties.query.checkId === 'string' && requestProperties.query.checkId.trim().length === 10 ? requestProperties.query.checkId : false;

    if (checkId) {

        const tokenId = typeof requestProperties.headers.token === 'string' ? requestProperties.headers.token : false;

        if (tokenId) {
            lib.read('tokens', tokenId, (err, data) => {
                if (!err && data) {
                    const tokenData = parseString(data);
                    const phone = tokenData.phone;
                    tokenHandlers._token.verify(tokenId, phone, (isTokenValid) => {
                        if (isTokenValid) {
                            lib.delete('checks', checkId, (err) => {
                                if (!err) {
                                    lib.read('users', phone, (err, data) => {
                                        if (!err && data) {
                                            const userData = parseString(data);

                                            const newUser = userData.checks.filter(item => item !== checkId)
                                            userData.checks = newUser

                                            lib.update('users', phone, userData, (err) => {
                                                if (!err) {
                                                    callback(200)
                                                } else {
                                                    callback(500, { error: 'Can not update Check data!' })
                                                }
                                            })
                                        }
                                    })
                                    // callback(200, parseString(data))
                                } else {
                                    callback(500, { error: 'Can nod delete Check data!' })
                                }
                            })
                        } else {
                            callback(500, { error: 'User was unauthenticated!!' })
                        }
                    })

                } else {
                    callback(500, { error: 'Can not find token data' })
                }
            })
        } else {
            callback(500, { error: 'Check list was not found!' })
        }
    } else {
        callback(400, { error: 'There was a problem in your request!' })
    }

}

module.exports = handler;