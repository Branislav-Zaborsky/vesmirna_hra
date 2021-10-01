// parameters
const cnWidth = 480;
const cnHeight = 528;
const bttnWidth = 60;
const bttnHeight = 30;
const entitySize = 48;
const gameSpeed = 512;
const points = 10;

// ids
const cnvId = "playField";
const bttnId = "start";
const resetId = "reset";
const muteId = "mute";
const debugId = "debug";

// keys
const moveLeft = "71";
const moveRight = "72";
const shoot = "74";

// reosurces
const bgColor = "#001337";
const looseColor = "#FF0000";
const winColor = "#00FF00";
const debugOffColor = "#FF0000";
const debugOnColor = "#00FF00";
const playerImgPath = "resources/player.png";
const missileImgPath = "resources/missile.png";
const alienImgPath = playerImgPath;

// Button texts
const bttnText = "PLAY!";
const resetBttnText = "RESET";
const muteBttnText = "MUTE";
const unmuteBttnText = "UNMUTE";
const debbugBttnText = "DEBUG";

var tableWrapper = null;
var defaultAliens = [1,3,5,7,9,23,25,27,29,31];
var gameMuted = false;
var isDebbug = false;

var deleteOldUI = function(){
    // remove table
    tableWrapper = document.getElementById("space");
    tableWrapper.innerHTML = "";
    // remove button
    let oldButton = document.getElementById("start");
    oldButton.parentNode.removeChild(oldButton);
};
deleteOldUI();

const canvasElem = document.createElement("CANVAS");
const canvasCtx = canvasElem.getContext("2d");
const buttonElem = document.createElement("BUTTON");
const resetBttn = document.createElement("BUTTON");
const muteBttn = document.createElement("BUTTON");
const debugBttn = document.createElement("BUTTON");

// Buttons
const playerImg = new Image();
playerImg.src = playerImgPath;
const missileImg = new Image();
missileImg.src = missileImgPath;
const alienImg = new Image();
alienImg.src = alienImgPath; 

//SFX
const explosionSFX = new Audio("resources/explosion.mp3");
const bgMusic = new Audio("resources/bg_music.wav");

// Buttons
// Play button
buttonElem.id = bttnId;
buttonElem.style.width = bttnWidth + "px";
buttonElem.style.height = bttnHeight + "px";
buttonElem.textContent = bttnText;
// reset button
resetBttn.id = resetId;
resetBttn.style.width = bttnWidth + "px";
resetBttn.style.height = bttnHeight + "px";
resetBttn.style.margin = "30px";
resetBttn.textContent = resetBttnText;
// mute button
muteBttn.id = muteId;
muteBttn.style.width = bttnWidth + 20 + "px";
muteBttn.style.height = bttnHeight + "px";
muteBttn.textContent = muteBttnText;
// debug button
debugBttn.style.width = bttnWidth + "px";
debugBttn.style.height = bttnHeight + "px";
debugBttn.style.margin = "100px";
debugBttn.style.background = debugOffColor;
debugBttn.textContent = debbugBttnText;

tableWrapper.innerHTML = '<p><b>Score:</b><span id="score">0 </span> <b> Level:</b><span id="level">1</span></p>';
const scoreInt = document.getElementById("score");
const levelInt = document.getElementById("level");

function initSpace() {
    let height = cnHeight;

    let ratio = cnWidth / cnHeight;
    let width = height * ratio;

    canvasElem.id = cnvId;
    canvasElem.width = width;
    canvasElem.height = height;
    canvasElem.style.width = width + "px";
    canvasElem.style.height = height + "px"; 
    canvasCtx.fillStyle = bgColor;
    canvasCtx.fillRect(0, 0, cnWidth, cnHeight);

    document.body.appendChild(canvasElem);
    document.body.appendChild(buttonElem);
    document.body.appendChild(resetBttn);
    document.body.appendChild(muteBttn);
    document.body.appendChild(debugBttn);
}
initSpace();

function calcPos(number) {
    return [(number%11) * entitySize - entitySize, Math.floor(number / 11) * entitySize];
}

function addPointsCounter() {
    scoreInt.innerText = parseInt(scoreInt.innerText) + points;
}

function resetPointsCounter() {
    scoreInt.innerText = "0";
}

function addLevelCounter() {
    levelInt.innerText = parseInt(levelInt.innerHTML) + 1;
}

function resetLevelCounter() {
    levelInt.innerText = "1";
}

function drawSpace() {
    canvasCtx.fillStyle = bgColor;
    canvasCtx.fillRect(0, 0, cnWidth, cnHeight);
}

function playBgMusic() {
    bgMusic.currentTime = 0;
    bgMusic.play();   
}

function resetBgMusic() {
    bgMusic.pause();
    bgMusic.currentTime = 0;
}

function playExplosion() {
    printDebug("play explosion");
    explosionSFX.play();
    explosionSFX.currentTime = 0;
}

function printDebug(msg) {
    if (isDebbug){
        console.log(msg);
    }
}

// nakresli mimozemstanov
var aliens = [1,3,5,7,9,23,25,27,29,31];
function drawAliens() {
    var i=0;
    let posX = 0;
    let posY = 0;
    for(i=0;i<aliens.length;i++) {
        [posX, posY] = calcPos(aliens[i]);
        canvasCtx.drawImage(alienImg, posX, posY);
    }
}

// pohybuje mimozemstanmi
var direction = 1;
function moveAliens() {
    var i=0;
    for(i=0;i<aliens.length;i++) {
        aliens[i]=aliens[i]+direction;
    }
    direction *= -1;
}

function lowerAliens() {
    var i=0;
    for(i=0;i<aliens.length;i++) {
        aliens[i]+=11;
    }
}

var ship = 115
function drawShip() {
    let posX = 0;
    let posY = 0;
    [posX, posY] = calcPos(ship);
    canvasCtx.drawImage(playerImg, posX, posY);
}

// nakresli rakety 
var missiles = [];
function drawMissiles() {
    var i=0;
    let posX = 0;
    let posY = 0;
    for(i=0;i<missiles.length;i++) {
        [posX, posY] = calcPos(missiles[i]);
        canvasCtx.drawImage(missileImg, posX, posY);
    }
}

// hybe raketami hore a ak je raketa na hrane tabulky znici ju
function moveMissiles() {
    var i=0;
    for(i=0;i<missiles.length;i++) {
        missiles[i]-=11 ;
        if(missiles[i] < 0) missiles.splice(i, 1); // canvasCtx.fillRect(posX, posY, entitySize, entitySize);
    }
}

function checkKey(e) {
    e = e || window.event;
    // posun lode do lava
    if (e.keyCode == moveLeft) {
        if(ship > 111) {
            ship--;
        }
    }
    // posun lode do prava
    else if (e.keyCode == moveRight && ship < 120) {
        ship++;
    }
    // spawne raketu
    else if (e.keyCode == shoot) {
        missiles.push(ship - 11);
    }
}

function checkCollisionsMA() {
    for(var i=0;i<missiles.length;i++) {
        if(aliens.includes(missiles[i])) {
            var alienIndex = aliens.indexOf(missiles[i]);
            aliens.splice(alienIndex, 1);
            missiles.splice(i, 1);
            addPointsCounter();
            playExplosion();
        }
    }
}

function RaketaKolidujeSVotrelcom() {
    for(var i=0;i<aliens.length;i++) {
        if(aliens[i]>109) {
            return true;
        }
    }
    return false;
}

function loose() {
    canvasCtx.fillStyle = looseColor;
    canvasCtx.fillRect(0, 0, cnWidth, cnHeight);
    canvasCtx.fillStyle = bgColor;
    resetPointsCounter();
    resetLevelCounter();
    resetBgMusic();
    running = false;
}

function win() {
    canvasCtx.fillStyle = winColor;
    canvasCtx.fillRect(0, 0, cnWidth, cnHeight);
    canvasCtx.fillStyle = bgColor;
}

var level = 1;
function nextLevel() {
    level++;
    printDebug('level: '+level);
    direction = 1; // pridal som pretoze niekedy zacinaly mimozemstania moc vlavo
    addLevelCounter();
    if(level==1) aliens = [1,3,5,7,9,23,25,27,29,31];
    if(level==2) aliens = [1,3,5,7,9,13,15,17,19,23,25,27,29,31];
    if(level==3) aliens = [1,5,9,23,27,31];
    if(level==4) aliens = [45,53];
    if(level > 4) {
        level = 1;
        aliens = [1,3,5,7,9,23,25,27,29,31];
        speed = speed / 2;
    }
    gameLoop();
}

var running = false;
function gameLoop() {
    printDebug('gameloop');

    running = true;
    document.addEventListener('keydown',checkKey);

    
    var musicLoop = setInterval(function(){
        printDebug("replaying music");
        playBgMusic();
    }, bgMusic.duration*1000);
    
    var a = 0;
    var loop1 = setInterval(function(){
        moveAliens();
        moveMissiles();
        checkCollisionsMA();
        if(a%4==3) lowerAliens();
        if(RaketaKolidujeSVotrelcom()) {
            clearInterval(loop2);
            clearInterval(loop1);
            clearInterval(musicLoop);
            document.removeEventListener('keydown',checkKey);
            missiles = [];
            drawMissiles();
            loose();
        }
        a++;
    },speed);
    var loop2 = setInterval(function(){
        drawSpace();
        drawAliens();
        drawMissiles();
        drawShip();
        if(aliens.length === 0) {
            clearInterval(loop2);
            clearInterval(loop1);
            clearInterval(musicLoop);
            document.removeEventListener('keydown',checkKey);
            missiles = [];
            drawMissiles();
            win();
            setTimeout(function(){
                nextLevel();
            },1000);
        }
    },speed/2);
}

document.getElementById(bttnId).addEventListener('keydown',function(e){
    e.preventDefault();
    e.stopPropagation();
});
document.getElementById(bttnId).addEventListener('click',function(){
    /*
    */
    if(!running){
        gameLoop();
        playBgMusic();
    } 
});
// reset button eventListener
document.getElementById(resetId).addEventListener("click", function(){
    if (!running) {
        canvasCtx.fillStyle = bgColor;
        canvasCtx.fillRect(0, 0, cnWidth, cnHeight);
        resetPointsCounter();
        resetLevelCounter();
        aliens = defaultAliens;
    }
});
// mute button eventListener
document.getElementById(muteId).addEventListener("click", function() {
    if (!gameMuted) {
        gameMuted = true;
        muteBttn.textContent = unmuteBttnText;
        explosionSFX.muted = gameMuted;
        bgMusic.muted = gameMuted;
    }
    else {
        gameMuted = false;
        muteBttn.textContent = muteBttnText;
        explosionSFX.muted = gameMuted;
        bgMusic.muted = gameMuted;
    }
});
debugBttn.addEventListener("click", function() {
    if (isDebbug){
        isDebbug = false;
        debugBttn.style.background = debugOffColor;
        printDebug("debug-" + isDebbug);
    }
    else {
        isDebbug = true;
        debugBttn.style.background = debugOnColor;
        printDebug("debug-" + isDebbug);
    }
});