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

//function touchDown(){
//    if (pointer.x < window.innerWidth/2)
//        startMoveLeft();
//    else
//        startMoveRight();
//}
//
//function touchUp(){
//    if (pointer.x < window.innerWidth/2)
//        stopMoveLeft();
//    else
//        stopMoveRight();
//}

function generateTouchListeners() {
    var leftListener = PIXI.Sprite.fromImage('empty.png');

    leftListener.position.x = 0;
    leftListener.position.y = 0;

    leftListener.scale.x = window.innerWidth / 2;
    //alert([leftListener.scale.x, window.innerWidth, 2 * SCREEN_RELATIVE_WIDTH]);
    leftListener.scale.y = 2000;


    leftListener.interactive = true;
    leftListener.on('mousedown', function () {
        startMoveLeft();
    });
    leftListener.on('mouseup', function () {
        stopMoveLeft();
    });
    stage.addChild(leftListener);


    var rightListener = PIXI.Sprite.fromImage('empty1.png');

    rightListener.position.x = window.innerWidth / 2;
    rightListener.position.y = 0;

    rightListener.scale.x = window.innerWidth / 2;
    rightListener.scale.y = 2000;


    rightListener.interactive = true;
    rightListener.on('mousedown', function () {
        startMoveRight();
    });
    rightListener.on('mouseup', function () {
        stopMoveRight();
    });
    stage.addChild(rightListener);

}