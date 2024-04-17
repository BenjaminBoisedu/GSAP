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
  new THREE.Vector3(3, 1, -4),
  new THREE.Vector3(-3, 1, -7),
  new THREE.Vector3(-5, 1, 0),
  new THREE.Vector3(-3, 1, 2),
  new THREE.Vector3(0, 0, 4),
  new THREE.Vector3(-10, -10, 0),
  new THREE.Vector3(-5, 1, 0),
  new THREE.Vector3(-3, 1, 2),
  new THREE.Vector3(0, 1, 4),
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

function UpdateCam() {
  window.addEventListener("scroll", () => {
    const scroll = { y: window.scrollY };
    const t = Math.min(Math.max(scroll.y / 3500, 0), 1);
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
  btn.style.opacity = 1 - scroll.y / 500;
  anchor.style.opacity = 0 + scroll.y / 500;
  H1name.style.opacity = 1 - scroll.y / 500;
});

animate();

const btn = document.querySelector(".menu-btn");
const ul = document.querySelector(".main-nav-ul");
btn.addEventListener("click", () => {
  if (document.querySelector(".main-nav").style.display === "block") {
    document.querySelector(".main-nav").setAttribute("style", "display: none");
    document.querySelector(".main-nav-ul").classList.remove("active");
    btn.style.opacity = 1;
    gsap.fromTo(
      ".main-nav",
      { display: "block", duration: 0.5 },
      { display: "none", duration: 0.5 }
    );
    document.body.style.overflow = "auto";
  } else {
    document.querySelector(".main-nav").setAttribute("style", "display: block");
    document.querySelector(".main-nav-ul").classList.add("active");
    btn.style.opacity = 1;
    gsap.fromTo(
      ".main-nav",
      { display: "none", duration: 0.5 },
      { display: "block", duration: 0.5 }
    );
    document.body.style.overflow = "hidden";
  }

  const menu = document.querySelector(".menu-outline");
  if (menu.name === "menu-outline") {
    menu.setAttribute("name", "close-outline");
  } else {
    menu.setAttribute("name", "menu-outline");
  }
});

const zoomIncrease = document.querySelector(".zoom-increase");
const zoomDecrease = document.querySelector(".zoom-decrease");

const contentText = document.querySelector(".content-text");

zoomIncrease.addEventListener("click", () => {
  contentText.style.fontSize = "1.5rem";
});

zoomDecrease.addEventListener("click", () => {
  contentText.style.fontSize = "1rem";
});

const anchor = document.querySelector(".anchor-link");

anchor.addEventListener("click", () => {
  window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
});

const H1name = document.querySelector(".h1-name");

gsap.fromTo(
  H1name,
  { x: -100, opacity: 0, ease: "power1.inOut" },
  { x: 0, opacity: 1, duration: 3, ease: "power1.inOut" }
);

gsap.fromTo(
  ".menu-btn",
  { x: 100, opacity: 0, ease: "power1.inOut", delay: 1 },
  {
    x: 0,
    opacity: 1,
    duration: 1.5,
    ease: "power1.inOut",
  }
);

const credits = document.querySelector(".credits");

gsap.fromTo(
  credits,
  {
    y: 0,
    x: 0,
    opacity: 1,
    ease: "power1.inOut",
    delay: 2,
    duration: 1.5,
    direction: "alternate",
  },
  {
    y: 0,
    x: -100,
    opacity: 0,
    duration: 1.5,
    delay: 2,
    ease: "power1.inOut",
  }
);

const contentTitle = document.querySelector(".content-title");

gsap.fromTo(
  contentTitle,
  {
    y: -100,
    x: 10,
    opacity: 0,
    ease: "power1.inOut",
    delay: 2,
    duration: 1.5,
    direction: "alternate",
  },
  {
    y: 0,
    x: 0,
    opacity: 1,
    duration: 1.5,
    delay: 2,
    ease: "power1.inOut",
  }
);
