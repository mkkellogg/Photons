/**
* @author Mark Kellogg
*/

THREE.Particles = THREE.Particles || {};

THREE.Particles.RangeType = Object.freeze( {

	Cube: 1, 
	Sphere: 2,
	Plane: 3 

} );

THREE.Particles.Constants = Object.freeze( {

	VerticesPerParticle: 6,
	DegreesToRadians: Math.PI / 180.0

} );


THREE.Particles.Random = THREE.Particles.Random || {};
THREE.Particles.Random.getRandomScalar = function( base, range ) {

	return base + range * (Math.random() - 0.5);

}

THREE.Particles.Random.getRandomVectorCube = function( vector, offset, range, edgeClamp ) {

	var x = Math.random() - 0.5;
	var y = Math.random() - 0.5;
	var z = Math.random() - 0.5;
	var w = Math.random() - 0.5;

	vector.set( x, y, z, w );

	if ( edgeClamp ) {

		var max = Math.max ( Math.abs( vector.x ), Math.max ( Math.abs( vector.y ), Math.abs( vector.z ) ) );
		vector.multiplyScalar( 1.0 / max );

	}

	vector.multiplyVectors( range, vector );	
	vector.addVectors( offset, vector );

	return vector;

}

THREE.Particles.Random.getRandomVectorSphere = function( vector, offset, range, edgeClamp ) {

	var x = Math.random() - 0.5;
	var y = Math.random() - 0.5;
	var z = Math.random() - 0.5;
	var w = Math.random() - 0.5;

	vector.set( x, y, z, w );
	vector.normalize().multiplyVectors( vector, range );
	
	if ( ! edgeClamp ) {

		var adjust =  Math.random() * 2.0 - 1.0;
		vector.multiplyScalar( adjust );
	}

	vector.addVectors(vector, offset );

	return vector;

}

THREE.Particles.SingularVector = function(value){

	this.x = value;

}


THREE.Particles.SingularVector.prototype.copy = function(src){

}

THREE.Particles.SingularVector.prototype.lerp = function(src, f){
	
	//return a + f * ( b - a );

}
