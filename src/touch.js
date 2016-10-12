/**
 * Created by romanismagilov on 11.10.16.
 */
function keyPressed(keyCode) {
    if (keyCode == 37
        || keyCode == 65) {
        startMoveLeft();
    } else if (keyCode == 39
        || keyCode == 68) {
        startMoveRight();
    }
}

function keyUp(keyCode) {

}