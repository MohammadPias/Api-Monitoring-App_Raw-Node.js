const { sampleHandler } = require("../handlers/routeHandlers/sampleHandler");
const { userHandler } = require("../handlers/routeHandlers/userHandler");

const routes = {
    'sample': sampleHandler,
    'users': userHandler,

}

module.exports = routes;