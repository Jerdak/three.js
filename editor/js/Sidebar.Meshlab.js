
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
            console.log("Update");
            console.log(object);

            //TODO:  Update object geometry.  Also add some error handlers in case uuid was deleted.
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
