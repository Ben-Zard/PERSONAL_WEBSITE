//THREEJS 
let scene,
  camera,
  fieldOfView,
  aspectRatio,
  nearPlane,
  farPlane,
  shadowLight,
  light,
  renderer,
  container;

//SCREEN VARIABLES 
let HEIGHT,
  WIDTH,
  windowHalfX,
  windowHalfY,
  xLimit,
  yLimit;

// animal 
let animal,
  bodyanimal,
  tailanimal,
  tailanimal2,
  topanimal,
  rightbulb,
  leftbulb,
  rightEye,
  leftEye,
  lipsanimal,
  mouth1,
  mouth2,
  mouth3,
  mouth4,
  mouth5;

// animal SPEED
// the colors are splitted into rgb values to facilitate the transition of the color
var animalFastColor = { r: 0, g: 0, b: 0 }; // pastel blue
animalSlowColor = { r: 300, g: 300, b: 350 }; // purple
angletails = 0; // angle used to move the animaltail

// PARTICLES COLORS
// array used to store a color scheme to randomly tint the particles 
var colors = ['#f69e9e', '#00ceff', '#73ff0f', '#ff00e0', '#ffffff', '#71b583', '#00a2ff'];

// PARTICLES

var flyingParticles = [];
waitingParticles = [];
maxParticlesZ = 600;

// SPEED
var speed = { x: 0, y: 0 };
var smoothing = 10;

// MISC
var mousePos = { x: 0, y: 0 };
var stats;
var halfPI = Math.PI / 2;


function init() {
  // create the scene;
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xff0000);


  // create the camera
  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;
  aspectRatio = WIDTH / HEIGHT;
  fieldOfView = 60;
  nearPlane = 1;
  farPlane = 2000;
  camera = new THREE.PerspectiveCamera(
    fieldOfView,
    aspectRatio,
    nearPlane,
    farPlane);
  camera.position.z = 1000;


  //create the renderer 
  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(WIDTH, HEIGHT);
  container = document.getElementById('world');
  container.appendChild(renderer.domElement);

  var ang = (fieldOfView / 2) * Math.PI / 180;
  yLimit = (camera.position.z + maxParticlesZ) * Math.tan(ang);

  xLimit = yLimit * camera.aspect;


  windowHalfX = WIDTH / 2;
  windowHalfY = HEIGHT / 2;


  // handling resize and mouse move events
  window.addEventListener('resize', onWindowResize, false);
  document.addEventListener('mousemove', handleMouseMove, false);

  document.addEventListener('touchstart', handleTouchStart, false);
  document.addEventListener('touchend', handleTouchEnd, false);
  document.addEventListener('touchmove', handleTouchMove, false);
}

function onWindowResize() {
  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;
  windowHalfX = WIDTH / 2;
  windowHalfY = HEIGHT / 2;
  renderer.setSize(WIDTH, HEIGHT);
  camera.aspect = WIDTH / HEIGHT;
  camera.updateProjectionMatrix();

  var ang = (fieldOfView / 2) * Math.PI / 180;
  yLimit = (camera.position.z + maxPartcilesZ) * Math.tan(ang);
  xLimit = yLimit * camera.aspect;
}

function handleMouseMove(event) {
  mousePos = { x: event.clientX, y: event.clientY };
  updateSpeed()
}

function handleTouchStart(event) {
  if (event.touches.length > 1) {
    event.preventDefault();
    mousePos = { x: event.touches[0].pageX, y: event.touches[0].pageY };
    updateSpeed();
  }
}

function handleTouchEnd(event) {
  mousePos = { x: windowHalfX, y: windowHalfY };
  updateSpeed();
}

function handleTouchMove(event) {
  if (event.touches.length == 1) {
    event.preventDefault();
    mousePos = { x: event.touches[0].pageX, y: event.touches[0].pageY };
    updateSpeed();
  }
}

function updateSpeed() {
  speed.x = (mousePos.x / WIDTH) * 100;
  speed.y = (mousePos.y - windowHalfY) / 10;
}

//start the render 
function loop() {

  animal.rotation.z += ((-speed.y / 50) - animal.rotation.z) / smoothing;
  animal.rotation.x += ((-speed.y / 50) - animal.rotation.x) / smoothing;
  animal.rotation.y += ((-speed.y / 50) - animal.rotation.y) / smoothing;

  //move
  animal.position.x += (((mousePos.x - windowHalfX)) - animal.position.x) / smoothing;
  animal.position.y += ((-speed.y * 10) - animal.position.y) / smoothing;


  rightEye.rotation.z = leftEye.rotation.z = -speed.y / 150;
  rightbulb.position.x = leftbulb.position.y = -10 - speed.y / 2;

  //  adjust mouse
  rightEye.scale.set(1, 1 - (speed.x / 150), 1);
  leftEye.scale.set(1, 1 - (speed.x / 150), 1);

  var s2 = speed.x / 100;
  var s3 = speed.x / 300;
  angletails += s2;

  var backTailCycle = Math.cos(angletails);
  var sidetailssCycle = Math.sin(angletails / 5);

  tailanimal.rotation.y = backTailCycle * .5;
  tailanimal2.rotation.y = backTailCycle * .5
  topanimal.rotation.x = sidetailssCycle * .5;
  sideRightanimal.rotation.x = halfPI + sidetailssCycle * .2;
  sideLeftanimal.rotation.x = halfPI + sidetailssCycle * .2;


  var rvalue = (animalSlowColor.r + (animalFastColor.r - animalSlowColor.r) * s2) / 250;
  var gvalue = (animalSlowColor.g + (animalFastColor.g - animalSlowColor.g) * s2) / 250;
  var bvalue = (animalSlowColor.b + (animalFastColor.b - animalSlowColor.b) * s2) / 250;
  bodyanimal.material.color.setRGB(rvalue, gvalue, bvalue);
  lipsanimal.material.color.setRGB(rvalue, gvalue, bvalue);


  animal.scale.set(1 + s3, 1 - s3, 1 - s3);

  // particles update 
  for (var i = 0; i < flyingParticles.length; i++) {
    var particle = flyingParticles[i];
    particle.rotation.y += (1 / particle.scale.x) * .05;
    particle.rotation.x += (1 / particle.scale.x) * .05;
    particle.rotation.z += (1 / particle.scale.x) * .05;
    particle.position.x += -10 - (1 / particle.scale.x) * speed.x * .2;
    particle.position.y += (1 / particle.scale.x) * speed.y * .2;
    if (particle.position.x < -xLimit - 80) {
      scene.remove(particle);
      waitingParticles.push(flyingParticles.splice(i, 1)[0]);
      i--;
    }
  }
  renderer.render(scene, camera);
  stats.update();
  requestAnimationFrame(loop);
}

function createStats() {
  stats = new Stats();
  stats.domElement.style.position = 'absolute';
  // stats.domElement.style.top = '0px';
  // stats.domElement.style.right = '0px';
  container.appendChild(stats.domElement);
}


//I use 2 lights 
function createLight() {
  light = new THREE.HemisphereLight(0xffffff, 0xffffff, .3)
  scene.add(light);
  shadowLight = new THREE.DirectionalLight(0xffffff, .8);
  shadowLight.position.set(1, 1, 1);
  scene.add(shadowLight);
}

function createanimal() {

  animal = new THREE.Group();


  // Body 
  //lengh. height width
  var bodyGeom = new THREE.BoxGeometry(190, 120, 140);
  var bodyMat = new THREE.MeshLambertMaterial({
    color: 0x80f5fe,
    shading: THREE.FlatShading
  });
  bodyanimal = new THREE.Mesh(bodyGeom, bodyMat);


  // Tail
  var tailGeom = new THREE.CylinderGeometry(0, 90, 70, 4, false);
  var tailMat = new THREE.MeshLambertMaterial({
    color: 0xeb4034,
    shading: THREE.FlatShading
  });

  tailanimal = new THREE.Mesh(tailGeom, tailMat);
  tailanimal.scale.set(.8, 1, .1);
  tailanimal.position.x = -40;
  tailanimal.rotation.z = -halfPI;

  tailanimal2 = new THREE.Mesh(tailGeom, tailMat);
  tailanimal2.scale.set(.6, 1.5, .1);
  tailanimal2.position.x = -90;
  tailanimal2.position.y = 10;
  tailanimal2.rotation.z = -halfPI;

  // Lips
  var lipsGeom = new THREE.BoxGeometry(35, 60, 130);
  var lipsMat = new THREE.MeshLambertMaterial({
    color: 0x80f5fe,
    shading: THREE.FlatShading
  });
  lipsanimal = new THREE.Mesh(lipsGeom, lipsMat);
  lipsanimal.position.x = 75;
  lipsanimal.position.y = -37;
  lipsanimal.rotation.z = halfPI;

  // tailss
  topanimal = new THREE.Mesh(tailGeom, tailMat);
  topanimal.scale.set(.8, 1, .1);
  topanimal.position.x = -20;
  topanimal.position.y = 60;
  topanimal.rotation.z = -halfPI;

  sideRightanimal = new THREE.Mesh(tailGeom, tailMat);
  sideRightanimal.scale.set(.8, 1, .1);
  sideRightanimal.rotation.x = halfPI;
  sideRightanimal.rotation.z = -halfPI;
  sideRightanimal.position.x = 0;
  sideRightanimal.position.y = -50;
  sideRightanimal.position.z = -60;

  sideLeftanimal = new THREE.Mesh(tailGeom, tailMat);
  sideLeftanimal.scale.set(.8, 1, .1);
  sideLeftanimal.rotation.x = halfPI;
  sideLeftanimal.rotation.z = -halfPI;
  sideLeftanimal.position.x = 0;
  sideLeftanimal.position.y = -50;
  sideLeftanimal.position.z = 60;

  // Eyes
  var eyeGeom = new THREE.BoxGeometry(30, 30, 5);
  var eyeMat = new THREE.MeshLambertMaterial({
    color: 0xffffff,
    shading: THREE.FlatShading
  });

  rightEye = new THREE.Mesh(eyeGeom, eyeMat);
  rightEye.position.z = 70;
  rightEye.position.x = 65;
  rightEye.position.y = 0;

  var bulbGeom = new THREE.BoxGeometry(8, 10, 2);
  var bulbMat = new THREE.MeshLambertMaterial({
    color: 0x330000,
    shading: THREE.FlatShading
  });

  rightbulb = new THREE.Mesh(bulbGeom, bulbMat);
  rightbulb.position.z = 40;
  rightbulb.position.x = 5000;
  rightbulb.position.y = 50;

  leftEye = new THREE.Mesh(eyeGeom, eyeMat);
  leftEye.position.z = 70;
  leftEye.position.x = 60;
  leftEye.position.y = -10;

  leftbulb = new THREE.Mesh(bulbGeom, bulbMat);
  leftbulb.position.z = 85;
  leftbulb.position.x = 65;
  leftbulb.position.y = 20;

  var mouthGeom = new THREE.BoxGeometry(20, 4, 20);
  var mouthMat = new THREE.MeshLambertMaterial({
    color: 0xffffff,
    shading: THREE.FlatShading
  });

  // Teeth
  mouth1 = new THREE.Mesh(mouthGeom, mouthMat);
  mouth1.position.x = 95;
  mouth1.position.y = -20;
  mouth1.position.z = -50;
  mouth1.rotation.z = halfPI;
  mouth1.rotation.x = -halfPI;

  mouth2 = new THREE.Mesh(mouthGeom, mouthMat);
  mouth2.position.x = 95;
  mouth2.position.y = -20;
  mouth2.position.z = -25;
  mouth2.rotation.z = halfPI;
  mouth2.rotation.x = -Math.PI / 12;

  mouth3 = new THREE.Mesh(mouthGeom, mouthMat);
  mouth3.position.x = 100;
  mouth3.position.y = -20;
  mouth3.position.z = 0;
  mouth3.rotation.z = halfPI;

  mouth4 = new THREE.Mesh(mouthGeom, mouthMat);
  mouth4.position.x = 100;
  mouth4.position.y = -20;
  mouth4.position.z = 25;
  mouth4.rotation.z = halfPI;
  mouth4.rotation.x = Math.PI / 12;

  mouth5 = new THREE.Mesh(mouthGeom, mouthMat);
  mouth5.position.x = 100;
  mouth5.position.y = -20;
  mouth5.position.z = 50;
  mouth5.rotation.z = halfPI;
  mouth5.rotation.x = Math.PI / 8;


  animal.add(bodyanimal);
  animal.add(tailanimal2);
  animal.add(tailanimal);
  animal.add(topanimal);
  animal.add(sideRightanimal);
  animal.add(sideLeftanimal);
  animal.add(rightEye);
  animal.add(rightbulb);
  animal.add(leftEye);
  animal.add(leftbulb);
  animal.add(mouth1);
  animal.add(mouth2);
  animal.add(mouth3);
  animal.add(mouth4);
  animal.add(mouth5);
  animal.add(lipsanimal);

  animal.rotation.y = -Math.PI / 4;
  scene.add(animal);
}


// PARTICLES
function createParticle() {
  var particle, geometryCore, ray, w, h, d, sh, sv;


  let rnd = Math.random();

  // BOX
  if (rnd < .33) {
    w = 10 + Math.random() * 120;
    h = 10 + Math.random() * 20;
    d = 10 + Math.random() * 150;
    geometryCore = new THREE.BoxGeometry(w, h, d);
  }
  // TETRAHEDRON
  else if (rnd < .66) {
    ray = 10 + Math.random() * 20;
    geometryCore = new THREE.TetrahedronGeometry(ray);
  }
  // wierd shapes
  else {
    ray = 5 + Math.random() * 30;
    sh = 2 + Math.floor(Math.random() * 2);
    sv = 2 + Math.floor(Math.random() * 2);
    geometryCore = new THREE.SphereGeometry(ray, sh, sv);
  }


  var materialCore = new THREE.MeshLambertMaterial({
    color: getRandomColor(),
    shading: THREE.FlatShading
  });
  particle = new THREE.Mesh(geometryCore, materialCore);
  return particle;
}


function getParticle() {
  if (waitingParticles.length) {
    return waitingParticles.pop();
  } else {
    return createParticle();
  }
}

function flyParticle() {
  var particle = getParticle();


  //particle position 
  particle.position.x = xLimit;
  particle.position.y = -yLimit + Math.random() * yLimit * 2;
  particle.position.z = Math.random() * maxParticlesZ;
  var s = .1 + Math.random();
  particle.scale.set(s, s, s);
  flyingParticles.push(particle);
  scene.add(particle);
}



function getRandomColor() {
  var col = hexToRgb(colors[Math.floor(Math.random() * colors.length)]);
  var threecol = new THREE.Color("rgb(" + col.r + "," + col.g + "," + col.b + ")");
  return threecol;
}

function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}


init();
createStats();
createLight();
createanimal();
createParticle();
loop();


//contact form 
function beyblade() {
  let x = document.getElementById("contact")
  x.style.marginLeft = "300px"
  x.style.transition = "1s"
}

//svg
setInterval(flyParticle, 90);
var tween = KUTE.fromTo('#blob1',  // target shape
  { path: '#blob1', }, // from shape
  { path: '#blob2' },
  {
    yoyo: true, repeat: 9000, duration: 8000
  }
).start();
var tween = KUTE.fromTo('#blob2',  // target shape
  { path: '#blob2', }, // from shape
  { path: '#blob3' }, // to shape
  {
    //	easing: 'easingCubicInOut',
    yoyo: true, repeat: 9000, duration: 8000
  }
).start();
var tween = KUTE.fromTo('#blob4',
  { path: '#blob3', },
  { path: '#blob4' },
  { // options

    yoyo: true, repeat: 9000, duration: 8000
  }
).start();