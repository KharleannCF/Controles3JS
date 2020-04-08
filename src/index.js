/*
 Dependencies Webpack  and threeJS, npm install webpack webpack-cli,
 npm install threeJS, npm install camera-controls
 npm run-script build to compile, work on this file.
 dont change package.json
 Camera-controls Documentation https://github.com/yomotsu/camera-controls

 */


const THREE = require('three');
import CameraControls from 'camera-controls';

CameraControls.install({THREE : THREE});

const canvas = document.getElementById('canvas');

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.01, 1500 );
camera.position.set(0, 0, 0,);

//Audio
const listener = new THREE.AudioListener();
camera.add(listener);
const audioSong = 'cancion.mp3';
const sound = new THREE.PositionalAudio(listener);
const audioLoader = new THREE.AudioLoader();

//utils
const Pi = Math.PI/180;
const stars = [];
//movement utils
const direction = new THREE.Vector3(0,0,0);
let jumpSpeed = 0;
let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let moveUp = false;
let moveDown = false;
let canJump = false;
let canFly = false;
const raycaster = new THREE.Raycaster(new THREE.Vector3(0,0,0), new THREE.Vector3(0,-1,0),0,2);

//elements that interfere with movement
const interactiveElements = [];


const renderer = new THREE.WebGLRenderer({canvas});
renderer.shadowMap.enabled = true;

//meshes
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
		star.position.distanceTo(new THREE.Vector3(0,0,0)) > 1500){
		star.position.x = (Math.random()*(1499 - 1000) + 1000) * (Math.random() * 2 - 1);
		star.position.y = Math.random()*1499;
		star.position.z = (Math.random()*(1499 - 1000) + 1000) * (Math.random() * 2 - 1);
	}
	if (Math.random()<0.1){
	stars.push(star);	
	}
	scene.add(star)
}

//Sound point origin
const soundSphere = new THREE.Mesh( new THREE.SphereGeometry(2,16,16),
									new THREE.MeshPhongMaterial({color: 0x0, 
									specular:0xFFFFFF, shininess: 100, opacity:0.3, transparent: true}));
soundSphere.position.y = 30;
const soundSphere2 = new THREE.Mesh(new THREE.SphereGeometry(1,16,16),
									new THREE.MeshPhongMaterial({color: 0x0F0F6F, specular:0x0F0F6F}));
soundSphere2.position.y = 30;

scene.add(soundSphere);
scene.add(soundSphere2);
soundSphere.add(sound);

scene.add(spaceRotation);

//Ground
let geoFloor = new THREE.BoxGeometry( 500, 1, 500 );
let matStdFloor = new THREE.MeshLambertMaterial( { color: 0x808080 } );
let mshStdFloor = new THREE.Mesh( geoFloor, matStdFloor );
mshStdFloor.receiveShadow = true;

mshStdFloor.position.set(0,-0.5,0);
interactiveElements.push(mshStdFloor);
scene.add( mshStdFloor );

//little cube that you can step on
geoFloor = new THREE.BoxGeometry( 4, 4, 4 );
matStdFloor = new THREE.MeshBasicMaterial( { color: 0x808010 } );
mshStdFloor = new THREE.Mesh( geoFloor, matStdFloor );
mshStdFloor.receiveShadow = true;
mshStdFloor.position.set(5,2,4);

interactiveElements.push(mshStdFloor);
scene.add( mshStdFloor );

//middle cube that you can step on
geoFloor = new THREE.BoxGeometry( 8, 8, 8 );
matStdFloor = new THREE.MeshBasicMaterial( { color: 0x8F501F } );
mshStdFloor = new THREE.Mesh( geoFloor, matStdFloor );
mshStdFloor.receiveShadow = true;
mshStdFloor.position.set(5,4,10);

interactiveElements.push(mshStdFloor);
scene.add( mshStdFloor );

//big cube that you can step on
geoFloor = new THREE.BoxGeometry( 12, 12, 8 );
matStdFloor = new THREE.MeshBasicMaterial( { color: 0x605F0F } );
mshStdFloor = new THREE.Mesh( geoFloor, matStdFloor );
mshStdFloor.receiveShadow = true;
mshStdFloor.position.set(5,6,18);

interactiveElements.push(mshStdFloor);
scene.add( mshStdFloor );

//Lights


//general light
const directLight = new THREE.DirectionalLight(0xFFFFFF, 0.3);
directLight.position.set(0,10,0);
directLight.lookAt(0,1,0);
directLight.castShadow = true;
scene.add(directLight);

//light for soundSphere
const lightPoint2 = new THREE.SpotLight(0xFFFFFF, 1);
lightPoint2.position.set(0,30,-30);
lightPoint2.target = soundSphere2;
lightPoint2.castShadow = true;
scene.add(lightPoint2);


//Camera controls

const clock = new THREE.Clock();
const cameraControls = new CameraControls( camera, renderer.domElement );
cameraControls.setLookAt( 10, 2, 1, 10.1, 1.9, 1.1, false );
cameraControls.maxDistance = 0.1;
cameraControls.minDistance = 0;
cameraControls.truckSpeed = 2.0;
cameraControls.colliderMeshes = interactiveElements.slice(0,interactiveElements.length - 1);



//movements


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
			if ( canJump ) {
				jumpSpeed = 1;
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
	spaceRotation.rotation.y = time;

	stars.forEach(function (star){
 		star.material.emissive = new THREE.Color().setHex(0xFFFFFF * Math.random());
	});

	const delta = clock.getDelta();

	//Render movements

	//ground collider
	raycaster.ray.origin.copy(cameraControls.getTarget());
	raycaster.ray.origin.y -=1.1; //Target Y coordinate
  	let intersection = raycaster.intersectObjects(interactiveElements);
	let onObject = intersection.length > 0;




 	direction.z = Number(moveForward) -Number(moveBackward);
  	direction.x = Number(moveRight) - Number(moveLeft);
  	direction.y = Number(moveUp) - Number(moveDown);
  	jumpSpeed = (canFly) ? 0 : jumpSpeed - ( 10 * 0.05* delta); //Gravity * weight * Delta for performance
  	direction.normalize();

  	if (moveForward || moveBackward) {
  		cameraControls.forward(10*delta*direction.z,true);
  	}
  	if (moveLeft || moveRight) {
	  	cameraControls.truck(10*delta*direction.x,0,true);
  	}
  	if(!canFly){
	  	if (onObject){
	  		
	  		jumpSpeed = Math.max(0,jumpSpeed);
	  		canJump = jumpSpeed <=0;
	  	}
	  	cameraControls.truck(0,-5*jumpSpeed*delta,true);
	}else {
		if (moveUp || moveDown) {
			console.log(cameraControls.camera.position);
			cameraControls.truck(0,-10*delta*direction.y,true);
  		}

	}

  		

  	if ( cameraControls.update(delta)){
  		camera.updateProjectionMatrix();
  		renderer.render(scene,camera);
  	}


	if (resizeRendererToDisplaySize(renderer)){
			const canvas = renderer.domElement;
			camera.aspect = canvas.clientWidth / canvas.clientHeight;
			camera.updateProjectionMatrix();
		}
	renderer.render(scene, camera);
	requestAnimationFrame(render);
}
requestAnimationFrame(render);