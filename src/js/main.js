let camera, scene, renderer, cube;

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
    cube = new THREE.Mesh(geometry, material);

    // Add to scene
    scene.add(cube);

    // Position plane on the left side
    cube.position.x = -6;

    // Position camera
    camera.position.z = 5;
}

// Draw the scene every time the screen is refreshed
function animate() {
    requestAnimationFrame(animate);

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
    var xSpeed = 0.1;
    var ySpeed = 0.1;

    var keyCode = event.which;
    // Up Arrow
    if (keyCode == 38) {
        cube.position.y += ySpeed;
    }
    // Down Arrow
    else if (keyCode == 40) {
        cube.position.y -= ySpeed;
    } 
    // Left Arrow
    else if (keyCode == 37) {
        cube.position.x -= xSpeed;
    } 
    // Right Arrow
    else if (keyCode == 39) {
        cube.position.x += xSpeed;
    }
};

// Listen for keypresses
window.addEventListener("keydown", onDocumentKeyDown, false);

//Listen for window resizes
window.addEventListener('resize', onWindowResize, false);

init();
animate();
