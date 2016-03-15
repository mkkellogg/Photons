/**
* @author Mark Kellogg - http://www.github.com/mkkellogg
*/

var PHOTONS = PHOTONS || {};

//=======================================
// Base Modifier
//=======================================

PHOTONS.Modifier = function() {


}

//=======================================
// Random Modifier
//=======================================

PHOTONS.RandomModifier = function( params ) {

	PHOTONS.Modifier.call( this );

	if ( ! params ) params = {};

	if ( ! params.range ) {

		throw "Particles.RandomModifier: No range specified.";

	}

	if ( ! params.offset ) {

		throw "Particles.RandomModifier: No offset specified.";

	}

	this.range = params.range;
	this.offset = params.offset;
	this.rangeType = params.rangeType || PHOTONS.RangeType.Cube;
	this.rangeEdgeClamp = params.rangeEdgeClamp !== undefined && params.rangeEdgeClamp !== null ? params.rangeEdgeClamp : false ;

}

PHOTONS.RandomModifier.prototype = Object.create( PHOTONS.Modifier.prototype );

PHOTONS.RandomModifier.prototype.update = function( particle, target ) {

	if ( this.rangeType == PHOTONS.RangeType.Cube ) {

		PHOTONS.Random.getRandomVectorCube( target, this.offset, this.range, this.rangeEdgeClamp );

	} else if ( this.rangeType == PHOTONS.RangeType.Sphere ) {

		PHOTONS.Random.getRandomVectorSphere( target, this.offset, this.range, this.rangeEdgeClamp );

	}

}


//=======================================
// FrameSet Modifier
//=======================================

PHOTONS.FrameSetModifier = function( frameset ) {

	PHOTONS.Modifier.call( this );

	this.frameset = frameset;

}

PHOTONS.FrameSetModifier.prototype = Object.create( PHOTONS.Modifier.prototype );

PHOTONS.FrameSetModifier.prototype.update = function( particle, target ) {

	this.frameset.interpolateFrameValues( particle.age, target );

}


//=======================================
// EvenIntervalIndex Modifier
//=======================================

PHOTONS.EvenIntervalIndexModifier = function( totalSteps ) {

	PHOTONS.Modifier.call( this );
	this.totalSteps = Math.floor( totalSteps || 1 );

}

PHOTONS.EvenIntervalIndexModifier.prototype = Object.create( PHOTONS.Modifier.prototype );

PHOTONS.EvenIntervalIndexModifier.prototype.update = function( particle, target ) {

	var fraction = particle.age / particle.lifeSpan;
	var step = Math.floor( fraction * this.totalSteps );
	if ( step == this.totalSteps && step > 0 ) step --;

	target.set( step, step, step );

}


//=======================================
// LoopingTimeIntervalIndex Modifier
//=======================================

PHOTONS.LoopingTimeIntervalIndexModifier = function( totalSteps, imagesPerSecond) {
		PHOTONS.Modifier.call( this );
		this.totalSteps = Math.floor( totalSteps || 1 );
		this.timePerImage = 1 / imagesPerSecond;
	}

PHOTONS.LoopingTimeIntervalIndexModifier.prototype = Object.create( PHOTONS.Modifier.prototype );

PHOTONS.LoopingTimeIntervalIndexModifier.prototype.update = function( particle, target ) {
	
	var step = Math.floor( particle.age / this.timePerImage ) % this.totalSteps;	
	target.set( step, step, step );

}

