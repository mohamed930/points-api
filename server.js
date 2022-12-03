const { Console } = require('console');
const http = require('http');
const app = require('./app');
const port = process.env.PORT || 1220;
const server = http.createServer(app);

console.log("server started at .. " + port)

server.listen(port);