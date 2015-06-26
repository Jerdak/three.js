THREE.BodyLabsGeometry = function(pose,shape){
    THREE.Geometry.call( this );
    
    this.type = 'BodyLabsGeometry';

    this.parameters = {
        pose:pose,
        shape:shape
    };

    //BodyLabs data must be pulled from the server.
    var loader = new THREE.OBJLoader();

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
}

THREE.BodyLabsGeometry.prototype = Object.create( THREE.Geometry.prototype );
THREE.BodyLabsGeometry.prototype.constructor = THREE.BodyLabsGeometry;