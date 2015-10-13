/**
* @author Mark Kellogg
*/

var Particles = Particles || {};

Particles.FrameSet = function ( timeFrames, valueFrames, isScalar ) {

	this.timeFrames = timeFrames || [];
	this.valueFrames = valueFrames || [];
	this.isScalar = isScalar !== undefined && isScalar !== null ? isScalar : true ;

}

Particles.FrameSet.prototype.findNextFrameForTimeValue = function( t ) {

	var frameIndex = 0;
	while( frameIndex < this.timeFrames.length && this.timeFrames[ frameIndex ] < t ) {

		frameIndex = frameIndex + 1;

	}

	return frameIndex;
}

Particles.FrameSet.prototype.lerpScalar = function( a, b, f ) {

	return a + f * ( b - a );

}

Particles.FrameSet.prototype.calculateFraction = function( a, b, z ) {

	return ( z - a ) / ( b - a );

}

Particles.FrameSet.prototype.interpolateFrameValues = function( t, target ) {

	var nextFrameIndex = this.findNextFrameForTimeValue( t );
	var currentFrameIndex = nextFrameIndex - 1;

	if ( nextFrameIndex == 0 ) {

		if( this.isScalar ) {

			return this.valueFrames[ 0 ];

		} else {

			target.copy( this.valueFrames[ 0 ] );
			return target;
		}

	} else if ( nextFrameIndex == this.timeFrames.length ) {

		if( this.isScalar ) {

			return this.valueFrames[ currentFrameIndex ];

		} else {

			target.copy( this.valueFrames[ currentFrameIndex ] );
			return target;

		}

	} else {

		var fraction = this.calculateFraction( this.timeFrames[ currentFrameIndex ], this.timeFrames[ nextFrameIndex ], t );

		if( this.isScalar ) {

			return this.lerpScalar( this.valueFrames[currentFrameIndex], this.valueFrames[nextFrameIndex], fraction );

		} else {

			target.copy( this.valueFrames[currentFrameIndex] );
			target.lerp( this.valueFrames[nextFrameIndex], fraction );

			return target;

		}

	}

}