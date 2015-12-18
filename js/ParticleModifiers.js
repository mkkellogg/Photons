/**
* @author Mark Kellogg
*/

THREE.Particles = THREE.Particles || {};

//=======================================
// Base Modifier
//=======================================

THREE.Particles.Modifier = function () {

	this.runOnce = true;

}


//=======================================
// Random Modifier
//=======================================

THREE.Particles.RandomModifier = function ( params ) {

	THREE.Particles.Modifier.call( this );

	if( ! params ) params = {};

	if( params.isScalar === null || params.isScalar === undefined ) {

		params.isScalar = true;

	}

	this.isScalar = params.isScalar;

	if ( this.isScalar ) {

		this.offset = params.offset !== undefined && params.offset !== null ?  params.offset : 0 ;
		this.range = params.range !== undefined && params.range !== null ?  params.range : 0 ;
		this.runOnce = params.runOnce !== undefined && params.runOnce !== null ?  params.runOnce : true ;
		this.rangeType = undefined;
		this.rangeEdgeClamp = params.rangeEdgeClamp !== undefined && params.rangeEdgeClamp !== null ?  params.rangeEdgeClamp : false ;

	} else {

		this.offset = params.offset !== undefined && params.offset !== null ?  params.offset : new THREE.Vector3 (0, 0, 0 );
		this.range = params.range !== undefined && params.range !== null ?  params.range : new THREE.Vector3 (0, 0, 0 );
		this.runOnce = params.runOnce !== undefined && params.runOnce !== null ?  params.runOnce : true ;
		this.rangeType = params.rangeType || THREE.Particles.RangeType.Cube;
		this.rangeEdgeClamp = params.rangeEdgeClamp !== undefined && params.rangeEdgeClamp !== null ?  params.rangeEdgeClamp : false ;

	}

}

THREE.Particles.RandomModifier.prototype = Object.create( THREE.Particles.Modifier.prototype );

THREE.Particles.RandomModifier.prototype.initialize = function( particle, target ) {

	return this.getValue( 0, target );

}

THREE.Particles.RandomModifier.prototype.getValue = function( particle, target ) {

	var val =  undefined;	

	if( this.isScalar ) {

		val =  THREE.Particles.Random.getRandomScalar( this.offset, this.range );

	}  else {

		if( this.rangeType == THREE.Particles.RangeType.Cube ) {

			val =  THREE.Particles.Random.getRandomVectorCube( target, this.offset, this.range, this.rangeEdgeClamp );

		} else if( this.rangeType == THREE.Particles.RangeType.Sphere ) {

			val =  THREE.Particles.Random.getRandomVectorSphere( target, this.offset, this.range, this.rangeEdgeClamp );

		}
		
	}

	return val;

}


//=======================================
// FrameSet Modifier
//=======================================

THREE.Particles.FrameSetModifier = function ( frameset ) {

	THREE.Particles.Modifier.call( this );

	this.frameset = frameset;
	this.runOnce = false;

}

THREE.Particles.FrameSetModifier.prototype = Object.create( THREE.Particles.Modifier.prototype );


THREE.Particles.FrameSetModifier.prototype.initialize = function( particle, target ) {

	return this.frameset.interpolateFrameValues( 0, target );

}

THREE.Particles.FrameSetModifier.prototype.getValue = function( particle, target ) {

	return this.frameset.interpolateFrameValues( particle.age, target );

}


//=======================================
// EvenIntervalIndex Modifier
//=======================================

THREE.Particles.EvenIntervalIndexModifier = function ( totalSteps ) {

	THREE.Particles.Modifier.call( this );
	this.totalSteps = Math.floor( totalSteps || 1 );
	this.runOnce = false;

}

THREE.Particles.EvenIntervalIndexModifier.prototype = Object.create( THREE.Particles.Modifier.prototype );


THREE.Particles.EvenIntervalIndexModifier.prototype.initialize = function( particle, target ) {

	return 0;

}

THREE.Particles.EvenIntervalIndexModifier.prototype.getValue = function( particle, target ) {

	var fraction = particle.age / particle.lifeSpan;
	var step = Math.floor( fraction * this.totalSteps );
	if ( step == this.totalSteps && step > 0 ) step--;

	return step;

}

