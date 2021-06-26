import './style.css'

import * as THREE from 'three';




var Theme = {_darkred: 0x000000}
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );



const renderer = new THREE.WebGL1Renderer({
  canvas: document.querySelector( "#bg" ),
});

renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
camera.position.setZ( 60 );
camera.position.setY(10);

camera.rotation.x = 0.2;



renderer.render( scene, camera );


const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(20,20,20);

const ambientLight = new THREE.AmbientLight(0xffffff);

scene.add(pointLight,ambientLight);

const gridHelper = new THREE.GridHelper(200, 50);
scene.add(gridHelper);

const planeHeight = 20;
const planeWidth = 20;
const pointsAmount = 10;
const geomentry = new THREE.PlaneGeometry(planeHeight, planeWidth);
    const material = new THREE.MeshStandardMaterial({wireframe: true});
    const sphereOutOfPoints = new THREE.Mesh(geomentry, material);
    sphereOutOfPoints.name = "pointsSphere";
    scene.add(sphereOutOfPoints);
    
const Point = {
  pointNumb: 0,
  x: -planeHeight/2,
  y: -planeWidth/2,
  z: 0,
  makePoint: function() {
    const geomentry = new THREE.SphereGeometry(0.2, 24, 24);
    const material = new THREE.MeshStandardMaterial({color: 0x19297C,});
    const point = new THREE.Mesh(geomentry, material);
    //this.xyz = this.xyz[this.xyz[0]+1, this.xyz[1]+0.5, this.xyz[2]+0.1];
    point.position.set(Point.x,Point.y,Point.z);
    sphereOutOfPoints.add(point);
    point.name = point;
    Point.x+=planeHeight /pointsAmount;
    Point.z+=0;
    Point.y+=planeHeight /pointsAmount;
  }
}


Array(pointsAmount).fill().forEach(Point.makePoint);
console.log(Point.x,Point.y,Point.z);
console.log(scene.children);
/*
let pointNumb = 0;
function addMesh() {
  const geomentry = new THREE.SphereGeometry(0.2, 24, 24);
  const material = new THREE.MeshStandardMaterial( {
    color: 0x19297C,
  });
  const point = new THREE.Mesh(geomentry, material);



  const [x] = pointNumb + 1;
  const [z] = pointNumb + 0.5;
  const [y] = pointNumb + 0.1;
  point.position.set(x,y,z);
  point.name = point;
  scene.add(point);
}


Array(400).fill().forEach(addMesh);
*/




scene.background = new THREE.Color(Theme._darkred);

/*

function moveCam(){

const t = document.body.getBoundingClientRect().top;
const dir = document.body.scrollTop;


  

}
*/



function animate() {
  requestAnimationFrame( animate );

  

  


  
 
  
  renderer.render( scene, camera );
  
}


animate()