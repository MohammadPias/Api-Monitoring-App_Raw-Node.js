const http = require('http');
const { handleReqRes } = require('./helpers/handleReqRes')
const environment = require('./helpers/environments');


const app = {};


// server 
app.createServer = () => {
    const server = http.createServer(app.handleReqRes);
    server.listen(environment?.port, () => {
        console.log(`listening port by ${environment?.port}`)
    })
};

// handle Request and Response
app.handleReqRes = handleReqRes;

// start server
app.createServer();
