//Dependencies Webpack  and threeJS, npm install webpack webpack-cli, npm install threeJS
// npm run-script build to compile, work on this file.
// dont change package.json


const THREE = require('three');


//Orbit controls
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

//Keyboard controls
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';


const canvas = document.getElementById('canvas');

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 2000 );

//Audio
const listener = new THREE.AudioListener();
camera.add(listener);
const audioSong = 'cancion.mp3';
const sound = new THREE.PositionalAudio(listener);
const audioLoader = new THREE.AudioLoader();




//utils
const Pi = Math.PI/180;
const stars = [];

//elements that interfere with movement
const interactiveElements = [];


//mouse catcher
const raycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0,-1,0),0,10);


const renderer = new THREE.WebGLRenderer({canvas});
renderer.shadowMap.enabled = true;





camera.position.set(0,2,-30);
camera.lookAt(0,0,0);
camera.updateProjectionMatrix();

//Rotation space, cubes will be here
const spaceRotation = new THREE.Object3D();

//Random cube generator
for (let i = 0; i < 200; i++) {
	let color = new THREE.Color(0xFFFFFF);
	color.setHex(Math.random() * 0xFFFFFF);
	let cubeMat = new THREE.MeshLambertMaterial({color: color, reflectivity: 1});
	let cubeGeo = new THREE.BoxGeometry(1,1,1);
	let cube = new THREE.Mesh(cubeGeo,cubeMat);
	cube.rotation.x = Math.random()*90*Pi;
	cube.rotation.y = Math.random()*90*Pi;
	cube.rotation.z = Math.random()*90*Pi;
	cube.position.x = Math.random()*400 * (Math.random() * 2 - 1);
	cube.position.y = Math.random()*20 + 2
	cube.position.z = Math.random()*400 * (Math.random() * 2 - 1);
	cube.castShadow = true;
	cube.receiveShadow = true;
	if (Math.random() < 0.25) {
		spaceRotation.add(cube);
	}else{
		scene.add(cube);
	}
}

//Stars Generator
for (let i = 0; i < 700; i++) {
	let color = new THREE.Color(0x000000);
	let starMat = new THREE.MeshLambertMaterial({color: color, emissive: 0xFFFFFF});
	let starGeo = new THREE.SphereGeometry(1.5,1,1);
	let star = new THREE.Mesh(starGeo,starMat);
	while (star.position.manhattanDistanceTo(new THREE.Vector3(0,0,0)) < 1000 ||
		star.position.distanceTo(new THREE.Vector3(0,0,0)) > 1999){
		star.position.x = (Math.random()*(1999 - 1000) + 1000) * (Math.random() * 2 - 1);
		star.position.y = Math.random()*1999;
		star.position.z = (Math.random()*(1999 - 1000) + 1000) * (Math.random() * 2 - 1);
	}
	if (Math.random()<0.1){
	stars.push(star);	
	}
	scene.add(star)
}

//Sound point origin
const soundSphere = new THREE.Mesh(new THREE.SphereGeometry(2,16,16),
	new THREE.MeshPhongMaterial({color: 0x0, specular:0xFFFFFF, shininess: 100, opacity:0.3, transparent: true}));
soundSphere.position.y = 30;
const soundSphere2 = new THREE.Mesh(new THREE.SphereGeometry(1,16,16),
	new THREE.MeshPhongMaterial({color: 0x0F0F6F, specular:0x0F0F6F}));
soundSphere2.position.y = 30;

soundSphere.castShadow=false;
soundSphere2.castShadow=false;


scene.add(soundSphere);
spaceRotation.add(soundSphere2);
soundSphere.add(sound);



scene.add(spaceRotation);

//Ground
let geoFloor = new THREE.BoxGeometry( 500, 0.1, 500 );
let matStdFloor = new THREE.MeshLambertMaterial( { color: 0x808080 } );
let mshStdFloor = new THREE.Mesh( geoFloor, matStdFloor );
mshStdFloor.receiveShadow = true;

mshStdFloor.position.set(0,0,0);
interactiveElements.push(mshStdFloor);
scene.add( mshStdFloor );

//little cube that you can step on
geoFloor = new THREE.BoxGeometry( 4, 4, 4 );
matStdFloor = new THREE.MeshBasicMaterial( { color: 0x808010 } );
mshStdFloor = new THREE.Mesh( geoFloor, matStdFloor );
mshStdFloor.receiveShadow = true;
mshStdFloor.position.set(5,2,4)

interactiveElements.push(mshStdFloor);
scene.add( mshStdFloor );

//middle cube that you can step on
geoFloor = new THREE.BoxGeometry( 8, 8, 8 );
matStdFloor = new THREE.MeshBasicMaterial( { color: 0x8F501F } );
mshStdFloor = new THREE.Mesh( geoFloor, matStdFloor );
mshStdFloor.receiveShadow = true;
mshStdFloor.position.set(5,4,10)

interactiveElements.push(mshStdFloor);
scene.add( mshStdFloor );

//big cube that you can step on
geoFloor = new THREE.BoxGeometry( 12, 16, 8 );
matStdFloor = new THREE.MeshBasicMaterial( { color: 0x605F0F } );
mshStdFloor = new THREE.Mesh( geoFloor, matStdFloor );
mshStdFloor.receiveShadow = true;
mshStdFloor.position.set(5,4,14)

interactiveElements.push(mshStdFloor);
scene.add( mshStdFloor );


//general light
const directLight = new THREE.DirectionalLight(0xFFFFFF, 0.3);
directLight.position.set(1,1,0);
directLight.lookAt(0,10,0);
directLight.castShadow = true;
scene.add(directLight);

/*
const lightPoint = new THREE.PointLight(0xFFFFFF,2,0,2);
lightPoint.position.set(0,30,0);
lightPoint.lookAt(0,0,0);
lightPoint.castShadow = true;
scene.add(lightPoint);
*/

const lightPoint2 = new THREE.SpotLight(0xFFFFFF, 1);
lightPoint2.position.set(0,25,-10);
lightPoint2.target = soundSphere2;
lightPoint2.castShadow = true;
scene.add(lightPoint2);


//Camera controls
/*
Primer intento, con controles orbitales por mouse
const controls = new OrbitControls( camera, renderer.domElement );
controls.maxPolarAngle = Math.PI * 0.7;
controls.minDistance = 0.1;
controls.maxDistance = 1000;
controls.enableDamping = true;
*/

//movements
let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let moveUp = false;
let moveDown = false;
let canJump = false;
let canFly = false;
let direction = new THREE.Vector3();
let velocity = new THREE.Vector3();
const controls = new PointerLockControls( camera, document.body );

scene.add(controls.getObject());
let onKeyDown = function ( event ) {
	switch ( event.keyCode ) {
		case 38: // up
		case 87: // w
			moveForward = true;
			break;
		case 37: // left
		case 65: // a
			moveLeft = true;
			break;
		case 40: // down
		case 83: // s
			moveBackward = true;
			break;
		case 39: // right
		case 68: // d
			moveRight = true;
			break;
		case 32: // space
			if ( canJump==true ) {
				velocity.y += 2;
			}
			canJump = false;
			break;
		case 81: //q
			moveUp = true;
			break;
		case 69: //e
			moveDown = true;
			break;
		case 70: //f
			canFly = !canFly;
			break;
		}
};

let onKeyUp = function ( event ) {
	switch ( event.keyCode ) {
		case 38: // up
		case 87: // w
			moveForward = false;
			break;
		case 37: // left
		case 65: // a
			moveLeft = false;
			break;
		case 40: // down
		case 83: // s
			moveBackward = false;
			break;
		case 39: // right
		case 68: // d
			moveRight = false;
			break;
		case 81: //q
			moveUp = false;
			break;
		case 69: //e
			moveDown = false;
			break;
		}
};

document.addEventListener( 'keydown', onKeyDown, false );
document.addEventListener( 'keyup', onKeyUp, false );




document.addEventListener( 'click', function () {
	//control getter
	controls.lock();

	//sound starter
	if (!sound.isPlaying){
		audioLoader.load( audioSong, function (buffer){
			sound.setBuffer(buffer);
			sound.setLoop(true);
			sound.setRefDistance(10);
			sound.autoplay = true;
			sound.play();
		});
	}

}, false );

//responsive function
function resizeRendererToDisplaySize(renderer) {
      const canvas = renderer.domElement;
      const pixelRatio = window.devicePixelRatio;
      const width  = canvas.clientWidth  * pixelRatio | 0;
      const height = canvas.clientHeight * pixelRatio | 0;
      const needResize = canvas.width !== width || canvas.height !== height;
      if (needResize) {
        renderer.setSize(width, height, false);
      }
      return needResize;
    }

function render(time) {
  time*=0.00025;


    if (controls.isLocked){

  	raycaster.ray.origin.copy(controls.getObject().position);
  	raycaster.ray.origin.y +=7.5;


  	let intersection = raycaster.intersectObjects(interactiveElements);
  	let onObject = intersection.length > 0;

  	let times = performance.now();
  	let delta = times/1000;

  	velocity.x = 0;	
 	velocity.z = 0;
 	velocity.y = (canFly) ? 0 : velocity.y - 9.8 * 0.025;

  	direction.z = Number(moveForward) - Number(moveBackward);
  	direction.x = Number(moveRight) - Number(moveLeft);
  	direction.y = Number(moveUp) - Number(moveDown);
  	direction.normalize();

  	if (moveForward || moveBackward) {
  		velocity.z -= direction.z*0.6;
  	}
  	if (moveLeft || moveRight) {
	  	velocity.x -= direction.x*0.6; ;
  	}
  	if ((moveUp || moveDown) && canFly) {
	  	velocity.y += direction.y*0.6; ;
  	}
  	if(!canFly){
	  	if (onObject){
	  		velocity.y = Math.max( 0, velocity.y);
	  		if (velocity.y <=0) {
	  			canJump = true;
	  		}
	  	}else {
	  		canJump = false;
	  	} 	
  	}else {
  		if(moveDown && onObject){
  			velocity.y = 0;
  			console.log("hola")
  		}
  	}
  		controls.moveRight(-velocity.x);
	  	controls.moveForward(-velocity.z);
	  	controls.getObject().position.y += (velocity.y);

/* Este condicional es para evitar una caida al vacio
  	if (controls.getObject().position.y < 2){
  		velocity.y = 0;
  		console.log(controls.getObject().position.y);
  		controls.getObject().position.y = 2;
  		canJump = true;
  	}
  */
	}

  spaceRotation.rotation.y = time;

  stars.forEach(function (star){
  	//star.rotation.y = time*Math.random()*0.001;
  	star.material.emissive = new THREE.Color().setHex(0xFFFFFF * Math.random());
  });



  if (resizeRendererToDisplaySize(renderer)) {
    const canvas = renderer.domElement;
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  }

  renderer.render(scene, camera);
 
  requestAnimationFrame(render);
}
requestAnimationFrame(render);