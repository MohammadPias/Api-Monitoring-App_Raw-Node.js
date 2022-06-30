const lib = require('../../library/data');
const { hash } = require('../../helpers/utilities')

const handler = {};

handler.userHandler = (requestProperties, callback) => {
    const methods = ['get', 'post', 'put', 'delete'];
    console.log(requestProperties.method)
    console.log(handler._users)
    if (methods.indexOf(requestProperties.method) > -1) {

        handler._users[requestProperties.method](requestProperties, callback);
    } else {
        callback(404, { message: 'Method not accepted' })
    };
};

handler._users = {}
handler._users.get = (requestProperties, callback) => {
    callback(200, { message: 'request from get method' })
}
handler._users.post = (requestProperties, callback) => {

    const firstName = typeof (requestProperties.body.firstName) === 'string' && requestProperties.body.firstName.trim().length > 0 ? requestProperties.body.firstName : false;

    const lastName = typeof (requestProperties.body.lastName) === 'string' && requestProperties.body.lastName.trim().length > 0 ? requestProperties.body.lastName : false;

    const phone = typeof (requestProperties.body.phone) === 'string' && requestProperties.body.phone.trim().length === 11 ? requestProperties.body.phone : false;

    const password = typeof (requestProperties.body.password) === 'string' && requestProperties.body.password.trim().length >= 6 ? requestProperties.body.password : false;

    const toAgreement = typeof (requestProperties.body.toAgreement) === 'boolean' ? requestProperties.body.toAgreement : false;

    console.log(typeof (requestProperties.body.password) === 'string')
    if (firstName && lastName && phone && password && toAgreement) {
        lib.read('users', phone, (err, user) => {
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
handler._users.put = (requestProperties, callback) => {

}
handler._users.delete = (requestProperties, callback) => {

}

module.exports = handler;

/* console.log(JSON.stringify({
    firstName: 'Noor',
    lastName: 'Mohammad',
    phone: '01222434232',
    password: '123456',
    toAgreement: true,
})) */