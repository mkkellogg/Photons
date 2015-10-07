/**
* @author Mark Kellogg
*/

ParticleSystemPresets =
{		
	Sparks :
	{
		zSort: true,

		initialPositionRangeType : ParticleSystem.RangeType.Cube,
		initialPositionOffset : new THREE.Vector3( 0,  5, 0 ),
		initialPositionRange : new THREE.Vector3( 10, 0, 10 ),
		
		initialVelocityRangeType : ParticleSystem.RangeType.Cube,
		initialVelocityOffset : new THREE.Vector3( 0,  160, 0 ),
		initialVelocityRange : new THREE.Vector3( 100, 20, 100 ), 

		initialAccelerationOffset : new THREE.Vector3( 0, -100, 0 ),
		
		particleAtlas : new Atlas( THREE.ImageUtils.loadTexture( 'images/star.png' ), true ),

		initialRotationOffset : 0,
		initialRotationRange  : 180,
		initialAngularVelocityOffset : 100,
		initialAngularVelocityRange : 360 * 4,
		
		atlasFrameSet: new ParticleSystem.FrameSet( [0, 3], [0, 0] ),
		sizeFrameSet : new ParticleSystem.FrameSet( [ 0, 0.5, 1.0, 1.5, 2.0, 2.5, 3.0 ], 
			                                           [ new THREE.Vector3( 1, 1 ), new THREE.Vector3( 3, 1.5 ),  new THREE.Vector3( 2, 4 ),  new THREE.Vector3( 5, 2.5 ), new THREE.Vector3( 3, 6 ), new THREE.Vector3( 7, 3.5 ), new THREE.Vector3( 4, 8 ) ] ),
		alphaFrameSet : new ParticleSystem.FrameSet( [2, 3], [1, 0] ),
		colorFrameSet : new ParticleSystem.FrameSet( [0.0, 1.0, 2], [ new THREE.Vector3(1.0,1.0,0.0), new THREE.Vector3(1.0, 0.0, 0.0), new THREE.Vector3(0.6, 0.0, 0.0) ] ),

		particleReleaseRate : 200,
		particleLifeSpan : 3.0,		
		emitterDeathAge : 60
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
		
		particleAtlas : new Atlas( THREE.ImageUtils.loadTexture( 'images/smokeparticle.png' ), true ),

		initialRotationOffset : 0,
		initialRotationRange : 360,
		initialAngularVelocityOffset : 50,
		initialAngularVelocityRange : 400,

		atlasFrameSet: new ParticleSystem.FrameSet( [0, 4], [0, 0] ),		
		sizeFrameSet : new ParticleSystem.FrameSet( [0, 4], [ new THREE.Vector2( 10, 10 ), new THREE.Vector2( 50, 50 ) ] ),
		alphaFrameSet : new ParticleSystem.FrameSet( [0, 0.6, 4], [0.0, 0.5, 0.0] ),
		colorFrameSet : new ParticleSystem.FrameSet( [0.0, 1.5, 4], [ new THREE.Vector3( 0.1, 0.1, 0.1 ), new THREE.Vector3( 0.35, 0.35, 0.35 ), new THREE.Vector3( 0.7, 0.7, 0.7 ) ] ),

		particleReleaseRate : 200,
		particleLifeSpan : 4.0,		
		emitterDeathAge : 60
	},

    Flame :
	{
		initialPositionRangeType : ParticleSystem.RangeType.Sphere,
		initialPositionOffset : new THREE.Vector3( 0, 54 , 0 ),
		initialPositionRange : new THREE.Vector3( 2, 2, 2 ),
		
		initialVelocityRangeType : ParticleSystem.RangeType.Cube,
		initialVelocityOffset : new THREE.Vector3(0,1,0),
		initialVelocityRange : new THREE.Vector3(1,0,1),

		initialRotationOffset : -90,
		initialRotationRange : 0,

		particleAtlas : Atlas.createGridAtlas( THREE.ImageUtils.loadTexture( 'images/fireloop.png' ), 0.0, 1.0, 1.0, 0.0, 8.0, 8.0, false, true ),
		
		atlasFrameSet: new ParticleSystem.FrameSet( [0, 2], [0, 63] ),
		sizeFrameSet : new ParticleSystem.FrameSet( [ 0, 2], [ new THREE.Vector3( 70, 70 ), new THREE.Vector3( 70, 70 ) ] ),
		
		alphaFrameSet : new ParticleSystem.FrameSet( [0, 2], [1, 1] ),
		colorFrameSet : new ParticleSystem.FrameSet( [0, 2], [ new THREE.Vector3(1, 1, 1), new THREE.Vector3(1, 1, 1) ] ),
		blendStyle : THREE.AdditiveBlending,  
		
		particleReleaseRate : 0.5,
		particleLifeSpan : 2,		
		emitterDeathAge : 60
	}
	
}