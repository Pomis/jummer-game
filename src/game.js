var renderer = new PIXI.WebGLRenderer(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.view);

var stage = new PIXI.Container();

var START_SPEED = -9;
var DIFFICULTY_FACTOR = 0.7;
var SPEED_FACTOR = 3;
var MAX_CAMERA_SPEED = 4.7;

var OBSTACLE_RELATIVE_WIDTH = 500;
var SCREEN_RELATIVE_WIDTH = 1000;
var CHAR_RELATIVE_HEIGHT = 410;


var movables = [];
var backgrounds = [];
var obstacles = [];
var bunny = null;

var moving = false;
var speedx = 0;
var speedy = START_SPEED;

main();

function main() {
    PIXI.loader.add('bunny', 'cock.png').load(function (loader, resources) {
        bunny = new PIXI.Sprite(resources.bunny.texture);

        bunny.position.x = 400;
        bunny.position.y = 200;

        bunny.scale.x = 0.3;
        bunny.scale.y = 0.3;

        stage.addChild(bunny);


        generateStartObstacles(window.innerHeight);


        animate();
    });

    background(-1000);
}

function background(offset) {
    if (offset < window.innerHeight) {
        var bgPart = PIXI.Sprite.fromImage('bg1.png');

        bgPart.position.x = 0;
        bgPart.position.y = offset;

        bgPart.scale.x = window.innerWidth / SCREEN_RELATIVE_WIDTH;
        bgPart.scale.y = window.innerWidth / SCREEN_RELATIVE_WIDTH;

        stage.addChild(bgPart);
        movables.push(bgPart);
        backgrounds.push(bgPart);
        background(offset + 300 * bgPart.scale.y);
    }
}

function generateStartObstacles(offset) {
    if (offset > bunny.position.y - window.innerHeight) {
        var bgPart = PIXI.Sprite.fromImage('obs1.png');


        bgPart.scale.x = window.innerWidth / SCREEN_RELATIVE_WIDTH;
        bgPart.scale.y = window.innerWidth / SCREEN_RELATIVE_WIDTH;

        bgPart.position.x = window.innerWidth * Math.random() - OBSTACLE_RELATIVE_WIDTH * bgPart.scale.x / 2;
        bgPart.position.y = offset;

        stage.addChild(bgPart);
        movables.push(bgPart);
        obstacles.push(bgPart);
        generateStartObstacles(offset - window.innerHeight * DIFFICULTY_FACTOR * bgPart.scale.y);
    }
}

function animate() {
    requestAnimationFrame(animate);

    //bunny.rotation += 0.01;
    bunny.position.x += speedx;

    moveObjects();
    collide();

    speedx *= 0.95;
    speedy += 0.098;


    renderer.render(stage);
}

function moveObjects() {
    var charYBuffer = 0;
    // Char
    charYBuffer += speedy;

    var cameraSpeed;
    if (-speedy < MAX_CAMERA_SPEED)
        cameraSpeed = -speedy;
    else cameraSpeed = MAX_CAMERA_SPEED;
    if (speedy > 0)
        cameraSpeed = MAX_CAMERA_SPEED;
    // Camera
    if (bunny.position.y < window.innerHeight / 8) {
        for (var i in movables) {
            movables[i].position.y += cameraSpeed;
        }
        charYBuffer += cameraSpeed;
    }


    bunny.position.y += charYBuffer;

}

function collide() {
    if (speedy > 0)
        for (var i in obstacles) {
            if (closeTo(obstacles[i])) {
                speedy = START_SPEED;
                //OBSTACLE_RELATIVE_WIDTH *= 0.95;
                convertObstacle();
            }
        }
}

function convertObstacle() {
    var donnestObstacle = obstacles[0];
    var highestObstacle = obstacles[obstacles.length - 1];
    for (var i in obstacles) {
        if (obstacles[i].y > donnestObstacle.y)
            donnestObstacle = obstacles[i];
        if (obstacles[i].y < highestObstacle.y)
            highestObstacle = obstacles[i];
    }
    donnestObstacle.y = highestObstacle.y - window.innerHeight * DIFFICULTY_FACTOR * highestObstacle.scale.y;
    donnestObstacle.position.x = window.innerWidth * Math.random() - OBSTACLE_RELATIVE_WIDTH * bgPart.scale.x / 2;
}

function convertBackground() {
    var donnestBg = backgrounds[0];
    var highestBg = backgrounds[backgrounds.length - 1];
    for (var i in backgrounds) {
        if (backgrounds[i].y > donnestBg.y)
            donnestBg = backgrounds[i];
        if (backgrounds[i].y < highestBg.y)
            highestBg = backgrounds[i];
    }
    donnestBg.y = highestBg.y - window.innerHeight * DIFFICULTY_FACTOR * highestBg.scale.y;
}

function closeTo(obstacle) {
    return obstacle.y - CHAR_RELATIVE_HEIGHT * bunny.scale.y / 2 > bunny.position.y
        && obstacle.y - CHAR_RELATIVE_HEIGHT * bunny.scale.y * 2 / 3 < bunny.position.y
        && obstacle.position.x + OBSTACLE_RELATIVE_WIDTH * obstacle.scale.x > bunny.position.x
        && obstacle.position.x < bunny.position.x
        ;
}

function startMoveLeft() {
    moving = true;
    speedx -= SPEED_FACTOR;
}

function startMoveRight() {
    moving = true;
    speedx += SPEED_FACTOR;
}