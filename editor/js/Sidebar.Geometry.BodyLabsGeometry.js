
Sidebar.Geometry.BodyLabsGeometry = function ( signals, object ) {

    var container = new UI.Panel();

    var parameters = object.geometry.parameters;

    // pose

    var poseRow = new UI.Panel();
    var poseName = new UI.Input().setWidth( '150px' ).setFontSize( '12px' ).setValue(parameters.pose).onChange( function () {} );

    poseRow.add( new UI.Text( 'Pose' ).setWidth( '90px' ) );
    poseRow.add( poseName );

    container.add( poseRow );

    // shape

    var shapeRow = new UI.Panel();
    var shapeName = new UI.Input().setWidth( '150px' ).setFontSize( '12px' ).setValue(parameters.shape).onChange( function () {} );

    shapeRow.add( new UI.Text( 'Shape' ).setWidth( '90px' ) );
    shapeRow.add( shapeName );

    container.add( shapeRow );


    // Regenerate

    var button = new UI.Button( 'Regenerate Mesh' );
    button.onClick( update );
    container.add(button);
    //

    function update() {
        object.geometry.dispose();
        //object.geometry = new THREE.BodyLabsGeometry("a","b")
        console.log("Updating: " + poseName.getValue() + ", " + shapeName.getValue())
        var dummy = new THREE.BodyLabsGeometry(poseName.getValue(),shapeName.getValue());
        dummy.asyncLoad(function(geom) {
            object.geometry = geom;
            object.geometry.computeBoundingSphere();
            signals.geometryChanged.dispatch( object );
		});

       // object.geometry.dispose();

        /*object.geometry = new THREE.BodyLabsGeometry(
            width.getValue(),
            height.getValue(),
            depth.getValue(),
            widthSegments.getValue(),
            heightSegments.getValue(),
            depthSegments.getValue()
        );

        object.geometry.computeBoundingSphere();

        signals.geometryChanged.dispatch( object );*/

    }

    return container;

}
