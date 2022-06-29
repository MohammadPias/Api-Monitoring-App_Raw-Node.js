const http = require('http');


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
app.handleReqRes = (req, res) => {
    res.end('Hello world')
}

// start server
app.createServer();
