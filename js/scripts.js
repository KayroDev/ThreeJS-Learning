import * as THREE from 'three';
import { Vector3 } from 'three';
import WebGL from 'three/addons/capabilities/WebGL.js';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const container = document.getElementById('canvas');
console.log(container.clientWidth);
console.log(container.clientHeight);

const width = container.clientWidth;
const height = container.clientHeight;

// secene & camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    45,
    width/ height,
    1,
    500 
);
camera.position.set( 0, 0, 30);
camera.lookAt( 0, 0, 0);

const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize( width, height );
renderer.shadowMap.enabled = true;
container.appendChild( renderer.domElement );

const controls = new OrbitControls( camera, renderer.domElement ); 


// cube
const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material );
//scene.add( cube );

// line
const lineMaterial = new THREE.LineBasicMaterial({color: 0x0000ff});

const points = [];
points.push( new Vector3( -10, 0, 0 ));
points.push( new Vector3( 0, 10, 0 ));
points.push( new Vector3( 10, 0, 0 ));
const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);

const line = new THREE.Line( lineGeometry, lineMaterial );
scene.add(line);


// GLTF loader
const loader = new GLTFLoader();

loader.load( '/monky.glb', function ( gltf ) {

	scene.add( gltf.scene );
    gltf.scene.traverse( child => { if ( child.material ) child.material.metalness = 0; } );
    gltf.scene.traverse(function (child) {
        if (child.isMesh) {
            child.castShadow = true
            child.receiveShadow = true
        }
    })
    gltf.scene.position.set(0,2,0);

}, undefined, function ( error ) {

	console.error( error );

} );


// test cube
const testCGet = new THREE.BoxGeometry(1,1,1);
const testcMat = new THREE.MeshStandardMaterial({
    color: 0x00FF00,
});
const testC = new THREE.Mesh(testCGet,testcMat);
scene.add(testC);
testC.castShadow = true;


// directional light
const dLight = new THREE.DirectionalLight(0xffffff , 1);
scene.add(dLight);
dLight.position.set(0, 10, 10);
dLight.castShadow = true;

const dLightHelper = new THREE.DirectionalLightHelper(dLight, 5);
scene.add(dLightHelper);

const dLightShadowHelper = new THREE.CameraHelper(dLight.shadow.camera);
scene.add(dLightShadowHelper);

// plane
const planeGeo = new THREE.PlaneGeometry( 10,10 );
const planeMat = new THREE.MeshStandardMaterial({color: 0x0000FF});

const plane = new THREE.Mesh( planeGeo, planeMat );
plane.receiveShadow = true;
scene.add(plane);
plane.rotateX(Math.PI/180 * -90);


// Render / Animate
function animate() {
    //cube.rotation.x += 0.01;
    //cube.rotation.y += 0.01;

	requestAnimationFrame( animate );
	renderer.render( scene, camera );
}


// WebGL compatibility check
if ( WebGL.isWebGLAvailable() ) {

	animate();

} else {

	const warning = WebGL.getWebGLErrorMessage();
	document.getElementById( 'container' ).appendChild( warning );

}