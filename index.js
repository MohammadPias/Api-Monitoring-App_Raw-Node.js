const http = require('http');
const { handleReqRes } = require('./helpers/handleReqRes')

const url = require('url');
const { StringDecoder } = require('string_decoder');
const { notFoundHandler } = require('./handlers/routeHandlers/notFoundHandler');
const routes = require('./routes/routes')

const app = {};

// configuration
app.config = {
    port: 5000,
};

// server 
app.createServer = () => {
    const server = http.createServer(app.handleReqRes);
    server.listen(app.config.port, () => {
        console.log(`listening port by ${app.config.port}`)
    })
};

// handle Request and Response
app.handleReqRes = handleReqRes;

// start server
app.createServer();
