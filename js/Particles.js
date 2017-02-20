/**
* @author Mark Kellogg - http://www.github.com/mkkellogg
*/

var PHOTONS = PHOTONS || {};

PHOTONS.RangeType = Object.freeze( {

	Default: 1,
	Cube: 2,
	Sphere: 3,
	Plane: 4

} );

PHOTONS.Constants = Object.freeze( {

	VerticesPerParticle: 6,
	DegreesToRadians: Math.PI / 180.0

} );


PHOTONS.Random = PHOTONS.Random || {};

PHOTONS.Random.getRandomVectorCube = function( vector, offset, range, edgeClamp ) {

	var x = Math.random() - 0.5;
	var y = Math.random() - 0.5;
	var z = Math.random() - 0.5;
	var w = Math.random() - 0.5;

	vector.set( x, y, z, w );

	if ( edgeClamp ) {

		var max = Math.max ( Math.abs( vector.x ), Math.max ( Math.abs( vector.y ), Math.abs( vector.z ) ) );
		vector.multiplyScalar( 1.0 / max );

	}

	vector.multiplyVectors( vector, range );
	vector.addVectors( vector, offset  );

}

PHOTONS.Random.getRandomVectorSphere = function( vector, offset, range, edgeClamp ) {

	var x = Math.random() - 0.5;
	var y = Math.random() - 0.5;
	var z = Math.random() - 0.5;
	var w = Math.random() - 0.5;

	vector.set( x, y, z, w );
	vector.normalize();

	vector.multiplyVectors( vector, range );

	if ( ! edgeClamp ) {

		var adjust = Math.random() * 2.0 - 1.0;
		vector.multiplyScalar( adjust );

	}

	vector.addVectors( vector, offset );

}

PHOTONS.Random.getRandomInteger = function( number, offset, range, edgeClamp ) {

	number.x = Math.floor( offset + Math.random() * range );

}

PHOTONS.SingularVector = function( x ) {

	this.x = x;

}


PHOTONS.SingularVector.prototype.copy = function( dest ) {

	this.x = dest.x;

}

PHOTONS.SingularVector.prototype.set = function( x ) {

	this.x = x;

}

PHOTONS.SingularVector.prototype.normalize = function() {

	//return this;

}

PHOTONS.SingularVector.prototype.multiplyScalar = function( x ) {

	this.x *= x;

}

PHOTONS.SingularVector.prototype.lerp = function( dest, f ) {

	this.x = this.x + f * ( dest.x - this.x );

}

PHOTONS.SingularVector.prototype.addVectors = function( vector, offset ) {

	vector.x += offset.x;

}

PHOTONS.SingularVector.prototype.multiplyVectors = function( vector, rangeVector ) {

	vector.x *= rangeVector.x;

}

