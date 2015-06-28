/*  Basic ThressJS Editor Server

    This server has one purpose, to serve local content
    so that the ThreeJS editor can run as a url and not
    a file:///.
*/

var express = require('express');
var fs = require('fs');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);

// Add local editor-specific resources
app.use(express.static('.'));

// Add three.js unpacked resources.
app.use(express.static('..'));

// Redirect root to index.
app.get('/', function (req, res) {
  res.redirect("index.html");
});

app.get('/files', function (req, res) {
  fs.readdir( "./models", function (err, files) {
       res.send(files.join("\n"));
    });
});

// Start the server
server.listen(3001, function () {
    var port = server.address().port;
    console.log('Tune your browser to:   http://localhost:%s', port);

    io.of("/")
        .on('connection', function (socket) {
            console.log("Connected to main page");
            socket.on('disconnect', function (socket) {
                console.log("Disconnected from main page")
            });


            // MESHLAB (TODO: Move this to its own module)

            socket.on('meshlab_decimate', function (data) {
                console.log(data);
                console.log("meshlab_decimate");

                socket.emit("meshlab_complete",data);
            });
            socket.on('meshlab_clean', function (data) {
                console.log(data);
                console.log("meshlab_clean");
            });
            socket.on('meshlab_reconstruct', function (data) {
                console.log(data);
                console.log("meshlab_reconstruct");
            });
            socket.on('meshlab_filter', function (data) {
                console.log(data);
                console.log("meshlab_filter");
            });
            socket.on('meshlab_normalize', function (data) {
                console.log(data);
                console.log("meshlab_normalize");
            });
            socket.on('meshlab_center', function (data) {
                console.log(data);
                console.log("meshlab_center:" + data['uuid']);
            });
        });

});
