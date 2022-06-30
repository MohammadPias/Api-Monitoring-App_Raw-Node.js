const crypto = require('crypto');
const environments = require('./environments')

const utilities = {};
utilities.parseString = (string) => {
    let parsedString;
    try {
        parsedString = JSON.parse(string)
    } catch {
        parsedString = {}
    }
    return parsedString
};

utilities.hash = (string) => {

    if (typeof string === 'string' && string.length > 0) {
        const hash = crypto
            .createHmac('sha256', environments.secretKey)
            .update(string)
            .digest('hex')

        return hash;
    } else {
        return false;
    }
}

module.exports = utilities;