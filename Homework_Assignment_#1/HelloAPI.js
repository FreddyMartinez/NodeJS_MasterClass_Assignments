/*
 * Homework Assignment #1
 * This is a simple example of a REST API
 */

var http = require('http');
var url = require('url');
var StringDecoder = require('string_decoder').StringDecoder;

var server = http.createServer(function (req, res) {

    // Parse the url
    var parsedUrl = url.parse(req.url, true);

    // Get the path
    var path = parsedUrl.pathname;
    var trimmedPath = path.replace(/^\/+|\/+$/g, '');
    
    var decoder = new StringDecoder('utf-8');
    var buffer = '';
    req.on('data', function(data) {
        buffer += decoder.write(data);
    });
    req.on('end', function(){

        buffer += decoder.end();
        var lang = buffer && typeof(buffer === 'object')? JSON.parse(buffer)["lang"] : "";
        
        // Check the router for a matching path for a handler.
        var chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

        // Route the request to the handler specified in the router
        chosenHandler(lang, function (statusCode, payload) {
            // Use the status code returned from the handler, or set the default status code to 500 (internal server error)
            statusCode = typeof(statusCode) == 'number' ? statusCode : 500;

            // Use the payload returned from the handler, or set the default payload to an empty object
            payload = typeof(payload) == 'object' ? payload : {};

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

// Hello handler
handlers.hello = function (language, callback) {
    var response = '';
    if(language ==='de'){
        response = 'Hallo!! Willkommen!';
    }else if(language ==='es'){
        response = 'Hola!! Bienvenido!';
    }else{
        response = 'hello!! Welcome!';
    }
    callback(200, { 'message': response });
};

// Bye handler
handlers.bye = function (language, callback) {
    var response = '';
    if(language ==='de'){
        response = 'auf wiedersehen!';
    }else if(language ==='es'){
        response = 'adios!';
    }else{
        response = 'goodbye!';
    }
    callback(200, { 'message': response });
};

// Not found handler
handlers.notFound = function (language, callback) {
    callback(404);
};

// Define the request router
var router = {
    'hello': handlers.hello,
    'bye': handlers.bye
};