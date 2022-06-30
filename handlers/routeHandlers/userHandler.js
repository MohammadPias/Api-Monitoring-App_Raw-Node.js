const lib = require('../../library/data');
const { hash } = require('../../helpers/utilities');
const { parseString } = require('../../helpers/utilities')


const handler = {};

handler.userHandler = (requestProperties, callback) => {
    const methods = ['get', 'post', 'put', 'delete'];

    if (methods.indexOf(requestProperties.method) > -1) {

        handler._users[requestProperties.method](requestProperties, callback);
    } else {
        callback(404, { message: 'Method not accepted' })
    };
};

handler._users = {}

// handle get request
handler._users.get = (requestProperties, callback) => {
    const phone = typeof (requestProperties.query.phone) === 'string' && requestProperties.query.phone.trim().length === 11 ? requestProperties.query.phone : false;
    if (phone) {
        lib.read('users', phone, (err, data) => {
            if (!err) {
                const user = { ...parseString(data) }
                delete user.password;

                callback(200, user)
            } else {
                callback('404', 'User was not found!')
            }
        })
    } else {
        callback(404, { error: 'User was not found!' })
    }
}

// handle post request
handler._users.post = (requestProperties, callback) => {

    const firstName = typeof (requestProperties.body.firstName) === 'string' && requestProperties.body.firstName.trim().length > 0 ? requestProperties.body.firstName : false;

    const lastName = typeof (requestProperties.body.lastName) === 'string' && requestProperties.body.lastName.trim().length > 0 ? requestProperties.body.lastName : false;

    const phone = typeof (requestProperties.body.phone) === 'string' && requestProperties.body.phone.trim().length === 11 ? requestProperties.body.phone : false;

    const password = typeof (requestProperties.body.password) === 'string' && requestProperties.body.password.trim().length >= 6 ? requestProperties.body.password : false;

    const toAgreement = typeof (requestProperties.body.toAgreement) === 'boolean' ? requestProperties.body.toAgreement : false;

    if (firstName && lastName && phone && password && toAgreement) {
        lib.read('users', phone, (err) => {
            if (err) {
                const userObject = {
                    firstName,
                    lastName,
                    phone,
                    password: hash(password),
                    toAgreement
                };
                lib.create('users', phone, userObject, (err) => {
                    if (!err) {
                        callback(200, { message: 'User was created successfully' })
                    } else {
                        callback(500, { error: 'User was not created!' })
                    }
                })
            } else {
                callback(500, { error: 'There was a problem in server side' })
            }
        })
    } else {
        callback(400, { error: 'There was problem in your request!' })
    }
}

// handle put request
handler._users.put = (requestProperties, callback) => {
    const firstName = typeof (requestProperties.body.firstName) === 'string' && requestProperties.body.firstName.trim().length > 0 ? requestProperties.body.firstName : false;

    const lastName = typeof (requestProperties.body.lastName) === 'string' && requestProperties.body.lastName.trim().length > 0 ? requestProperties.body.lastName : false;

    const phone = typeof (requestProperties.body.phone) === 'string' && requestProperties.body.phone.trim().length === 11 ? requestProperties.body.phone : false;

    const password = typeof (requestProperties.body.password) === 'string' && requestProperties.body.password.trim().length >= 6 ? requestProperties.body.password : false;

    if (phone) {
        if (firstName || lastName || password) {
            lib.read('users', phone, (err, data) => {
                if (!err && data) {
                    const user = { ...parseString(data) }
                    if (firstName) {
                        user.firstName = firstName;
                    }
                    if (lastName) {
                        user.lastName = lastName;
                    }
                    if (password) {
                        user.password = hash(password);
                    }

                    lib.update('users', phone, user, (err) => {
                        if (!err) {
                            callback(200, { message: 'Your profile was updated successfully!' })
                        }
                    })
                } else {
                    callback(500, { error: 'User was not found' })
                }
            })
        } else {
            callback(404, { error: 'Your request was failed!' })
        }
    } else {
        callback(404, { error: 'Please input a correct phone number!' })
    }
}

// handle delete request
handler._users.delete = (requestProperties, callback) => {
    const phone = typeof (requestProperties.body.phone) === 'string' && requestProperties.body.phone.trim().length === 11 ? requestProperties.body.phone : false;
    if (phone) {
        lib.read('users', phone, (err, data) => {
            if (!err && data) {
                lib.delete('users', phone, (err) => {
                    if (!err) {
                        callback(200, { message: 'User was deleted successfully!' })
                    } else {
                        callback(500, { error: 'You can not delete!' })
                    }
                })
            } else {
                callback(500, { error: 'User was not found!' })
            }
        })
    } else {
        callback(400, { error: 'Incorrect phone number. Please try again!' })
    }
}

module.exports = handler;

/* console.log(JSON.stringify({
    firstName: 'Noor',
    lastName: 'Mohammad',
    phone: '01222434232',
    password: '123456',
    toAgreement: true,
})) */