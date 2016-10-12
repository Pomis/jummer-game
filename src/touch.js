function keyDown(keyCode) {
    if (keyCode == 37
        || keyCode == 65) {
        startMoveLeft();
    } else if (keyCode == 39
        || keyCode == 68) {
        startMoveRight();
    }
}

function keyUp(keyCode) {
    if (keyCode == 37
        || keyCode == 65) {
        stopMoveLeft();
    } else if (keyCode == 39
        || keyCode == 68) {
        stopMoveRight();
    }
}

function touchDown(){
    if (pointer.x < window.innerWidth/2)
        startMoveLeft();
    else
        startMoveRight();
}

function touchUp(){
    if (pointer.x < window.innerWidth/2)
        stopMoveLeft();
    else
        stopMoveRight();
}