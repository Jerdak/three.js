
Sidebar.Meshlab = function ( editor ) {
	var signals = editor.signals;
    var self = this;

	var container = new UI.CollapsiblePanel();
	container.setCollapsed( editor.config.getKey( 'ui/sidebar/meshlab/collapsed' ) );
	container.onCollapsedChange( function ( boolean ) {
		editor.config.setKey( 'ui/sidebar/meshlab/collapsed', boolean );
	} );

	container.addStatic( new UI.Text( 'MESHLAB' ) );
	container.add( new UI.Break() );

    // Image Button
    var actions = ['decimate','clean','reconstruct','filter','normalize','center'];

    var row = null;
    actions.forEach( function ( action, index) {
        if(index%5===0){
            row = new UI.Panel();
            container.add( row );
        }
        var button = new UI.ImageButton("/css/images/meshlab.png","Meshlab: " + action).setMarginLeft((index%5===0)?'0px':'10px');
        button.onClick(function(){
            var object = editor.selected;
            var geom = (object.geometry.type === "BufferGeometry") ? new THREE.Geometry().fromBufferGeometry(object.geometry):object.geometry;

            var data = {
                'uuid':object.uuid,
                'vertices': geom.vertices,
                'faces':geom.faces
            };
            editor.communicator.emit("meshlab_"+action,data);
        });
        row.add(button);
    });

    editor.communicator.on('meshlab_complete',function(data){
        editor.getByUuid(data['uuid'],function(object){
            if(!object){
                console.log("uuid has expired");
                return;
            }
            console.log("Update");
            console.log(object);

            var geometry = new THREE.Geometry();
            for(var i = 0; i < data.vertices.length; ++i){
                var v = new THREE.Vector3();
                v.x = data.vertices[i][0];
                v.y = data.vertices[i][1];
                v.z = data.vertices[i][2];
                geometry.vertices.push(v);
            }
            for(var i = 0; i < data.faces.length; ++i){
                var f = new THREE.Face3(data.faces[i][0],data.faces[i][1],data.faces[i][2]);
                geometry.faces.push(f);
            }
            object.geometry.dispose();
            object.geometry = new THREE.BufferGeometry().fromGeometry(geometry);

            //TODO: Figure out why this doesn't work, requires manual refresh.
            signals.geometryChanged.dispatch( object );
        });
    });


    signals.objectSelected.add( function ( object ) {
        if(!object.geometry){
            container.setDisplay('none');
            return;
        }
        if (object.geometry.type === "Geometry" ||  object.geometry.type === "BufferGeometry") {
            container.setDisplay( '' );
        } else {
            container.setDisplay( 'none' );
        }
    });
	return container;

}
