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
};
utilities.createRandomString = (stringLength) => {
    const length = typeof stringLength === 'number' && stringLength > 0 ? stringLength : false;
    if (length) {
        const possibleCharacter = 'abcdefghijklmnopqrstuvwxyz1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ'
        let output = ''
        for (let i = 1; i <= length; i++) {
            const randomCharacter = possibleCharacter.charAt(Math.ceil(Math.random() * possibleCharacter.length));
            output += randomCharacter;
        }
        return output;
    } else {
        return false;
    }
}

module.exports = utilities;