/**
* @author Mark Kellogg
*/

//=======================================
// Particle system
//=======================================

function ParticleSystem( camera ) {
	
	this.camera = camera;

	this.zSort = false;

	this.releaseAtOnce = false;
	this.releaseAtOnceCount = 0.0;
	this.hasInitialReleaseOccurred = false;

	this.atlasFrameSet = undefined;
	this.colorFrameSet = undefined;
	this.alphaFrameSet = undefined;
	this.sizeFrameSet = undefined;	

	// Particle position and position modifiers (velocity and acceleration)
	this.initialPositionRangeType = ParticleSystem.RangeType.Cube;		
	this.initialPositionOffset = new THREE.Vector3();
	this.initialPositionRange = new THREE.Vector3();
	this.initialPositionRangeEdgeClamp = false;
	this.initialVelocityRangeType = ParticleSystem.RangeType.Cube;	
	this.initialVelocityOffset = new THREE.Vector3();
	this.initialVelocityRange = new THREE.Vector3(); 
	this.initialVelocityRangeEdgeClamp = false;	
	this.initialAccelerationOffset = new THREE.Vector3();
	this.initialAccelerationRange = new THREE.Vector3();	
	
	// Particle rotation and rotation modifiers (angulary velocity and angular acceleration)
	this.initialRotationOffset = 0;
	this.initialRotationRange = 0;
	this.initialAngularVelocityOffset = 0;
	this.initialAngularVelocityRange = 0;
	this.initialAngularAccelerationOffset = 0;
	this.initialAngularAccelerationRange = 0;		

	// blending style
	this.blendStyle = THREE.CustomBlending;
	this.blendSrc = THREE.SrcAlphaFactor;
	this.blendDst = THREE.OneMinusSrcAlphaFactor;
	this.blendEquation = THREE.AddEquation;

	this.particleReleaseRate = 100;
	this.particleLifeSpan = 1.0;
	this.averageParticleLifeSpan = 1.0;
	this.calculateAverageParticleLifeSpan();

	this.calculateMaxParticleCount();
	this.liveParticleCount = 0;	
	this.deadParticleCount = 0;
	this.liveParticleArray = [];	
	this.deadParticleArray = [];	

	this._tempParticleArray = [];

	this.timeSinceLastEmit = 0.0;	
	this.emitting = true;
	this.age = 0.0;	
	this.lifespan = 0;

	// temporary storage 
	this._tempVector3 = new THREE.Vector3();
	this._tempQuaternion = new THREE.Quaternion();
	this._tempMatrix4 = new THREE.Matrix4();
}

ParticleSystem.RangeType = Object.freeze( {

	Cube: 1, 
	Sphere: 2,
	Plane: 3 

} );

ParticleSystem.Constants = Object.freeze( {

	VerticesPerParticle: 6,
	DegreesToRadians: Math.PI / 180.0

} );

//=======================================
// Particle system shaders
//=======================================

ParticleSystem.ParticleVertexShader = [

	"attribute vec3 particleColor;",
	"attribute float particleAlpha;",
	"varying vec2 vUV;",
	"varying vec4 vColor;",
	"void main()",
	"{",
		"vColor = vec4(particleColor, particleAlpha);",	
		"vUV = uv;",		
		"vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );",   
		"gl_Position = projectionMatrix * mvPosition;",
	"}"

].join("\n");

ParticleSystem.ParticleFragmentShader = [

	"varying vec2 vUV;",
	"varying vec4 vColor;", 
	"uniform sampler2D texture;",	 
	"void main()", 
	"{", 
	    "vec4 textureColor = texture2D( texture,  vUV );",
		"gl_FragColor = vColor * textureColor;",    
	"}"

].join("\n");

//=======================================
// Particle system functions
//=======================================

ParticleSystem.prototype.calculateAverageParticleLifeSpan = function () {

	var total = 0.0;

	for (var i =0; i < 100; i ++ ) {

		total += this.particleLifeSpan;

	}

	total /= 100.0;

	this.averageParticleLifeSpan = total;

}

ParticleSystem.prototype.calculateMaxParticleCount = function () {

	if ( this.releaseAtOnce ) {

		this.maxParticleCount = this.releaseAtOnceCount;		

	} else {

		var minLifeSpan =  this.particleLifeSpan;
		if ( this.lifespan != 0 &&  this.lifespan  < minLifeSpan) minLifeSpan = this.lifespan;		
		this.maxParticleCount = Math.max( this.particleReleaseRate * minLifeSpan * 2, 1.0 );

	}

	this.vertexCount = this.maxParticleCount * ParticleSystem.Constants.VerticesPerParticle;

}

ParticleSystem.prototype.initializeGeometry = function () {

	this.particleGeometry = new THREE.BufferGeometry();
	var particleColor = new Float32Array( this.vertexCount * 4 );
	var particleAlpha = new Float32Array( this.vertexCount );
	var positions = new Float32Array( this.vertexCount * 3 );
	var uvs = new Float32Array( this.vertexCount * 2 );

	var particleColorAttribute = new THREE.BufferAttribute( particleColor, 4 );
	particleColorAttribute.setDynamic( true );
	this.particleGeometry.addAttribute( 'particleColor', particleColorAttribute );

	var particleAlphaAttribute = new THREE.BufferAttribute( particleAlpha, 1 );
	particleAlphaAttribute.setDynamic( true );
	this.particleGeometry.addAttribute( 'particleAlpha', particleAlphaAttribute );

	var positionAttribute = new THREE.BufferAttribute( positions, 3 );
	positionAttribute.setDynamic( true );
	this.particleGeometry.addAttribute( 'position', positionAttribute );

	var uvAttribute = new THREE.BufferAttribute( uvs, 2 );
	uvAttribute.setDynamic( true );
	this.particleGeometry.addAttribute( 'uv', uvAttribute );
	
}

ParticleSystem.prototype.initializeMaterial = function () {

	var depthTest = true;
	if( this.blendStyle == THREE.AdditiveBlending ) {

	//	depthTest = false;

	}

	this.particleMaterial = new THREE.ShaderMaterial( 
	{
		uniforms: 
		{
			texture:   { type: "t", value: this.particleAtlas.getTexture() },
		},

		vertexShader:   ParticleSystem.ParticleVertexShader,
		fragmentShader: ParticleSystem.ParticleFragmentShader,

		transparent: true,  
		alphaTest: 0.5, 

		blending: this.blendStyle, 
		blendSrc: this.blendSrc,
		blendSrc: this.blendSrc,
		blendEquation: this.blendEquation,

		//side: THREE.DoubleSide,
		//side: THREE.BackSide,

		depthTest: depthTest,
		depthWrite: false
	});

}

ParticleSystem.prototype.initializeParticleArray = function () {

	for ( var i = 0; i < this.maxParticleCount; i++ ) {

		var particle = this.createParticle();
		this.initializeParticle( particle );
		this.deadParticleArray[i] = particle;
	}

	this.liveParticleCount = 0;
	this.deadParticleCount = this.maxParticleCount;

	this.liveParticleArray.length = this.liveParticleCount;
	this.deadParticleArray.length = this.deadParticleCount;			
}

ParticleSystem.prototype.initializeMesh = function () {

	this.destroyMesh();

	this.particleMesh = new THREE.Mesh( this.particleGeometry, this.particleMaterial );
	this.particleMesh.dynamic = true;
	scene.add( this.particleMesh );

}

ParticleSystem.prototype.destroyMesh = function() {

	if( this.particleMesh ) {

		scene.remove( this.particleMesh );
		this.particleMesh = undefined;

	}

}

ParticleSystem.prototype.mergeParameters = function ( parameters ) {

	for ( var key in parameters ) {

		this[ key ] = parameters[ key ];

	}

}

ParticleSystem.prototype.initialize = function( parameters ) {
	
	this.atlasFrameSet = undefined;
	this.sizeFrameSet = undefined;
	this.colorFrameSet = undefined;
	this.alphaFrameSet = undefined;	
	
	if ( parameters ) {

		this.mergeParameters ( parameters );

	}

	if( !this.atlasFrameSet ) this.atlasFrameSet = new ParticleSystem.FrameSet();
	if( !this.sizeFrameSet ) this.sizeFrameSet = new ParticleSystem.FrameSet();
	if( !this.colorFrameSet ) this.colorFrameSet = new ParticleSystem.FrameSet();
	if( !this.alphaFrameSet ) this.alphaFrameSet = new ParticleSystem.FrameSet();

	this.liveParticleArray = [];
	this.timeSinceLastEmit = 0.0;
	this.age = 0.0;
	this.emitting = true;

	this.calculateAverageParticleLifeSpan();	
	this.calculateMaxParticleCount();
	this.initializeParticleArray();

	this.initializeGeometry();
	this.initializeMaterial();		
	this.updateAttributesWithParticleData();
	this.initializeMesh();
}

ParticleSystem.prototype.getCameraWorldAxes = function () {

	var quaternion = new THREE.Quaternion();

	return function getCameraWorldAxes( camera, axisX, axisY, axisZ ) {

		camera.getWorldQuaternion( quaternion );
		axisZ.set( 0, 0, 1 ).applyQuaternion( quaternion );
		axisY.set( 0, 1, 0 ).applyQuaternion( quaternion );
		axisX.crossVectors( axisY, axisZ );

	}

}();

ParticleSystem.prototype.generateXYAlignedQuadForParticle = function () {

	var vectorX = new THREE.Vector3();
	var vectorY = new THREE.Vector3();

	return function generateXYAlignedQuadForParticle( particle, axisX, axisY, axisZ, pos1, pos2, pos3, pos4 ) {

		var position = particle.position;
		var rotation = particle.rotation;

		vectorX.copy( axisX );
		vectorY.copy( axisY );

		vectorX.multiplyScalar( Math.cos( rotation * ParticleSystem.Constants.DegreesToRadians ) );
		vectorY.multiplyScalar( Math.sin( rotation * ParticleSystem.Constants.DegreesToRadians ) );

		vectorX.addVectors( vectorX, vectorY );
		vectorY.crossVectors( axisZ, vectorX );

		vectorX.multiplyScalar( particle.size.x );
		vectorY.multiplyScalar( particle.size.y );
		
		pos1.subVectors( position, vectorX ).addVectors( pos1, vectorY );
		pos2.subVectors( position, vectorX ).subVectors( pos2, vectorY );
		pos3.addVectors( position, vectorX ).subVectors( pos3, vectorY );
		pos4.addVectors( position, vectorX ).addVectors( pos4, vectorY );

	}

}();
	
ParticleSystem.prototype.updateAttributesWithParticleData = function () {

	var vectorY = new THREE.Vector3();
	var vectorX = new THREE.Vector3();
	var vectorZ = new THREE.Vector3();

	var quadPos1 = new THREE.Vector3();
	var quadPos2 = new THREE.Vector3();
	var quadPos3 = new THREE.Vector3();
	var quadPos4 = new THREE.Vector3();

	return function updateAttributesWithParticleData() {

		this.getCameraWorldAxes( this.camera, vectorX, vectorY, vectorZ );

		for (var p = 0; p < this.liveParticleCount; p++) {

			var particle = this.liveParticleArray[ p ];
			var position = particle.position;
			var rotation = particle.rotation;

			this.generateXYAlignedQuadForParticle( particle, vectorX, vectorY, vectorZ, quadPos1, quadPos2, quadPos3, quadPos4 );

			var baseIndex = p * ParticleSystem.Constants.VerticesPerParticle;

			var attributePosition = this.particleGeometry.getAttribute( 'position' );
			this.updateAttributeVector3( attributePosition, baseIndex, quadPos1 );
			this.updateAttributeVector3( attributePosition, baseIndex + 1, quadPos2 );
			this.updateAttributeVector3( attributePosition, baseIndex + 2, quadPos4 );
			this.updateAttributeVector3( attributePosition, baseIndex + 3, quadPos2 );
			this.updateAttributeVector3( attributePosition, baseIndex + 4, quadPos3 );
			this.updateAttributeVector3( attributePosition, baseIndex + 5, quadPos4 );

			var imageDesc = this.particleAtlas.getImageDescriptor( particle.atlasIndex );

			var attributeUV = this.particleGeometry.getAttribute( 'uv' );
			this.updateAttributeVector2XY( attributeUV, baseIndex, imageDesc.left, imageDesc.top );
			this.updateAttributeVector2XY( attributeUV, baseIndex + 1, imageDesc.left, imageDesc.bottom );
			this.updateAttributeVector2XY( attributeUV, baseIndex + 2, imageDesc.right, imageDesc.top );
			this.updateAttributeVector2XY( attributeUV, baseIndex + 3, imageDesc.left, imageDesc.bottom );
			this.updateAttributeVector2XY( attributeUV, baseIndex + 4, imageDesc.right, imageDesc.bottom );
			this.updateAttributeVector2XY( attributeUV, baseIndex + 5, imageDesc.right, imageDesc.top );

			var color = particle.color;
			var alpha = particle.alpha;

			var attributeColor = this.particleGeometry.getAttribute( 'particleColor' );
			var attributeAlpha = this.particleGeometry.getAttribute( 'particleAlpha' );
			for(var i =0; i < ParticleSystem.Constants.VerticesPerParticle; i++ ) {

				var index = baseIndex + i;

				this.updateAttributeColor( attributeColor, index, color );
				this.updateAttributeScalar( attributeAlpha, index, alpha );
			}

		}

		this.particleGeometry.setDrawRange( 0, ParticleSystem.Constants.VerticesPerParticle * this.liveParticleCount );

	}

}();

ParticleSystem.prototype.updateAttributeVector2XY = function ( attribute, index, x, y ) {

	attribute.array[ index * 2 ] = x;
	attribute.array[ index * 2 + 1 ] = y;
	attribute.needsUpdate = true;

}

ParticleSystem.prototype.updateAttributeVector3 = function ( attribute, index, value ) {

	attribute.array[ index * 3 ] = value.x;
	attribute.array[ index * 3 + 1 ] = value.y;
	attribute.array[ index * 3 + 2 ] = value.z;	
	attribute.needsUpdate = true;

}

ParticleSystem.prototype.updateAttributeColor = function ( attribute, index, value ) {

	attribute.array[ index * 4 ] = value.r;
	attribute.array[ index * 4 + 1 ] = value.g;
	attribute.array[ index * 4 + 2 ] = value.b;
	attribute.array[ index * 4 + 3 ] = value.a;	
	attribute.needsUpdate = true;

}

ParticleSystem.prototype.updateAttributeScalar = function ( attribute, index, value ) {

	attribute.array[ index ] = value;	
	attribute.needsUpdate = true;

}

ParticleSystem.prototype.getRandomScalar = function( base, range ) {

	return base + range * (Math.random() - 0.5);

}

ParticleSystem.prototype.getRandomVector3Cube = function( vector, offset, range, edgeClamp ) {

	vector.set( Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5 );

	if ( edgeClamp ) {

		var max = Math.max ( vector.x, Math.max ( vector.y, vector.z ) );
		vecotr.multiplyScalar( 1.0 / max );

	}

	vector.multiplyVectors( range, vector );	
	vector.addVectors( offset, vector );

	return vector;

}

ParticleSystem.prototype.getRandomVector3Sphere = function( vector, offset, range, edgeClamp ) {

	var x = Math.random() - 0.5;
	var y = Math.random() - 0.5;
	var z = Math.random() - 0.5;

	vector.set( x, y, z );
	vector.normalize().multiplyVectors( vector, range );
	
	if ( ! edgeClamp ) {

		var adjust =  Math.random() * 2.0 - 1.0;
		vector.multiplyScalar( adjust );
	}

	vector.addVectors(vector, offset );

	return vector;

}

ParticleSystem.prototype.createParticle = function() {

	var particle = new ParticleSystem.Particle();	
	return particle;

}

ParticleSystem.prototype.initializeParticle = function( particle ) {

	 

}

ParticleSystem.prototype.resetParticle = function( particle ) {

	particle.size.set( 0, 0 );
	particle.color.set( 0, 0, 0 );
	particle.alpha = 1.0;			
	particle.age = 0;
	this.atlasIndex = 0;
	particle.alive = 0; 

	this.resetParticlePositionData( particle );
	this.resetParticleRotationData( particle );	

}

ParticleSystem.prototype.resetParticlePositionData = function( particle ) {

	if (this.initialPositionRangeType == ParticleSystem.RangeType.Cube) {

		this.getRandomVector3Cube( particle.position, this.initialPositionOffset, this.initialPositionRange,  this.initialPositionRangeEdgeClamp ); 

	} else if (this.initialPositionRangeType == ParticleSystem.RangeType.Sphere)	{

		this.getRandomVector3Sphere( particle.position, this.initialPositionOffset, this.initialPositionRange,  this.initialPositionRangeEdgeClamp );

	}
		
	if ( this.initialVelocityRangeType == ParticleSystem.RangeType.Cube ) {

		this.getRandomVector3Cube( particle.velocity, this.initialVelocityOffset, this.initialVelocityRange, this.initialVelocityRangeEdgeClamp ); 

	} else 	if ( this.initialVelocityRangeType == ParticleSystem.RangeType.Sphere ) {

		this.getRandomVector3Sphere( particle.velocity, this.initialVelocityOffset, this.initialVelocityRange, this.initialVelocityRangeEdgeClamp );
		
	}
	
	this.getRandomVector3Cube( particle.acceleration, this.initialAccelerationOffset, this.initialAccelerationRange ); 

}

ParticleSystem.prototype.resetParticleRotationData = function( particle ) {

	particle.rotation  = this.getRandomScalar( this.initialRotationOffset, this.initialRotationRange );
	particle.angularVelocity = this.getRandomScalar( this.initialAngularVelocityOffset, this.initialAngularVelocityRange );
	particle.angularAcceleration = this.getRandomScalar( this.initialAngularAccelerationOffset, this.initialAngularAccelerationRange );

}

ParticleSystem.prototype.advanceParticle = function( particle, deltaTime ) {

	particle.age += deltaTime;

	if ( this.atlasFrameSet.timeFrames.length > 0 ) {

		var index = this.atlasFrameSet.interpolateFrameValuesScalar( particle.age );
		particle.atlasIndex = Math.floor(index);

	}

	if ( this.sizeFrameSet.timeFrames.length > 0 ) {

		this.sizeFrameSet.interpolateFrameValuesVector( particle.age, particle.size );

	}
				
	if ( this.colorFrameSet.timeFrames.length > 0 )	{

		this.colorFrameSet.interpolateFrameValuesVector( particle.age, particle._tempVector3 );
		particle.color.setRGB( particle._tempVector3.x, particle._tempVector3.y, particle._tempVector3.z );

	}
	
	if ( this.alphaFrameSet.timeFrames.length > 0 ) {

		particle.alpha = this.alphaFrameSet.interpolateFrameValuesScalar( particle.age );

	}

	particle._tempVector3.copy( particle.velocity );
	particle._tempVector3.multiplyScalar(deltaTime);
	particle.position.add( particle._tempVector3 );

	particle._tempVector3.copy( particle.acceleration );
	particle._tempVector3.multiplyScalar(deltaTime);
	particle.velocity.add( particle._tempVector3 );
	
	particle.rotation  += particle.angularVelocity * deltaTime;
	particle.angularVelocity += particle.angularAcceleration * deltaTime;

}

ParticleSystem.prototype.advanceParticles = function( deltaTime ) {

	var deadCount = 0;

	for (var i = 0; i < this.liveParticleCount; i++)
	{
		this.advanceParticle(this.liveParticleArray[i], deltaTime );

		if ( this.liveParticleArray[i].age > this.particleLifeSpan ) 
		{
			this.killParticle( this.liveParticleArray[i] );
			deadCount++;
		}	
	}

	if ( deadCount > 0 ) {

		this.cleanupDeadParticles();
	}	

}

ParticleSystem.prototype.killParticle = function( particle ) {

	particle.alive = 0.0;

}

ParticleSystem.prototype.activateParticle = function( particle ) {

	this.resetParticle( particle );
	particle.alive = 1.0;

}

ParticleSystem.prototype.cleanupDeadParticles = function () {

	var topAlive = this.liveParticleCount - 1;
	var bottomDead = 0;
	while ( topAlive > bottomDead ) {

		while( this.liveParticleArray[ topAlive ].alive == 0.0 && topAlive > 0) {

			topAlive --;

		}

		while( this.liveParticleArray[ bottomDead ].alive == 1.0 && bottomDead < this.liveParticleCount - 1) {

			bottomDead ++;

		}

		if ( topAlive <= bottomDead ) {

			break;

		}
		
		var swap = this.liveParticleArray[ bottomDead ];
		this.liveParticleArray[ bottomDead ] = this.liveParticleArray[ topAlive ];
		this.liveParticleArray[ topAlive ] = swap;

	}

	while ( this.liveParticleCount > 0 && this.liveParticleArray[ this.liveParticleCount - 1].alive == 0.0 ) {

		this.deadParticleArray[ this.deadParticleCount ] = this.liveParticleArray[ this.liveParticleCount - 1];
		this.deadParticleCount++;	
		this.liveParticleCount--;

	}

	this.liveParticleArray.length = this.liveParticleCount;
	this.deadParticleArray.length = this.deadParticleCount;	

}

ParticleSystem.prototype.sortParticleArray = function () {

	function numericalSort ( a, b ) {

		return a[ 0 ] - b[ 0 ];

	};

	var _sortParticleArray = [];
	var projectedPosition = new THREE.Vector3();

	return function sortParticleArray( mvpMatrix ) {

		for ( var p = 0; p < this.liveParticleCount; p ++ ) {

			var position = this.liveParticleArray[ p ].position;
			projectedPosition.copy( position );
			projectedPosition.applyProjection( mvpMatrix );

			if( !_sortParticleArray[ p ] ) {

	 			_sortParticleArray[ p ] = [ 0, 0 ];

			}

			_sortParticleArray[ p ][0] = projectedPosition.z;
			_sortParticleArray[ p ][1] = p;

		}

		_sortParticleArray.length = this.liveParticleCount;
		_sortParticleArray.sort( numericalSort );

		for ( p = 0; p < this.liveParticleCount; p ++ ) {

			var originalIndex = _sortParticleArray[ p ][ 1 ];
			this._tempParticleArray[ p ] =  this.liveParticleArray[ originalIndex ];

		}

		this._tempParticleArray.length = this.liveParticleCount;

		var temp = this.liveParticleArray;
		this.liveParticleArray = this._tempParticleArray;
		this._tempParticleArray = temp;	

	}

}();

ParticleSystem.prototype.activateParticles = function( count ) {

	for (var i = 0; i < count; i++) {

		if ( this.liveParticleCount < this.maxParticleCount && this.deadParticleCount > 0 ) {

			var newParticle = this.deadParticleArray[ this.deadParticleCount - 1 ];
			this.liveParticleArray[ this.liveParticleCount ] = newParticle;	
			this.deadParticleCount--;		
			this.liveParticleCount++;

			this.activateParticle ( newParticle );

		} else {

			break;

		}

	}

	this.liveParticleArray.length = this.liveParticleCount;
	this.deadParticleArray.length = this.deadParticleCount;
}

ParticleSystem.prototype.update = function() {

	var tempMatrix4 = new THREE.Matrix4();

	return function update( deltaTime ) {

		if ( !this.emitting ) return;

		this.timeSinceLastEmit += deltaTime;

		if ( this.releaseAtOnce ) {

			var waitTime = this.averageParticleLifeSpan;

			if ( ! this.hasInitialReleaseOccurred || ( this.timeSinceLastEmit > waitTime && this.liveParticleCount <= 0 ) ) {

				this.activateParticles( this.maxParticleCount );
				this.timeSinceLastEmit = 0.0;
				this.hasInitialReleaseOccurred = true;

			}		

		} else {

			var emitUnitTime = 1.0 / this.particleReleaseRate;
			if( ! this.hasInitialReleaseOccurred || this.timeSinceLastEmit > emitUnitTime ) {
				  
				var releaseCount = Math.max( 1, Math.floor( this.timeSinceLastEmit / emitUnitTime ) );
				this.activateParticles( releaseCount );	
				this.timeSinceLastEmit = 0.0;
				this.hasInitialReleaseOccurred = true;

			}

		}

		this.advanceParticles(deltaTime);

		if ( this.zSort ) {

			this.camera.updateMatrixWorld();
			tempMatrix4.copy( this.camera.matrixWorld );
			tempMatrix4.getInverse( tempMatrix4 );
			this.sortParticleArray( tempMatrix4 );

		}

		this.updateAttributesWithParticleData();	

		this.age += deltaTime;
		if ( this.lifespan != 0 && this.age > this.lifespan ) {
			
			 this.emitting = false;

		} 

	}
	
}();

ParticleSystem.prototype.destroy = function() {

    this.destroyMesh();

}

//=======================================
// Particle system frame set
//=======================================

ParticleSystem.FrameSet = function ( timeFrames, valueFrames ) {

	this.timeFrames = timeFrames || [];
	this.valueFrames = valueFrames || [];

}

ParticleSystem.FrameSet.prototype.findNextFrameForTimeValue = function( t ) {

	var frameIndex = 0;
	while( frameIndex < this.timeFrames.length && this.timeFrames[ frameIndex ] < t ) {

		frameIndex = frameIndex + 1;

	}

	return frameIndex;
}

ParticleSystem.FrameSet.prototype.lerpScalar = function( a, b, f ) {

	return a + f * ( b - a );

}

ParticleSystem.FrameSet.prototype.calculateFraction = function( a, b, z ) {

	return ( z - a ) / ( b - a );

}

ParticleSystem.FrameSet.prototype.interpolateFrameValuesScalar = function( t ) {

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


ParticleSystem.FrameSet.prototype.interpolateFrameValuesVector = function( t, target ) {

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

//=======================================
// Particle object
//=======================================

ParticleSystem.Particle = function () {

	this.size = new THREE.Vector2();
	this.color = new THREE.Color();
	this.alpha = 1.0;			
	this.age = 0;
	this.atlasIndex = 0;
	this.alive = 0; 

	this.position = new THREE.Vector3();
	this.velocity = new THREE.Vector3(); 
	this.acceleration = new THREE.Vector3();

	this.rotation = 0;
	this.angularVelocity = 0; 
	this.angularAcceleration = 0;

	this._tempVector3 = new THREE.Vector3();

}

