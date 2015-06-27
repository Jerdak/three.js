THREE.BodyLabsGeometry = function(pose,shape,callback){
    THREE.Geometry.call( this );

    this.type = 'BodyLabsGeometry';

    this.parameters = {
        pose:pose,
        shape:shape
    };

    console.log("Fake Constructing new BodyLabs model.  Pose: "  + pose + " Shape: " + shape);


    // NOTE:  Do not load any data here.
    // The BodyLabs model requires interaction with the server (ie: asynchronous loading)
    // Supporting this behaviour in a Geometry subclas would require rewriting large portions of THreeJS.
    // So instead this constructor should return dummy geometry and callers should use asyncLoad to update.
}

THREE.BodyLabsGeometry.prototype = Object.create( THREE.Geometry.prototype );
THREE.BodyLabsGeometry.prototype.constructor = THREE.BodyLabsGeometry;

THREE.BodyLabsGeometry.prototype.asyncLoad = function(callback) {
    var self = this;

    console.log("BodyLabsGeometry delayed load: " + self.pose + ", " + self.shape);
    // Fow testing purposes, just load the brain model.
    var loader = new THREE.OBJLoader();
    loader.load("/models/brain.obj",function ( object ) {
        object.traverse(function(child){
            if(child instanceof THREE.Mesh){
                var geom = new THREE.Geometry().fromBufferGeometry( child.geometry );
                for(var i = 0; i < geom.vertices.length; ++i){
                    self.vertices.push(geom.vertices[i].clone());
                }
                for(var i = 0; i < geom.faces.length; ++i){
                    self.faces.push(geom.faces[i].clone());
                }
                self.computeFaceNormals();
                self.computeVertexNormals();

                if(callback){
                    callback(self);
                }
            }
        });
    });
    // Use pose and shape names to generate a unique hash.
    // This hash will be the folder name containing the
    // var url = "/bodylabs/hash(pose,shape)"
    // If path doesn't exist, express will first generate the file then send it
    //
    /*
    loader.load(url,function ( object ) {
        // here were need to copy  (deep copy) verts and faces
        this.verts = object.geometry.verts
        this.faces = object.geometry.faces

        // make sure to compute normals
        this.computeFaceNormals();
        this.computeVertexNormals();
    });
    */

};
