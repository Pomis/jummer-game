var renderer = new PIXI.WebGLRenderer(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.view);

var stage = new PIXI.Container();
var pointer = renderer.plugins.interaction.mouse.global;
var START_SPEED = -15;
var DIFFICULTY_FACTOR = 0.8;
var SPEED_FACTOR = 3;
var DECCELERATION_FACTOR = 0.95;

var OBSTACLE_RELATIVE_WIDTH = 500;
var SCREEN_RELATIVE_WIDTH = 1000;
var CHAR_RELATIVE_HEIGHT = 410;
var CHAR_RELATIVE_WIDTH = 200;


var movables = [];
var backgrounds = [];
var obstacles = [];
var bunny = null;

var moving = false;
var speedx = 0;
var speedy = START_SPEED;
var acceleration = 0;
var score = 0;
var distance = 0;

var richText;


main();

function main() {
    PIXI.loader.add('bunny', 'cock.png').load(function (loader, resources) {
        bunny = new PIXI.Sprite(resources.bunny.texture);
        bunny.zOrder = 111;

        bunny.position.x = 400;
        bunny.position.y = 200;

        bunny.scale.x = 0.3;
        bunny.scale.y = 0.3;

        stage.addChild(bunny);


        generateStartObstacles(window.innerHeight);

        initScore();
        animate();
    });

    background(-10000);
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
        background(offset + 600 * bgPart.scale.y);
    }
}

function generateStartObstacles(offset) {
    if (offset > bunny.position.y - window.innerHeight) {
        var bgPart = PIXI.Sprite.fromImage('obs1.png');


        bgPart.scale.x = window.innerWidth / SCREEN_RELATIVE_WIDTH;
        bgPart.scale.y = window.innerWidth / SCREEN_RELATIVE_WIDTH;

        bgPart.position.x = (window.innerWidth - OBSTACLE_RELATIVE_WIDTH * bgPart.scale.x / 2)* Math.random();
        bgPart.position.y = offset;

        stage.addChild(bgPart);
        movables.push(bgPart);
        obstacles.push(bgPart);
        generateStartObstacles(offset - window.innerHeight * DIFFICULTY_FACTOR * bgPart.scale.y);
    }
}

function checkDistance() {
    if (distance>600 * backgrounds[0].scale.y){
        distance = 0;
        convertBackground();
    }
}
function animate() {
    requestAnimationFrame(animate);

    moveCharY();
    moveObjects();
    collide();
    updateScore();
    checkDistance();
    checkLose();

    if (!moving) speedx *= DECCELERATION_FACTOR;
    speedy += 0.3;

    renderer.render(stage);
}
//bunny.rotation += 0.01;
function moveCharY() {
    bunny.position.x += speedx;
    if (bunny.position.x <= 0)
        bunny.position.x = 0;
    if (bunny.position.x >= (SCREEN_RELATIVE_WIDTH - CHAR_RELATIVE_WIDTH / 2) * window.innerWidth / SCREEN_RELATIVE_WIDTH)
        bunny.position.x = (SCREEN_RELATIVE_WIDTH - CHAR_RELATIVE_WIDTH / 2) * window.innerWidth / SCREEN_RELATIVE_WIDTH;
}

function initScore(){
    var style = {
        fontFamily : 'Arial',
        fontSize : '36px',
        fontStyle : 'italic',
        fontWeight : 'bold',
        fill : '#F7EDCA',
        stroke : '#4a1850',
        strokeThickness : 5,
        dropShadow : true,
        dropShadowColor : '#000000',
        dropShadowAngle : Math.PI / 6,
        dropShadowDistance : 6,
        wordWrap : true,
        wordWrapWidth : 440
    };

    richText = new PIXI.Text("0",style);
    richText.x = 0;
    richText.y = 7*window.innerHeight/8;
    richText.text = "0";

    stage.addChild(richText);
}

function updateScore(){
    richText.text = Math.floor(score);
}
function moveObjects() {
    var charYBuffer = 0;
    // Char
    charYBuffer += speedy;


    var cameraSpeed;

    cameraSpeed = speedy < 0 ? -speedy : 0;

    // Camera
    if (bunny.position.y < window.innerHeight / 8) {
        for (var i in movables) {
            movables[i].position.y += cameraSpeed;
        }
        score += cameraSpeed;
        distance += cameraSpeed;
        charYBuffer += cameraSpeed;
    }


    bunny.position.y += charYBuffer;
    accelerate();
}

function checkLose() {
    if (bunny.position.y + 30 > window.innerHeight){
        lose();
    }
}

function lose() {
    var bgPart = PIXI.Sprite.fromImage('bg1.png');

    bgPart.position.x = 0;
    bgPart.position.y = 0;

    bgPart.scale.x = window.innerWidth / SCREEN_RELATIVE_WIDTH;
    bgPart.scale.y = 1000 / window.innerHeight;

    stage.addChild(bgPart);

    var style = {
        fontFamily : 'Arial',
        fontSize : '36px',
        fontStyle : 'italic',
        fontWeight : 'bold',
        fill : '#F7EDCA',
        stroke : '#4a1850',
        strokeThickness : 5,
        dropShadow : true,
        dropShadowColor : '#000000',
        dropShadowAngle : Math.PI / 6,
        dropShadowDistance : 6,
        wordWrap : true,
        wordWrapWidth : 440
    };

    richText = new PIXI.Text("0",style);
    richText.x = window.innerWidth/7;
    richText.y = 5*window.innerHeight/8;
    richText.text = "Your score:\n"+Math.floor(score);

    stage.addChild(richText);
}


function collide() {
    if (speedy > 0)
        for (var i in obstacles) {
            if (closeTo(obstacles[i])) {
                speedy = START_SPEED;
                convertObstacle();
                //convertBackground();
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
    donnestObstacle.scale.x *= 0.9;
    donnestObstacle.y = highestObstacle.y - window.innerHeight * DIFFICULTY_FACTOR * highestObstacle.scale.y;
    donnestObstacle.position.x = (window.innerWidth - OBSTACLE_RELATIVE_WIDTH * donnestObstacle.scale.x)* Math.random();
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
    donnestBg.position.y = highestBg.position.y - 600 * highestBg.scale.y;
}

function closeTo(obstacle) {
    return obstacle.y - CHAR_RELATIVE_HEIGHT * bunny.scale.y / 2 > bunny.position.y
        && obstacle.y - CHAR_RELATIVE_HEIGHT * bunny.scale.y * 2 / 3 < bunny.position.y
        && obstacle.position.x < bunny.position.x+ CHAR_RELATIVE_WIDTH*bunny.scale.x/2
        && obstacle.position.x + OBSTACLE_RELATIVE_WIDTH * obstacle.scale.x > bunny.position.x + CHAR_RELATIVE_WIDTH*bunny.scale.x/2
        ;
}

function accelerate() {
    speedx += acceleration;
    if (moving) {
        acceleration += acceleration / Math.abs(acceleration) * SPEED_FACTOR * 0.01;
    }
}

function startMoveLeft() {
    moving = true;
    acceleration = -0.1;
}

function startMoveRight() {
    moving = true;
    acceleration = +0.1;
}

function stopMoveLeft() {
    moving = false;
    acceleration = 0;
    speedx *= 0.5;
}

function stopMoveRight() {
    moving = false;
    acceleration = 0;
    speedx *= 0.5;

}
