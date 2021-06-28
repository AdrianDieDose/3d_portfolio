import "./style.css";

import * as THREE from "three";
import { MathUtils } from "three";

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

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

renderer.render(scene, camera);

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(0, 0, 10);
pointLight.name = "pointLight";
const ambientLight = new THREE.AmbientLight(0xffffff);

scene.add(pointLight);

const gridHelper = new THREE.GridHelper(200, 50);
//scene.add(gridHelper);

//Placeholder for time being for pinning out all points ... need fix
const geomentry = new THREE.PlaneGeometry(0, 0);
const material = new THREE.MeshStandardMaterial({});
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

const makePoints = function (planeHeight, planeWidth, nPoints, offset) {
  const pointXYArray = calcSpaces(planeHeight, planeWidth, nPoints, offset);
  const initialZCord = -30;
  for (let i = 0; i < pointXYArray.length; i++) {
    const geomentry = new THREE.SphereGeometry(0.3, 50, 50);
    const material = new THREE.MeshStandardMaterial({ color: 0xd90368 });
    const point = new THREE.Mesh(geomentry, material);
    point.position.set(pointXYArray[i][0], pointXYArray[i][1], initialZCord);
    point.name = "point" + i;
    sphereOutOfPoints.add(point);
  }
};

makePoints(200, 200, 1500, -100);
// Needs fix bc trash... why cant this variable be passed with the function ;,)
let speedAndDirection = -0.02;
const animatePointsZ = function () {
  const t = document.body.getBoundingClientRect().top;
  for (let i = 0; i < sphereOutOfPoints.children.length; i++) {
    sphereOutOfPoints.children[i].position.z = t * speedAndDirection;
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
// Render initial point positions.
animatePointsZ();

//
//  If we want a camera z zoomout we need to set the intial z axis but when we do this the animatePointZ function breaks bc we rely on fixed z=0
//
//camera.position.setZ(60);
//camera.position.setY(10);
//camera.rotation.x = -0.2;
camera.position.z = 50;
function moveCam() {
  const t = document.body.getBoundingClientRect().top;
  console.log(t);
  //camera.position.y = t * -0.02;
  //camera.position.z = t * -0.02;
  //camera.rotation.x = t * -0.0001;
  pointLight.position.z = t * 1;

  animatePointsZ();
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
  renderer.render(scene, camera);
}

animate();
