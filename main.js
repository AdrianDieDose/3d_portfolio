import "./style.css";

import * as THREE from "three";

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

const ambientLight = new THREE.AmbientLight(0xffffff);

scene.add(ambientLight);

const gridHelper = new THREE.GridHelper(200, 50);
//scene.add(gridHelper);

const calcSpaces = function (
  planeHeight,
  planeWidth,
  nPoints,
  offsetX,
  offsetY
) {
  const totalArea = planeWidth * planeHeight;
  const pointArea = totalArea / nPoints;
  const length = Math.sqrt(pointArea);
  const xy = [];
  offsetX *= -1;
  offsetY *= -1;
  for (let i = length / 2; i < planeWidth; i += length) {
    for (let j = length / 2; j < planeHeight; j += length) {
      let buffer = [i + offsetX, j + offsetY];
      xy.push(buffer);
    }
  }
  return xy;
};

const allPointsGroup = new THREE.Group();

const makePoints = function (planeHeight, planeWidth, nPoints, pointSize) {
  const pointXYArray = calcSpaces(
    planeHeight,
    planeWidth,
    nPoints,
    planeWidth / 2,
    planeHeight / 4
  );
  const initialZCord = -30;
  for (let i = 0; i < pointXYArray.length; i++) {
    const geomentry = new THREE.SphereGeometry(pointSize, 50, 50);
    const material = new THREE.MeshStandardMaterial({ color: 0xd90368 });
    const point = new THREE.Mesh(geomentry, material);
    point.position.set(pointXYArray[i][0], pointXYArray[i][1], initialZCord);
    point.name = "point" + i;
    allPointsGroup.add(point);
  }
  scene.add(allPointsGroup);
};

makePoints(1050, 2000, 5500, 1);

//Experimental.... does not work yet
const animateZPoints = function () {
  for (let i = 0; i < allPointsGroup.children.length; i++) {
    allPointsGroup.children[i].position.z += 0.1;
    //console.log(allPointsGroup.children[i].position.z);
  }
};

camera.rotation.x = 0.8;
camera.position.setX(0.8);
camera.position.z = 50;
function moveCam() {
  const t = document.body.getBoundingClientRect().top;
  camera.position.y = t * 0.05;
  //camera.rotation.x = t * -0.0005;
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
console.log(allPointsGroup);
function animate() {
  // animateZPoints();
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  allPointsGroup.position.x += 0.5;

  // Maybe bit rough
  if (allPointsGroup.position.x >= 20) {
    allPointsGroup.position.x = 0;
  }
}

animate();
