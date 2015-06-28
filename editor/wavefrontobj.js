var fs = require('fs');


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
    save: function(fileName){
        var stream = fs.createWriteStream(fileName);
        stream.once('open', function(fd) {
            for(var i = 0; i < this.vertices.length; ++i){
                stream.write("v " + this.vertices[i][0].toString() + " " + this.vertices[i][1].toString() + " " + this.vertices[i][2].toString())
            }
            for(var i = 0; i < this.faces.length; ++i){
                stream.write("v " + this.faces[i][0].toString() + " " + this.faces[i][1].toString() + " " + this.faces[i][2].toString())
            }
            stream.end();
        });
    }
}
