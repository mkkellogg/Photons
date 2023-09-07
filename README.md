# Photons - JavaScript Particle System

<br />
!! <b>Deprecated</b> !!

This library is now deprecated in order to focus on my new particle system, Photons 2 (https://github.com/mkkellogg/Photons2)

<br />
Basic particle system for the Three.js 3D graphics library implemented in JavaScript. Three.js does not currently have an official particle system implementation, so this is meant to be a general purpose extendable particle system for it.

This implementation exposes typical physical attributes for each particle: 

  - Position
  - Velocity
  - Acceleration
  - Rotation
  - Rotational speed
  - Rotational acceleration
        
This implementation also exposes display attributes:

  - Color
  - Size
  - Opacity 
  - Texture

A "Modifier" can be assigned to each of the attributes mentioned above to vary the value for it over the lifetime of the particle.

The current implementation also supports the concept of a texture atlas (spritesheet) so particle textures can be animated.

The current version produces 3D geometry for each particle by creating a quad for each and orienting the quad so that its normal is parallel to the camera's normal (but pointing in the opposite direction).

The repository includes a demo page (index.html) that demonstrates how to define and initialize particle systems.

**Demo:** The particle system can be seen in action [here](http://projects.markkellogg.org/threejs/demo_particle_system.php).

# Sample code

This example sets up a fire simulation particle system using an atlas:

```javascript
var _TPSV = PHOTONS.SingularVector;

// create a material for the particle system
var flameMaterial = PHOTONS.ParticleSystem.createMaterial();
flameMaterial.blending = THREE.AdditiveBlending;

// define the particle system's parameters
var particleSystemParams = {

	material: flameMaterial,
	particleAtlas : PHOTONS.Atlas.createGridAtlas( THREE.ImageUtils.loadTexture( 'textures/campfire/fireloop3.jpg' ), 0.0, 1.0, 1.0, 0.0, 8.0, 8.0, false, true ),
	particleReleaseRate : 3,
	particleLifeSpan : 3,
	lifespan : 0

};

// create and initialize the particle system
var particleSystem = new PHOTONS.ParticleSystem();
particleSystem.initialize( camera, particleSystemParams );

// set up a modifier that interpolates atlas indices
particleSystem.bindModifier( "atlas", new PHOTONS.EvenIntervalIndexModifier ( 64 ) );

// set up a modifier that interpolates particle size over a set of key frames
particleSystem.bindModifier( "size", new PHOTONS.FrameSetModifier(
	new PHOTONS.FrameSet(
		[ 0, 3 ],
		[ new THREE.Vector3( 20, 25 ),
		new THREE.Vector3( 20, 25 ) ],
		false )
) );

// set up a modifier that interpolates particle opacity over a set of key frames
particleSystem.bindModifier( "alpha", new PHOTONS.FrameSetModifier(
	new PHOTONS.FrameSet(
		[ 0, 0.2, 1.2, 2.0, 3 ],
		[ new _TPSV( 0 ), new _TPSV( 0.3 ), new _TPSV( 1 ), new _TPSV( 1 ), new _TPSV( 0 ) ],
		true )
) );

// set up a modifier that interpolates particle color over a set of key frames
particleSystem.bindModifier( "color", new PHOTONS.FrameSetModifier(
	new PHOTONS.FrameSet(
		[ 0, 3 ],
		[ new THREE.Vector3( 1.4, 1.4, 1.4 ),
		new THREE.Vector3( 1.4, 1.4, 1.4 ) ],
		false )
) );

// set up a modifier that runs once when the particle is initialized to randomize the initial position
particleSystem.bindInitializer( 'position', new PHOTONS.RandomModifier(
	{
		offset: new THREE.Vector3( 0, 0, 0 ),
		range: new THREE.Vector3( 0, 0, 0 ),
		rangeEdgeClamp: false,
		rangeType: PHOTONS.RangeType.Sphere
	} ) );

// set up a modifier that runs once when the particle is initialized to randomize the initial velocity
particleSystem.bindInitializer( 'velocity', new PHOTONS.RandomModifier(
	{
		offset: new THREE.Vector3( 0, 25, 0 ),
		range: new THREE.Vector3( 10, 2, 10 ),
		rangeEdgeClamp: false,
		rangeType: PHOTONS.RangeType.Sphere
	} ) );

// start the particle system
particleSystem.activate();
```
