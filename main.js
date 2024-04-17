import "./style.scss";
import * as THREE from "three";
import gsap from "gsap";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
// Scene

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

const camera = new THREE.PerspectiveCamera(
  65,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#bg"),
});

renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.z = 4;
camera.position.x = 0;
camera.position.y = 1;
// camera.rotation.y = 45;

renderer.render(scene, camera, 0.1);

const resisze = () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
};

window.addEventListener("resize", resisze);

const pointLight = new THREE.PointLight(0xffffff, 50, 100, 2);
pointLight.position.set(0, 3, 0);
scene.add(pointLight);

const pointLightBottom = new THREE.PointLight(0xffffff, 70, 100, 2);
pointLightBottom.position.set(0, -3, 0);

const path = new THREE.CatmullRomCurve3([
  new THREE.Vector3(0, 1, 4),
  new THREE.Vector3(3, 1, 2),
  new THREE.Vector3(5, 1, 0),
  new THREE.Vector3(3, 1, -2),
  new THREE.Vector3(0, 1, -4),
]);

const points = path.getPoints(50);
const geometry = new THREE.BufferGeometry().setFromPoints(points);
const material = new THREE.LineBasicMaterial({ color: 0x000000 });
const curveObject = new THREE.Line(geometry, material);
scene.add(curveObject);

//cam follow path

const camPath = new THREE.CatmullRomCurve3([
  new THREE.Vector3(0, 1, 4),
  new THREE.Vector3(3, 1, 2),
  new THREE.Vector3(5, 1, 0),
  new THREE.Vector3(3, 1, -2),
  new THREE.Vector3(0, 1, -4),
  new THREE.Vector3(-3, 1, -2),
  new THREE.Vector3(-5, 1, 0),
  new THREE.Vector3(-3, 1, 2),
  new THREE.Vector3(0, 0, 4),
  new THREE.Vector3(-5, -10, 0),
]);

const camPoints = camPath.getPoints(50);
const camGeometry = new THREE.BufferGeometry().setFromPoints(camPoints);
const camMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });
const camObject = new THREE.Line(camGeometry, camMaterial);
scene.add(camObject);

const lightShadow = new THREE.DirectionalLight(0xe4e8ea, 10);
lightShadow.position.set(3, -1, 1);
lightShadow.castShadow = true;
lightShadow.shadow.mapSize.width = 1024;
lightShadow.shadow.mapSize.height = 1024;
lightShadow.shadow.camera.far = 15;
lightShadow.target.position.set(0, 1.2, 1);
scene.add(lightShadow);

const lightShadow2 = new THREE.DirectionalLight(0xe4e8ea, 2);
lightShadow2.position.set(-3, -1, 1);
lightShadow2.castShadow = true;
scene.add(lightShadow2);

let loader = new GLTFLoader();
loader.load("scene.gltf", function (gltf) {
  scene.add(gltf.scene);
  gltf.scene.scale.set(2, 2, 2);
  gltf.scene.position.x = 0;
  gltf.scene.position.y = 0;
  gltf.scene.position.z = 0;
  animate();
});

console.log(loader);

// Stars

const starsGeometry = new THREE.BufferGeometry();
const starsMaterial = new THREE.PointsMaterial({
  color: 0xffffff,
  size: 0.02,
});

const starsVertices = [];

for (let i = 0; i < 1000; i++) {
  const x = (Math.random() - 0.5) * 100;
  const y = (Math.random() - 0.5) * 100;
  const z = (Math.random() - 0.5) * 100;

  starsVertices.push(x, y, z);
}

starsGeometry.setAttribute(
  "position",
  new THREE.Float32BufferAttribute(starsVertices, 3)
);

const stars = new THREE.Points(starsGeometry, starsMaterial);
scene.add(stars);

// const BoxGeometry = new THREE.BoxGeometry(2, 2, 2);
// const BoxMaterial = new THREE.MeshLambertMaterial({
//   color: 0xfffffff,
//   side: THREE.DoubleSide,
//   emissive: 0xffffff,
//   emissiveIntensity: 0.8,
//   shadowSide: THREE.DoubleSide,
// });
// const Box = new THREE.Mesh(BoxGeometry, BoxMaterial);
// scene.add(Box);
// Box.position.x = 0;
// Box.position.y = -1;
// Box.position.z = 0;

function UpdateCam() {
  window.addEventListener("scroll", () => {
    const scroll = { y: window.scrollY };
    const t = Math.min(Math.max(scroll.y / 3000, 0), 1);
    const pos = camPath.getPointAt(t);
    camera.position.copy(pos);
    camera.lookAt(0, 1, 1.5);
  });
}
function animate() {
  requestAnimationFrame(animate);
  UpdateCam();
  renderer.render(scene, camera);
}

window.addEventListener("scroll", () => {
  scroll.y = window.scrollY;
  UpdateCam();
});

animate();
