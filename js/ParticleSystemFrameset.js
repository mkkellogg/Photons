/**
* @author Mark Kellogg
*/

var Particles = Particles || {};

Particles.FrameSet = function ( timeFrames, valueFrames ) {

	this.timeFrames = timeFrames || [];
	this.valueFrames = valueFrames || [];

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

Particles.FrameSet.prototype.interpolateFrameValuesScalar = function( t ) {

	var nextFrameIndex = this.findNextFrameForTimeValue( t );
	var currentFrameIndex = nextFrameIndex - 1;

	if ( nextFrameIndex == 0 ) {

		return this.valueFrames[ 0 ];

	} else if ( nextFrameIndex == this.timeFrames.length ) {

		return this.valueFrames[ currentFrameIndex ];

	}

	var fraction = this.calculateFraction( this.timeFrames[ currentFrameIndex ], this.timeFrames[ nextFrameIndex ], t );

	return this.lerpScalar( this.valueFrames[currentFrameIndex], this.valueFrames[nextFrameIndex], fraction );

}

Particles.FrameSet.prototype.interpolateFrameValuesVector = function( t, target ) {

	var nextFrameIndex = this.findNextFrameForTimeValue( t );
	var currentFrameIndex = nextFrameIndex - 1;

	if ( nextFrameIndex == 0 ) {

		target.copy( this.valueFrames[ 0 ] );

	} else if ( nextFrameIndex == this.timeFrames.length ) {

		target.copy( this.valueFrames[ currentFrameIndex ] );

	} else {

		var fraction = this.calculateFraction( this.timeFrames[ currentFrameIndex ], this.timeFrames[ nextFrameIndex ], t );

		target.copy( this.valueFrames[currentFrameIndex] );
		target.lerp( this.valueFrames[nextFrameIndex], fraction );

	}

	return target;

}