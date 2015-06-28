
Sidebar.Equipment = function ( editor ) {

	var signals = editor.signals;

	var rendererTypes = {

		'WebGLRenderer': THREE.WebGLRenderer,
		'CanvasRenderer': THREE.CanvasRenderer,
		'SVGRenderer': THREE.SVGRenderer,
		'SoftwareRenderer': THREE.SoftwareRenderer,
		'RaytracingRenderer': THREE.RaytracingRenderer

	};

	var container = new UI.CollapsiblePanel();
	container.setCollapsed( editor.config.getKey( 'ui/sidebar/equipment/collapsed' ) );
	container.onCollapsedChange( function ( boolean ) {
		editor.config.setKey( 'ui/sidebar/equipment/collapsed', boolean );
	} );

	container.addStatic( new UI.Text( 'EQUIPMENT' ) );
	container.add( new UI.Break() );

	// class

	var options = ['Baseline','Sawgunner','Grenadier','Squad Leader'];


	var equipmentTypeRow = new UI.Panel();
	var equipmentType = new UI.Select().setOptions( options ).setWidth( '150px' ).onChange( function () {
	} );

    equipmentTypeRow.add( new UI.Text( 'Kit' ).setWidth( '90px' ) );
    equipmentTypeRow.add( equipmentType );

	container.add( equipmentTypeRow );

    // Image Button

    var testRow = new UI.Panel();
    var testButton = new UI.ImageButton("/css/images/meshlab.png");
    testButton.onClick(function(){
        console.log("Clicky");
    });
    testRow.add(testButton);

    var testButton2 = new UI.ImageButton("/css/images/meshlab.png","clicky2").setMarginLeft( '10px' )
    testButton2.onClick(function(){
        console.log("Clicky");
    });
    testRow.add(testButton2);

    container.add( testRow );
    signals.objectSelected.add( function ( object ) {
        if(object.geometry instanceof THREE.BodyLabsGeometry){
            container.setDisplay( '' );
        } else {
            container.setDisplay( 'none' );
        }
    });
	return container;

}
