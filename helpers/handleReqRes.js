const url = require('url');
const { StringDecoder } = require('string_decoder');
const { notFoundHandler } = require('../handlers/routeHandlers/notFoundHandler');
const routes = require('../routes/routes');
const { parseString } = require('./utilities')

const handler = {}

handler.handleReqRes = (req, res) => {
    const parseUrl = url.parse(req.url, true); // {}
    const path = parseUrl.pathname;
    const trimPath = path.replace(/^\/+|\/$/g, '');
    const method = req.method.toLowerCase();
    const query = parseUrl.query; // {}
    const headers = req.headers;

    const requestProperties = {
        parseUrl,
        path,
        trimPath,
        method,
        query,
        headers
    };

    const decoder = new StringDecoder('utf-8');
    let decodedData = '';

    const chooseHandler = routes[trimPath] ? routes[trimPath] : notFoundHandler; // function


    req.on('data', (buffer) => {
        decodedData += decoder.write(buffer);
    });

    req.on('end', () => {
        decodedData += decoder.end();

        requestProperties.body = parseString(decodedData);

        // console.log(requestProperties)
        chooseHandler(requestProperties, (statusCode, payload) => {
            statusCode = typeof statusCode === 'number' ? statusCode : 500;
            payload = typeof payload === 'object' ? payload : {};

            const payloadString = JSON.stringify(payload)

            res.setHeader('content-type', 'application/json')
            res.writeHead(statusCode);
            res.end(payloadString)
        })

        // res.end('Api monitoring App')
    })




}

module.exports = handler;