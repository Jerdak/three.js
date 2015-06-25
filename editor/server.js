/*  Basic ThressJS Editor Server

    This server has one purpose, to serve local content
    so that the ThreeJS editor can run as a url and not
    a file:///.
*/

var express = require('express');
var fs = require('fs');

var app = express();

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
var server = app.listen(3001, function () {
  var port = server.address().port;
  console.log('Tune your browser to:   http://localhost:%s', port);

});