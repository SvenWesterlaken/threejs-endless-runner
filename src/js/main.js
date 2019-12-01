import * as THREE from 'three';
import GLTFLoader from 'three-gltf-loader';
import $ from 'jquery';

let camera, scene, renderer, airplane, bullet, id, cloud;
let spawnLoop;
let obstacles = [];
let score = 0;

const MAX_BULLETS = 2;
const BULLET_RADIUS = 0.1;
const OBSTACLE_SIZE = 1;
const OBSTACLE_INTERVAL = 1000;

const scoreText = $('#score');
const loseScreen = $('#loseScreen');

loseScreen.hide();

function init() {
    // Init scene
    scene = new THREE.Scene();

    // Set scene background to light blue
    scene.background = new THREE.Color(0x6197ed);

    // Init camera (PerspectiveCamera)
    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );

    // Init renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });

    // Set size (whole window)
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Render to canvas element
    document.body.appendChild(renderer.domElement);

    const loader = new GLTFLoader();

    loader.load('/models/plane.glb', (model) => {
      airplane = model.scene;
      scene.add(airplane);
      airplane.position.x = -6;
    }, undefined, err => console.error(err));

    loader.load('/models/cloud.glb', (model) => {
      cloud = model.scene;
    }, undefined, err => console.error(err));

    createMultipleObstacles();

    // Position camera
    camera.position.z = 5;

    var directionalLight = new THREE.DirectionalLight( 0xffffff, 1.5 );

    scene.add( directionalLight );
}

// Draw the scene every time the screen is refreshed
function animate() {
    id = requestAnimationFrame(animate);

    if(bullet) animateBullet();

    animateObstacles();

    checkAndHandleCollisions();

    renderer.render(scene, camera);
}

// Gets called when the screen is resized
function onWindowResize() {
    // Camera frustum aspect ratio
    camera.aspect = window.innerWidth / window.innerHeight;
    // After making changes to aspect
    camera.updateProjectionMatrix();
    // Reset size
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Gets called when a button is pressed
function onDocumentKeyDown(event) {
    // Plane speed
    var xSpeed = 0.2;
    var ySpeed = 0.2;

    var yMax = 3.2;
    var yMin = -3.2;
    var xMax = 6;
    var xMin = -6;

    var keyCode = event.which;
    // Up Arrow
    if (keyCode == 38) {
        if (airplane.position.y < yMax) airplane.position.y += ySpeed;
    }
    // Down Arrow
    else if (keyCode == 40) {
        if (airplane.position.y > yMin) airplane.position.y -= ySpeed;
    }
    // Left Arrow
    else if (keyCode == 37) {
        if (airplane.position.x > xMin) airplane.position.x -= xSpeed;
    }
    // Right Arrow
    else if (keyCode == 39) {
        if (airplane.position.x < xMax) airplane.position.x += xSpeed;
    }
    else if (keyCode == 32) {
        if (!bullet) createBullet();
    }
}

function checkAndHandleCollisions() {
    const removeBuffer = [];
    let i = obstacles.length - 1;

    while (i >= 0) {

      if (bullet != null && doTheseCollide(bullet, obstacles[i])) {
          score++;
          scoreText.text(score + '')
          scene.remove(bullet);
          bullet = null;
          removeBuffer.push(obstacles[i]);
      }

      if (airplane != null && doTheseCollide(airplane, obstacles[i])) {
        cancelAnimationFrame(id);
        loseScreen.show();
        clearInterval(spawnLoop);
      }

      i--;
    }

    removeBuffer.forEach(item => scene.remove(item));
    obstacles = obstacles.filter(item => !removeBuffer.includes(item));
}

function doTheseCollide(object1, object2) {
    let a = object1.position;
    let b = object2.position;

    return a.x > b.x - (OBSTACLE_SIZE/2)
        && a.x < b.x + (OBSTACLE_SIZE/2)
        && a.y > b.y - (OBSTACLE_SIZE/2)
        && a.y < b.y + (OBSTACLE_SIZE/2);
}

function createBullet(){
    // Create bullet object
    var circleGeometry = new THREE.CircleGeometry( BULLET_RADIUS , 32 );
    var circleMaterial = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
    bullet = new THREE.Mesh( circleGeometry, circleMaterial );

    // Spawn bullet at plane
    bullet.position.x = airplane.position.x;
    bullet.position.y = airplane.position.y;

    scene.add( bullet );
}

function animateBullet(){
    bullet.position.x += 0.5;

    // If the bullet is off the screen, remove it
    if (bullet.position.x > 9) {
        scene.remove(bullet);
        bullet = null;
    }
}

function createMultipleObstacles() {

  spawnLoop = setInterval(() => {

    if (cloud) {
      const yPos = Math.floor(Math.random() * 7) - 3;
      const obst = createObstacle(6, yPos);
      scene.add(obst);
      obstacles.push(obst);
    }

  }, OBSTACLE_INTERVAL);
}

function createObstacle(xpos=0, ypos=0) {
    const obstacle = cloud.clone();
    obstacle.position.x = xpos;
    obstacle.position.y = ypos;
    return obstacle;
}

function animateObstacles() {
    obstacles.forEach(o => {o.position.x -= 0.05});
}

$('#start').click(() => {
  window.addEventListener("keydown", onDocumentKeyDown, false);
  init();
  animate();
  $('#startscreen').hide();
});

$('#restart').click(() => {

  scene.remove(airplane);
  airplane = null;

  obstacles.forEach(item => scene.remove(item));
  obstacles = [];
  id = undefined;
  score = 0;
  scoreText.text(score + '');


  init();
  animate();
  loseScreen.hide();
});

//Listen for window resizes
window.addEventListener('resize', onWindowResize, false);
