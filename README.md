# JavaScript Particle System

Basic particle system for the Three.js 3D graphics library implemented in JavaScript. Three.js does not currently have an official particle system implementation, so I set out to create one myself. My implementation exposes typical physical attributes for each particle as well as "Modifiers", which vary the values of those attributes over the lifetime of the particle: 

  - Position
  - Velocity
  - Acceleration
  - Rotation
  - Rotational speed
  - Rotational acceleration
        
Additionally attributes such as color, size, and opacity are exposed and can be customized. The current implementation also supports the concept of a texture atlas (spritesheet) so particle textures can be animated.

The current version produces 3D geometry for each particle by creating a quad for each and orienting the quad so that its normal is parallel to the camera's normal (but pointing in the opposite direction).

The repository includes a demo page (index.html) that demonstrates how to define and initialize particle systems.

**Demo:** The particle system can be seen in action [here](http://www.markkellogg.org/ParticleSystemJS/).

# Sample code

This example sets up a fire simulation particle system using an atlas:

```javascript
// define the particle system's parameters
var particleSystemParams = {

  // create and assign a texture atlas
  particleAtlas : Atlas.createGridAtlas( THREE.ImageUtils.loadTexture( 'images/fireloop3.jpg' ), 0.0, 1.0, 1.0, 0.0, 8.0, 8.0, false, true ),
  
  // tell the particle system how to interpolate the atlas frame indices
  atlasFrameSet : new Particles.FrameSet( [0, 3], [0, 63], true ),
  
  // tell the particle system how to interpolate particle size
  sizeFrameSet  : new Particles.FrameSet( [ 0, 3], [ new THREE.Vector3( 20, 25 ), new THREE.Vector3( 20, 25 ) ], false ),
  
  // tell the particle system how to interpolate particle opacity
  alphaFrameSet : new Particles.FrameSet( [0, 0.2, 1.2, 2.0, 3], [ 0, .3, 1, 1, 0], true),
  
  // tell the particle system how to interpolate particle color
  colorFrameSet : new Particles.FrameSet( [0, 3], [ new THREE.Vector3(1.4, 1.4, 1.4), new THREE.Vector3(1.4, 1.4, 1.4) ], false ),
  
  // set the blending style
  blendStyle : THREE.AdditiveBlending,  
  
  // set number of particles released per second
  particleReleaseRate : 3,
  
  // set particle life-span
  particleLifeSpan : 3,		
  
  // set particle system life-span
  lifespan : 0

};

// create and initialize the particle system
var particleSystem = new Particles.ParticleSystem();
particleSystem.initialize( camera, particleSystemParams );

// set up a modifier that runs once when the particle is initialized to randomize the initial position
particleSystem.bindModifier( 'position', new Particles.RandomModifier( 
{ 
	isScalar: false, 
	offset: new THREE.Vector3( 0,  7, 0 ), 
	range: new THREE.Vector3( 3, 0, 3 ), 
	rangeEdgeClamp: false, 
	rangeType: Particles.RangeType.Sphere, 
	runOnce: true
} ) );

// set up a modifier that runs once when the particle is initialized to randomize the initial velocity
particleSystem.bindModifier( 'velocity', new Particles.RandomModifier( 
{ 
	isScalar: false, 
	offset: new THREE.Vector3( 0, 25, 0 ), 
	range: new THREE.Vector3( 10, 2, 10 ), 
	rangeEdgeClamp: false, 
	rangeType: Particles.RangeType.Sphere, 
	runOnce: true
} ) );

// start the particle system
particleSystem.activate();
```
