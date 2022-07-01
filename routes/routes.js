const { sampleHandler } = require("../handlers/routeHandlers/sampleHandler");
const { tokenHandler } = require("../handlers/routeHandlers/tokenHandler");
const { userHandler } = require("../handlers/routeHandlers/userHandler");

const routes = {
    'sample': sampleHandler,
    'users': userHandler,
    'token': tokenHandler,

}

module.exports = routes;