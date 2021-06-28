import "./style.css";

import * as THREE from "three";
import { MathUtils } from "three";

var Theme = { _darkred: 0x000000 };
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGL1Renderer({
  canvas: document.querySelector("#bg"),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
//camera.position.setZ(60);
//camera.position.setY(10);
//camera.rotation.x = 0.2;

renderer.render(scene, camera);

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(20, 20, 20);

const ambientLight = new THREE.AmbientLight(0xffffff);

scene.add(pointLight, ambientLight);

const gridHelper = new THREE.GridHelper(200, 50);
scene.add(gridHelper);

const planeHeight = 20;
const planeWidth = 20;
//Need even and uneven fix!
const geomentry = new THREE.PlaneGeometry(planeHeight, planeWidth);
const material = new THREE.MeshStandardMaterial({ wireframe: true });
const sphereOutOfPoints = new THREE.Mesh(geomentry, material);
sphereOutOfPoints.name = "pointsSphere";
scene.add(sphereOutOfPoints);

const calcSpaces = function (planeHeight, planeWidth, nPoints, offset) {
  const totalArea = planeWidth * planeHeight;
  const pointArea = totalArea / nPoints;
  const length = Math.sqrt(pointArea);
  const xy = [];
  for (let i = length / 2; i < planeWidth; i += length) {
    for (let j = length / 2; j < planeHeight; j += length) {
      let buffer = [i + offset, j + offset];
      xy.push(buffer);
    }
  }
  return xy;
};

scene.background = new THREE.Color(Theme._darkred);

const makePoints = function (planeHeight, planeWidth, nPoints, offset) {
  const pointXYArray = calcSpaces(planeHeight, planeWidth, nPoints, offset);
  for (let i = 0; i < pointXYArray.length; i++) {
    const geomentry = new THREE.SphereGeometry(0.4, 24, 24);
    const material = new THREE.MeshStandardMaterial({ color: 0x19297c });
    const point = new THREE.Mesh(geomentry, material);
    point.position.set(pointXYArray[i][0], pointXYArray[i][1], 0);
    point.name = "point" + i;
    sphereOutOfPoints.add(point);
  }
};

makePoints(200, 200, 1500, -100);
// Needs fix bc trash... why cant this variable be passed with the function ;,)
let speedAndDirection1 = 0.009;
let speedAndDirection2 = -0.009;
const animatePointsZ = function (depth) {
  for (let i = 0; i < sphereOutOfPoints.children.length; i++) {
    if (i % 2 === 0) {
      if (sphereOutOfPoints.children[i].position.z >= depth) {
        speedAndDirection1 = -Math.abs(speedAndDirection1);
      } else if (sphereOutOfPoints.children[i].position.z <= -depth) {
        speedAndDirection1 = Math.abs(speedAndDirection1);
      }
      sphereOutOfPoints.children[i].position.z += speedAndDirection1;
    } else {
      if (sphereOutOfPoints.children[i].position.z >= depth) {
        speedAndDirection2 = -Math.abs(speedAndDirection2);
      } else if (sphereOutOfPoints.children[i].position.z <= -depth) {
        speedAndDirection2 = Math.abs(speedAndDirection2);
      }
      sphereOutOfPoints.children[i].position.z += speedAndDirection2;
    }
  }
  /*



  //They are still bc they cancel each other out
  // Current state: cant fix the top row not being aligned right to move and also to move all other half of the dots in reverse.



  for (let i = 0; i < sphereOutOfPoints.children.length / splitter; i++) {
    if (sphereOutOfPoints.children[i * splitter].position.z >= depth) {
      speedAndDirection2 = -Math.abs(speedAndDirection2);
    } else if (sphereOutOfPoints.children[i * splitter].position.z <= -depth) {
      speedAndDirection2 = Math.abs(speedAndDirection2);
    }
    sphereOutOfPoints.children[i * splitter].position.z += speedAndDirection2;
  }
  */
};

//
//  If we want a camera z zoomout we need to set the intial z axis but when we do this the animatePointZ function breaks bc we rely on fixed z=0
//
camera.position.z = 50;
function moveCam() {
  const t = document.body.getBoundingClientRect().top;
  console.log(t);
  camera.position.y = t * -0.02;
  camera.position.z = t * -0.02;

  camera.rotation.x = t * 0.0001;
}
document.body.onscroll = moveCam;

// Window rezize fix needed !
function onWindowResize() {
  _width = window.innerWidth;
  _height = window.innerHeight;
  renderer.setSize(_width, _height);
  camera.aspect = _width / _height;
  console.log("- resize -");
}

function animate() {
  requestAnimationFrame(animate);
  animatePointsZ(0.5);
  renderer.render(scene, camera);
}

animate();
