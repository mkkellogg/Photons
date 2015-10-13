/**
* @author Mark Kellogg
*/

var Particles = Particles || {};

Particles.RangeType = Object.freeze( {

	Cube: 1, 
	Sphere: 2,
	Plane: 3 

} );

Particles.Constants = Object.freeze( {

	VerticesPerParticle: 6,
	DegreesToRadians: Math.PI / 180.0

} );


Particles.Random = Particles.Random || {};
Particles.Random.getRandomScalar = function( base, range ) {

	return base + range * (Math.random() - 0.5);

}

Particles.Random.getRandomVectorCube = function( vector, offset, range, edgeClamp ) {

	var x = Math.random() - 0.5;
	var y = Math.random() - 0.5;
	var z = Math.random() - 0.5;
	var w = Math.random() - 0.5;

	vector.set( x, y, z, w );

	if ( edgeClamp ) {

		var max = Math.max ( vector.x, Math.max ( vector.y, vector.z ) );
		vecotr.multiplyScalar( 1.0 / max );

	}

	vector.multiplyVectors( range, vector );	
	vector.addVectors( offset, vector );

	return vector;

}

Particles.Random.getRandomVectorSphere = function( vector, offset, range, edgeClamp ) {

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
