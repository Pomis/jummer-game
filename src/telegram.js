/**
 * Created by romanismagilov on 13.10.16.
 */
function setScore(localScore){

}

function getHighscoreFromTg(tgScore){
    highscore = tgScore;
}

function httpAsync(theUrl, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    };
    xmlHttp.open("POST", theUrl, true);
    xmlHttp.send(null);
}