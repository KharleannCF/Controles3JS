//Dependencies Webpack  and threeJS, npm install webpack webpack-cli, npm install threeJS
// npm run-script build to compile, work on this file.
// dont change package.json
const THREE = require('three');
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
const canvas = document.getElementById('canvas');

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 30, window.innerWidth / window.innerHeight, 0.01, 1000 );

const Pi = Math.PI/180;

const renderer = new THREE.WebGLRenderer({canvas});
renderer.shadowMap.enabled = true;


camera.position.set(0,10,20);
camera.lookAt(0,5,0);
camera.updateProjectionMatrix();



for (let i = 0; i < 200; i++) {
	let color = new THREE.Color(0xFFFFFF);
	color.setHex(Math.random() * 0xFFFFFF);
	let cubeMat = new THREE.MeshPhongMaterial({color: color, reflectivity: 1});
	let cubeGeo = new THREE.BoxGeometry(1,1,1);
	let cube = new THREE.Mesh(cubeGeo,cubeMat);
	cube.rotation.x = Math.random()*90*Pi;
	cube.rotation.y = Math.random()*90*Pi;
	cube.rotation.z = Math.random()*90*Pi;
	cube.position.x = Math.random()*70 * (Math.random() * 2 - 1);
	cube.position.y = Math.random()*40
	cube.position.z = Math.random()*70 * (Math.random() * 2 - 1);
	cube.castShadow =(Math.round(Math.random())) ? true : false;
	cube.receiveShadow = true;
	
	scene.add(cube);
}


let geoFloor = new THREE.BoxGeometry( 125, 0.1, 125 );
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
lightPoint.position.set(0,40,70);
lightPoint.lookAt(0,0,0);
lightPoint.castShadow = true;


const Spacess = new THREE.Object3D();
Spacess.add(lightPoint);
Spacess.castShadow = true;
scene.add(Spacess);

//Camera controls

const controls = new OrbitControls( camera, renderer.domElement );
controls.maxPolarAngle = Math.PI * 0.7;
controls.minDistance = 0.1;
controls.maxDistance = 1000;
controls.enableDamping = true;






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
  time*=0.0005;
  Spacess.rotation.y = time;
  controls.update();
 

  if (resizeRendererToDisplaySize(renderer)) {
    const canvas = renderer.domElement;
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  }
 
  renderer.render(scene, camera);
 
  requestAnimationFrame(render);
}
requestAnimationFrame(render);