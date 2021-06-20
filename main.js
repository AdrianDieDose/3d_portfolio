import './style.css'

import * as THREE from 'three';



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



function addRainDrop() {
  const geomentry = new THREE.SphereGeometry(0.1, 24, 24);
  const material = new THREE.MeshStandardMaterial( {color: 0x19297C});
  const drop = new THREE.Mesh(geomentry, material);

  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(200));
  drop.position.set(x,y,z);
  drop.name = drop;
  scene.add(drop);
}

Array(500).fill().forEach(addRainDrop);



const forestTexture = new THREE.TextureLoader().load("land2.png");
scene.background = forestTexture;


function moveCam(){

const t = document.body.getBoundingClientRect().top;
  // Very inefficiant way of making rain... pls stop
  for(let i = 4;i< scene.children.length -4;i++){
    scene.children[i].position.y -= 1;

    if(scene.children[i].position.y <= 0){
      scene.children[i].position.y = THREE.MathUtils.randFloatSpread(100);
      
    }
  }

}
document.body.onscroll = moveCam


function animate() {
  requestAnimationFrame( animate );

  



 
  
  renderer.render( scene, camera );

}


animate()