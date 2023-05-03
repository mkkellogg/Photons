/**
* @author Mark Kellogg - http://www.github.com/mkkellogg
*/

var PHOTONS = PHOTONS || {};

//=======================================
// Base Modifier
//=======================================

PHOTONS.Modifier = class {

};


//=======================================
// Random Modifier
//=======================================

PHOTONS.RandomModifier = class RandomModifier extends PHOTONS.Modifier {

	constructor ( params ) {

		super();

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

	update ( particle, target ) {

		if ( this.rangeType == PHOTONS.RangeType.Cube ) {
	
			PHOTONS.Random.getRandomVectorCube( target, this.offset, this.range, this.rangeEdgeClamp );
	
		} else if ( this.rangeType == PHOTONS.RangeType.Sphere ) {
	
			PHOTONS.Random.getRandomVectorSphere( target, this.offset, this.range, this.rangeEdgeClamp );
	
		} else if ( this.rangeType == PHOTONS.RangeType.Default ) {
	
			PHOTONS.Random.getRandomInteger( target, this.offset, this.range, this.rangeEdgeClamp );
	
		}
	
	}
};


//=======================================
// FrameSet Modifier
//=======================================

PHOTONS.FrameSetModifier = class FrameSetModifier extends PHOTONS.Modifier {

	constructor ( frameset ) {

		super();

		this.frameset = frameset;

	}

	update ( particle, target ) {

		this.frameset.interpolateFrameValues( particle.age, target );
	
	}

};


//=======================================
// EvenIntervalIndex Modifier
//=======================================

PHOTONS.EvenIntervalIndexModifier = class EvenIntervalIndexModifier extends PHOTONS.Modifier {

	constructor ( totalSteps ) {

		super();

		this.totalSteps = Math.floor( totalSteps || 1 );

	}

	update ( particle, target ) {

		var fraction = particle.age / particle.lifeSpan;
		var step = Math.floor( fraction * this.totalSteps );
		if ( step == this.totalSteps && step > 0 ) step --;

		target.set( step, step, step );

	}

};

//=======================================
// LoopingTimeIntervalIndex Modifier
//=======================================

PHOTONS.LoopingTimeIntervalIndexModifier = class LoopingTimeIntervalIndexModifier extends PHOTONS.Modifier {

		constructor ( totalSteps, imagesPerSecond ) {

			super();

			this.totalSteps = Math.floor( totalSteps || 1 );
			this.timePerImage = 1 / imagesPerSecond;
			this.modifierParticleData = {};

		}

		update ( particle, target ) {

		    // keep track of the atlas we started on so we can start randomly and progress normally afterwards
		    var data = this.modifierParticleData[particle.id];
		    if( !data ) {

			   	data = { 'atlasStartIndex': Math.floor( Math.abs( particle.atlasIndex.x ) ) };
			   	this.modifierParticleData[particle.id] = data;

		    }

		    var step = Math.floor( data.atlasStartIndex + particle.age / this.timePerImage ) % this.totalSteps;   
		    target.set( step );

	   }

};


//=======================================
// User Function Modifier
//=======================================

PHOTONS.UserFunctionModifier = class UserFunctionModifier extends PHOTONS.Modifier {

	constructor ( callback ) {

		super();

		this.callback = callback;

	}

	update ( particle, target ) {

		this.callback(particle.age, target);

	}
};
