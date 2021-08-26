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

//renderer.setPixelRatio(window.devicePixelRatio);

// SETS ALL FRONT PAGE SIZES

const tvImage = document.getElementsByClassName("tv-overlay")[0];
renderer.setSize(tvImage.clientWidth * 0.8, tvImage.clientHeight * 0.63);
document.getElementsByClassName("tv-text")[0].style.height =
  tvImage.clientHeight * 0.63 + "px";
document.getElementsByClassName("tv-text")[0].style.width =
  tvImage.clientWidth * 0.7 + "px";

renderer.render(scene, camera);

const pointLight = new THREE.PointLight(0xd90368, 10, 500);
scene.add(pointLight);

const ambientLight = new THREE.AmbientLight(0xffffff);
//scene.add(ambientLight);

const gridHelper = new THREE.GridHelper(200, 50);
//scene.add(gridHelper);

// CALCULATES AND RENDERS POINTS
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
    const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const point = new THREE.Mesh(geomentry, material);
    point.position.set(pointXYArray[i][0], pointXYArray[i][1], initialZCord);
    point.name = "point" + i;
    allPointsGroup.add(point);
  }
  scene.add(allPointsGroup);
};

// Needs loop fix....
makePoints(1050, 800, 2100, 1);

//Experimental.... does not work yet
const animateZPoints = function () {
  for (let i = 0; i < allPointsGroup.children.length; i++) {
    allPointsGroup.children[i].position.z += 0.1;
    //console.log(allPointsGroup.children[i].position.z);
  }
};

// Camera hard coded values
camera.rotation.x = 1.7;
camera.position.setX(0.8);
camera.position.z = 0;
// Point light hard coded values
pointLight.position.z = 100;
pointLight.position.y = -200;
function moveCam() {
  const t = document.body.getBoundingClientRect().top;
  console.log(t);
  if (t >= -1000) {
    camera.position.y = t * 0.05;
  }
  //pointLight.position.z = t * -0.5;
  //camera.rotation.x = t * -0.0005;
}
document.body.onscroll = moveCam;

// Background ON/OFF Button
document.querySelector(".glow-on-hover").onclick = function () {
  scrollButton();
};

let backgroundOnOrOff = true;
function scrollButton() {
  if (
    document.querySelector(".glow-on-hover").textContent == "Stop background"
  ) {
    backgroundOnOrOff = false;
    document.querySelector(".glow-on-hover").textContent = "Start background";
  } else {
    backgroundOnOrOff = true;

    document.querySelector(".glow-on-hover").textContent = "Stop background";
  }
}

// NEED SCROLL AND REZIZE FIX!!!!

// Resize function
function onWindowResize() {
  const tvImage = document.getElementsByClassName("tv-overlay")[0];
  renderer.setSize(tvImage.clientWidth * 0.8, tvImage.clientHeight * 0.63);
  document.getElementsByClassName("tv-text")[0].style.height =
    tvImage.clientHeight * 0.63 + "px";
  document.getElementsByClassName("tv-text")[0].style.width =
    tvImage.clientWidth * 0.7 + "px";
  console.log("- resized -");
}
document.body.onresize = onWindowResize;

// Scroll animation
// Add opacity ?
// Speed up scroll?
const paddingBottomCanvas = 0.2;
const paddingBottomText = 0.2;
const scrollLength = 1000;
const scrollSpeed = 2;
function changeCss() {
  if (this.scrollY >= scrollLength) {
    document.getElementById("bg").style.paddingBottom =
      this.scrollY +
      parseInt(document.getElementById("bg").style.height) *
        paddingBottomCanvas -
      scrollLength +
      "px";
    document.getElementsByClassName("tv-text")[0].style.paddingBottom =
      this.scrollY +
      parseInt(document.getElementsByClassName("tv-text")[0].style.height) *
        paddingBottomText -
      scrollLength +
      "px";

    document.getElementsByClassName("tv-overlay")[0].style.paddingBottom =
      this.scrollY - scrollLength + "px";
  } else {
  }
}
window.addEventListener("scroll", changeCss, false);

function init() {
  document.getElementById("bg").style.paddingBottom =
    parseInt(document.getElementById("bg").style.height) * paddingBottomCanvas +
    "px";
  document.getElementsByClassName("tv-text")[0].style.paddingBottom =
    parseInt(document.getElementsByClassName("tv-text")[0].style.height) *
      paddingBottomText +
    "px";
}
init();

function blinkToggle() {
  if (
    document.getElementsByClassName("tv-animation")[0].innerHTML ==
    "I like making stuff and putting it on the internet.I"
  ) {
    document.getElementsByClassName("tv-animation")[0].innerHTML =
      "I like making stuff and putting it on the internet.";
  } else {
    document.getElementsByClassName("tv-animation")[0].innerHTML =
      "I like making stuff and putting it on the internet.I";
  }
}
setInterval(blinkToggle, 800);

function animate() {
  // animateZPoints();
  requestAnimationFrame(animate);
  renderer.render(scene, camera);

  if (backgroundOnOrOff) {
    allPointsGroup.position.x += 0.5;
  }

  // Maybe bit rough
  if (allPointsGroup.position.x >= 20) {
    allPointsGroup.position.x = 0;
  }
}

animate();
