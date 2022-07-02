const { checkHandler } = require("../handlers/routeHandlers/checkHandler");
const { sampleHandler } = require("../handlers/routeHandlers/sampleHandler");
const { tokenHandler } = require("../handlers/routeHandlers/tokenHandler");
const { userHandler } = require("../handlers/routeHandlers/userHandler");

const routes = {
    'sample': sampleHandler,
    'users': userHandler,
    'token': tokenHandler,
    'checks': checkHandler,

}

module.exports = routes;