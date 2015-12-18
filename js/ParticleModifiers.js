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

	if(!params.range){
		throw "Particles.RandomModifier: No range specified.";
	}

	if(!params.offset){
		throw "Particles.RandomModifier: No offset specified.";
	}

	this.range = params.range;
	this.offset = params.offset;
	this.runOnce = params.runOnce !== undefined && params.runOnce !== null ?  params.runOnce : true ;
	this.rangeType = params.rangeType || THREE.Particles.RangeType.Cube;
	this.rangeEdgeClamp = params.rangeEdgeClamp !== undefined && params.rangeEdgeClamp !== null ?  params.rangeEdgeClamp : false ;

}

THREE.Particles.RandomModifier.prototype = Object.create( THREE.Particles.Modifier.prototype );

THREE.Particles.RandomModifier.prototype.initialize = function( particle, target ) {

	this.getValue( null, target );

}

THREE.Particles.RandomModifier.prototype.getValue = function( particle, target ) {

	if( this.rangeType == THREE.Particles.RangeType.Cube ) {

		THREE.Particles.Random.getRandomVectorCube( target, this.offset, this.range, this.rangeEdgeClamp );

	} else if( this.rangeType == THREE.Particles.RangeType.Sphere ) {

		THREE.Particles.Random.getRandomVectorSphere( target, this.offset, this.range, this.rangeEdgeClamp );

	}

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

	this.frameset.interpolateFrameValues( 0, target );

}

THREE.Particles.FrameSetModifier.prototype.getValue = function( particle, target ) {

	this.frameset.interpolateFrameValues( particle.age, target );

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

	target.set( 0, 0, 0 );

}

THREE.Particles.EvenIntervalIndexModifier.prototype.getValue = function( particle, target ) {

	var fraction = particle.age / particle.lifeSpan;
	var step = Math.floor( fraction * this.totalSteps );
	if ( step == this.totalSteps && step > 0 ) step--;

	target.set( step, step, step );

}

