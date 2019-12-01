// Gets called when a button is pressed
function onDocumentKeyDown(event) {
    // Plane speed
    var xSpeed = 0.1;
    var ySpeed = 0.1;

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
        createBullet();
    }
};
