let camera, scene, renderer, airplane, bullet;

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

    // Init BoxGeometry object (rectangular cuboid)
    const geometry = new THREE.BoxGeometry(1, 0.3, 0.1);

    // Create material with color
    const material = new THREE.MeshBasicMaterial({ color: 0xffffff });

    // Add texture - 
    // const texture = new THREE.TextureLoader().load('textures/crate.gif');

    // Create material with texture
    // const material = new THREE.MeshBasicMaterial({ map: texture });

    // Create mesh with geo and material
    airplane = new THREE.Mesh(geometry, material);

    // Add to scene
    scene.add(airplane);

    // Position plane on the left side
    airplane.position.x = -6;

    // Position camera
    camera.position.z = 5;
}

// Draw the scene every time the screen is refreshed
function animate() {
    requestAnimationFrame(animate);

    if(bullet) animateBullet();

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

function createBullet(){
    // Create bullet object
    var circleGeometry = new THREE.CircleGeometry( 0.1 , 32 );
    var circleMaterial = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
    bullet = new THREE.Mesh( circleGeometry, circleMaterial );

    // Spawn bullet at plane
    bullet.position.x = airplane.position.x;
    bullet.position.y = airplane.position.y;

    scene.add( bullet );
}

function animateBullet(){
    bullet.position.x += 0.5
    console.log(bullet.position.x);

    // If the bullet is off the screen, remove it
    if (bullet.position.x > 9) {
        bullet = null;
        scene.remove(bullet);
        console.log("Remove bullet");
    }
}

// Listen for keypresses
window.addEventListener("keydown", onDocumentKeyDown, false);

//Listen for window resizes
window.addEventListener('resize', onWindowResize, false);

init();
animate();
