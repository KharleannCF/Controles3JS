//Dependencies Webpack  and threeJS, npm install webpack webpack-cli, npm install threeJS
// npm run-script build to compile, work on this file.
// dont change package.json


//Llamada de la librerias
const THREE = require('three');
//controles orbitales
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
//controles por teclado
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';
const canvas = document.getElementById('canvas');

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 30, window.innerWidth / window.innerHeight, 0.01, 1000 );

const Pi = Math.PI/180;

const renderer = new THREE.WebGLRenderer({canvas});
renderer.shadowMap.enabled = true;




camera.position.set(0,2,-10);
camera.lookAt(0,4,0);
camera.updateProjectionMatrix();

//espacio para los cubos que si rotan
const spaceRotation = new THREE.Object3D();

//generacion de los cubos aleatoria
for (let i = 0; i < 200; i++) {
	let color = new THREE.Color(0xFFFFFF);
	color.setHex(Math.random() * 0xFFFFFF);
	let cubeMat = new THREE.MeshPhongMaterial({color: color, reflectivity: 1});
	let cubeGeo = new THREE.BoxGeometry(1,1,1);
	let cube = new THREE.Mesh(cubeGeo,cubeMat);
	cube.rotation.x = Math.random()*90*Pi;
	cube.rotation.y = Math.random()*90*Pi;
	cube.rotation.z = Math.random()*90*Pi;
	cube.position.x = Math.random()*400 * (Math.random() * 2 - 1);
	cube.position.y = Math.random()*20
	cube.position.z = Math.random()*400 * (Math.random() * 2 - 1);
	cube.castShadow = true;
	cube.receiveShadow = true;
	if (Math.random() < 0.25) {
		spaceRotation.add(cube);
	}else{
		scene.add(cube);
	}
}
scene.add(spaceRotation);

//el piso
let geoFloor = new THREE.BoxGeometry( 500, 0.1, 500 );
let matStdFloor = new THREE.MeshLambertMaterial( { color: 0x808080 } );
let mshStdFloor = new THREE.Mesh( geoFloor, matStdFloor );
mshStdFloor.receiveShadow = true;
scene.add( mshStdFloor );


const directLight = new THREE.DirectionalLight(0xFFFFFF, 0.3);
directLight.position.set(1,1,0);
directLight.lookAt(0,0,0);
directLight.castShadow = true;
scene.add(directLight);

const lightPoint = new THREE.PointLight(0x330033,2,0,2);
lightPoint.position.set(0,40,100);
lightPoint.lookAt(0,0,0);
lightPoint.castShadow = true;
scene.add(lightPoint);


//Camera controls
/*
Primer intento, con controles orbitales por mouse
const controls = new OrbitControls( camera, renderer.domElement );
controls.maxPolarAngle = Math.PI * 0.7;
controls.minDistance = 0.1;
controls.maxDistance = 1000;
controls.enableDamping = true;
*/

//booleanos de movimientos
let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
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
		}
};

document.addEventListener( 'keydown', onKeyDown, false );
document.addEventListener( 'keyup', onKeyUp, false );
const raycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0,-1,0),0,10);


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

document.addEventListener( 'click', function () {

					controls.lock();

				}, false );

function render(time) {
  time*=0.00025;

  spaceRotation.rotation.y = time;

  raycaster.ray.origin.copy(controls.getObject().position);
  raycaster.ray.origin.y -=10;
  let intersection = raycaster.intersectObjects(mshStdFloor);
  let onObject = intersection.length > 0;
  let times = performance.now();
  let delta = times/1000;

  velocity.x =0;
  velocity.z =0;

  direction.z = Number(moveForward) - Number(moveBackward);
  direction.x = Number(moveRight) - Number(moveLeft);
  direction.normalize();

  if (moveForward || moveBackward) {
  	velocity.z -= direction.z;
  }
  if (moveLeft || moveRight) {
  	velocity.x -= direction.x ;
  }

  controls.moveRight(-velocity.x);
  controls.moveForward(-velocity.z);



  if (resizeRendererToDisplaySize(renderer)) {
    const canvas = renderer.domElement;
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  }

  renderer.render(scene, camera);
 
  requestAnimationFrame(render);
}
requestAnimationFrame(render);