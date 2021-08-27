// TODO

// We need to reset the page on reload to initial cords
// Loading bar to not mess around while loading
// Better text etc..

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

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#bg"),
});

//renderer.setPixelRatio(window.devicePixelRatio);

// SETS ALL FRONT PAGE SIZES

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
  //console.log(t);
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
// Still glitched when scriolling down

// Scroll animation
// Add opacity ?
// Speed up scroll?
const paddingBottomCanvas = 0.4;
const paddingBottomText = 0.0;
const scrollLength = 800;
const scrollSpeed = 2;
let tvText = document.getElementsByClassName("tv-text")[0];
let canvas = document.getElementById("bg");
const tvImage = document.getElementsByClassName("tv-overlay")[0];

let y = renderer.getSize().y;

function loadImage(url) {
  return new Promise((resolve) => {
    const image = new Image();
    image.addEventListener("load", () => {
      resolve(image);
      console.log(tvImage.src);
    });
    console.log(tvImage.src);

    image.src = url;
    console.log("test1");
  });
}

loadImage(tvImage.src).then(onWindowResize).then(init);

function init() {
  //On load
  canvas.style.paddingBottom = y * paddingBottomCanvas + "px";
  makePoints(1050, 800, 2100, 1);
}

// Resize function
function onWindowResize() {
  console.log(tvImage.clientHeight * 0.63);

  let tvText = document.getElementsByClassName("tv-text")[0];
  renderer.setSize(tvImage.clientWidth * 0.8, tvImage.clientHeight * 0.63);

  tvText.style.height = tvImage.clientHeight * 0.63 + "px";
  tvText.style.width = tvImage.clientWidth * 0.7 + "px";
  console.log("- resized -");
}
document.body.onresize = onWindowResize;

function changeCss() {
  console.log(this.scrollY);
  if (this.scrollY >= scrollLength) {
    canvas.style.paddingBottom =
      this.scrollY + y * paddingBottomCanvas - scrollLength + "px";
    tvText.style.paddingBottom =
      this.scrollY +
      parseInt(tvText.style.height) * paddingBottomText -
      scrollLength +
      "px";

    tvImage.style.paddingBottom = this.scrollY - scrollLength + "px";
  }
}

window.addEventListener("scroll", changeCss, false);

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
