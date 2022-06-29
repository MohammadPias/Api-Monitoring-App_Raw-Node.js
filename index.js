const http = require('http');
const { handleReqRes } = require('./helpers/handleReqRes')
const environment = require('./helpers/environments');
const lib = require('./library/data');


const app = {};

const myData = {
    class: 10,
    roll: 55,
    name: 'Rohan Chowdhury'
}
lib.delete('test', 'newFile', (err) => {
    console.log(`Error was ${err}`)
})

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
