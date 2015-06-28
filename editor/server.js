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
var readline = require('readline');
var exec = require('child_process').exec;

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

var WavefrontOBJ = function () {
    this.vertices = [];
    this.faces = [];
    this.uuid = [];
}

WavefrontOBJ.prototype = {
    fromJSON: function(data){
        this.uuid = data['uuid'];
        var verts = data['vertices'];
        var faces = data['faces'];
        for(var i = 0; i < verts.length; ++i){
            this.vertices.push([verts[i].x,verts[i].y,verts[i].z]);
        }
        for(var i = 0; i < faces.length; ++i){
            this.faces.push([faces[i].a,faces[i].b,faces[i].c]);
        }
    },
    save: function(fileName,callback){
        var stream = fs.createWriteStream(fileName);
        var self = this;
        stream.once('open', function(fd) {
            for(var i = 0; i < self.vertices.length; ++i){
                stream.write("v " + self.vertices[i][0].toString() + " " + self.vertices[i][1].toString() + " " + self.vertices[i][2].toString() + "\n");
            }
            stream.write("o " + self.uuid + "\n");
            for(var i = 0; i < self.faces.length; ++i){
                stream.write("f " + (self.faces[i][0]+1).toString() + " " + (self.faces[i][1]+1).toString() + " " + (self.faces[i][2]+1).toString() + "\n");
            }
            stream.end();

        });
        stream.on('finish', function() {
            if(callback)callback();
        });
    },
    load: function(fileName,callback){
        var self = this;
        self.vertices = [];
        self.faces = [];

        var rd = readline.createInterface({
            input: fs.createReadStream(fileName),
            output: process.stdout,
            terminal: false
        });

        rd.on('line', function(line) {

            var tok = line.trim().split(' ');
            if (tok.length < 0) return;

            if (tok[0][0] === 'v' || tok[0][0] === 'V'){
                self.vertices.push([parseFloat(tok[1]),parseFloat(tok[2]),parseFloat(tok[3])]);
            } else if (tok[0][0] === 'f' || tok[0][0] === 'F'){
                self.faces.push([parseInt(tok[1])-1,parseInt(tok[2])-1,parseInt(tok[3])-1]);
            }
        });
        rd.on('close',function(){
            if(callback)callback();
        });
    }
}
function test_meshlab(fileName,fileNameOut,scriptName,callback){
    var args = " -i " + fileName + " -s " + scriptName + " -o " + fileNameOut;
    var serverExe = "\"C:\\Program Files\\VCG\\meshlab\\meshlabserver\"";
    var child = exec(serverExe + args, function( error, stdout, stderr)
     {
         if ( error != null ) {
              console.log(stderr);
         }
         if(callback)callback(fileNameOut);
     });
}
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
                var obj = new WavefrontOBJ();
                obj.fromJSON(data);
                obj.save("test.obj",function(){
                    console.log("Saved test.obj");
                    test_meshlab("test.obj","test_out.obj","meshlab_decimate.mlx",function(){
                        obj.load("test_out.obj",function(){
                            console.log("UUID: ",obj.uuid);

                            var data = {
                                'vertices':obj.vertices,
                                'faces':obj.faces,
                                'uuid':obj.uuid
                            }
                            socket.emit("meshlab_complete",data);
                        });
                    });

                });




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
