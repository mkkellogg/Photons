/**
* @author Mark Kellogg - http://www.github.com/mkkellogg
*/

var PHOTONS = PHOTONS || {};

PHOTONS.FrameSet = class {

	constructor ( timeFrames, valueFrames, isScalar ) {

		this.timeFrames = timeFrames || [];
		this.valueFrames = valueFrames || [];

	}

	findNextFrameForTimeValue = function( t ) {

		var frameIndex = 0;

		while ( frameIndex < this.timeFrames.length && this.timeFrames[ frameIndex ] < t ) {

			frameIndex = frameIndex + 1;

		}

		return frameIndex;

	}

	calculateFraction = function( a, b, z ) {

		return ( z - a ) / ( b - a );

	}

	calculateFraction = function( a, b, z ) {

		return ( z - a ) / ( b - a );

	}

	interpolateFrameValues = function( t, target ) {

		var nextFrameIndex = this.findNextFrameForTimeValue( t );
		var currentFrameIndex = nextFrameIndex - 1;

		if ( nextFrameIndex == 0 ) {

			target.copy( this.valueFrames[ 0 ] );

		} else if ( nextFrameIndex == this.timeFrames.length ) {

			target.copy( this.valueFrames[ currentFrameIndex ] );

		} else {

			var fraction = this.calculateFraction( this.timeFrames[ currentFrameIndex ], this.timeFrames[ nextFrameIndex ], t );

			target.copy( this.valueFrames[ currentFrameIndex ] );
			target.lerp( this.valueFrames[ nextFrameIndex ], fraction );

		}

	}

};
