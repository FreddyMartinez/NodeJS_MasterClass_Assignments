/*
 * Homework Assignment #1
 * This is a simple example of a REST API
 */

var http = require('http');
var url = require('url');

var server = http.createServer(function (req, res) {

    // Parse the url
    var parsedUrl = url.parse(req.url, true);

    // Get the path
    var path = parsedUrl.pathname;
    var trimmedPath = path.replace(/^\/+|\/+$/g, '');
    req.on('data', function(data) {
        //do nothing
    });
    req.on('end', function(){

        // Check the router for a matching path for a handler. If one is not found, use the notFound handler instead.
        var chosenHandler = typeof (router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

        // Route the request to the handler specified in the router
        chosenHandler(function (statusCode, payload) {
            // Use the status code returned from the handler, or set the default status code to 200
            statusCode = typeof (statusCode) == 'number' ? statusCode : 200;

            // Use the payload returned from the handler, or set the default payload to an empty object
            payload = typeof (payload) == 'object' ? payload : {};

            // Convert the payload to a string
            var payloadString = JSON.stringify(payload);

            // Return the response
            res.setHeader('Content-Type', 'application/json');
            res.writeHead(statusCode);
            res.end(payloadString);
        });
    });
});

// Start the server
server.listen(3000, function () {
    console.log('The server is up and running on port 3000.');
});

// Define all the handlers
var handlers = {};

// Sample handler
handlers.hello = function (callback) {
    callback(406, { 'message': 'hello!! Welcome!' });
};

// Not found handler
handlers.notFound = function (callback) {
    callback(404);
};

// Define the request router
var router = {
    'hello': handlers.hello
};