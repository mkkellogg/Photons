/**
* @author Mark Kellogg
*/

ParticleSystemPresets =
{		
	Sparks :
	{
		zSort: true,

		initialPositionRangeType    : ParticleSystem.RangeType.Cube,
		initialPositionOffset     : new THREE.Vector3( 0,  5, 0 ),
		initialPositionRange   : new THREE.Vector3( 10, 0, 10 ),
		
		initialVelocityRangeType    : ParticleSystem.RangeType.Cube,
		initialVelocityOffset     : new THREE.Vector3( 0,  160, 0 ),
		initialVelocityRange   : new THREE.Vector3( 100, 20, 100 ), 

		initialAccelerationOffset : new THREE.Vector3( 0, -100, 0 ),
		
		particleTexture : THREE.ImageUtils.loadTexture( 'images/star.png' ),

		initialRotationOffset               : 0,
		initialRotationRange             : 180,
		initialAngularVelocityOffset       : 100,
		initialAngularVelocityRange     : 360 * 4,
		
		sizeFrameSet    : new ParticleSystem.FrameSet( [ 0, 0.5, 1.0, 1.5, 2.0, 2.5, 3.0 ], 
			                                           [ new THREE.Vector3( 1, 1 ), new THREE.Vector3( 3, 1.5 ),  new THREE.Vector3( 2, 4 ),  new THREE.Vector3( 5, 2.5 ), new THREE.Vector3( 3, 6 ), new THREE.Vector3( 7, 3.5 ), new THREE.Vector3( 4, 8 ) ] ),
		alphaFrameSet : new ParticleSystem.FrameSet( [2, 3], [1, 0] ),
		colorFrameSet   : new ParticleSystem.FrameSet( [0.0, 1.0, 2], [ new THREE.Vector3(1.0,1.0,0.0), new THREE.Vector3(1.0, 0.0, 0.0), new THREE.Vector3(0.6, 0.0, 0.0) ] ),

		particleReleaseRate : 200,
		particleLifeSpan   : 3.0,		
		emitterDeathAge    : 60
	},

	Smoke :
	{
		zSort: true,

		initialPositionRangeType : ParticleSystem.RangeType.Sphere,
		initialPositionOffset : new THREE.Vector3( 0, 0, 0 ),
		initialPositionRange : new THREE.Vector3( 10, 0, 10 ),

		initialVelocityRangeType : ParticleSystem.RangeType.Sphere,
		initialVelocityOffset : new THREE.Vector3( 0, 75, 0 ),
		initialVelocityRange : new THREE.Vector3( 30, 25, 30 ), 
		initialAccelerationOffset : new THREE.Vector3( 0,-10,0 ),
		
		particleTexture : THREE.ImageUtils.loadTexture( 'images/smokeparticle.png' ),

		initialRotationOffset : 0,
		initialRotationRange : 360,
		initialAngularVelocityOffset : 50,
		initialAngularVelocityRange : 400,
		
		sizeFrameSet : new ParticleSystem.FrameSet( [0, 4], [ new THREE.Vector2( 10, 10 ), new THREE.Vector2( 50, 50 ) ] ),
		alphaFrameSet : new ParticleSystem.FrameSet( [0, 0.6, 4], [0.0, 0.5, 0.0] ),
		colorFrameSet : new ParticleSystem.FrameSet( [0.0, 1.5, 4], [ new THREE.Vector3( 0.1, 0.1, 0.1 ), new THREE.Vector3( 0.35, 0.35, 0.35 ), new THREE.Vector3( 0.7, 0.7, 0.7 ) ] ),

		particleReleaseRate : 200,
		particleLifeSpan : 4.0,		
		emitterDeathAge : 60
	},

    Flame :
	{
		initialPositionRangeType  : ParticleSystem.RangeType.Sphere,
		initialPositionOffset   : new THREE.Vector3( 0, 50, 0 ),
		initialPositionRange : new THREE.Vector3( 2, 2, 2 ),
		
		initialVelocityRangeType  : ParticleSystem.RangeType.Cube,
		initialVelocityOffset   : new THREE.Vector3(0,100,0),
		initialVelocityRange : new THREE.Vector3(20,0,20),
		
		particleTexture : THREE.ImageUtils.loadTexture( 'images/smokeparticle.png' ),
		
		sizeFrameSet    : new ParticleSystem.FrameSet( [0, 0.3, 1.2], [20, 150, 1] ),
		alphaFrameSet : new ParticleSystem.FrameSet( [0.9, 1.5], [1, 0] ),
		colorFrameSet   : new ParticleSystem.FrameSet( [0.5, 1.0], [ new THREE.Vector3(0.02, 1, 0.5), new THREE.Vector3(0.05, 1, 0) ] ),
		blendStyle : THREE.AdditiveBlending,  
		
		particleReleaseRate : 60,
		particleLifeSpan   : 1.5,		
		emitterDeathAge    : 60
	}
	
}