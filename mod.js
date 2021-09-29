console.log("Running mod.js"); // :-)

// paramerte
const cnWidth = 480;
const cnHeight = 528;
const bttnWidth = 60;
const bttnHeight = 30;
const entityWidth = 48;
const entityheight = 48;
const gameSpeed = 512;

const cnvId = "playField";
const bttnId = "start";

const bttnText = "PLAY!";

const bgColor = "#001337";

const playerImgPath = "resources/player.jpg";
const missileImgPath = "";

var playerPos = [];

// odstranim najprv staru tabulku
var deleteOldUI = function(){
    // remove table
    let tableWrapper = document.getElementById("space");
    tableWrapper.innerHTML = "";
    // remove button
    let oldButton = document.getElementById("start");
    oldButton.parentNode.removeChild(oldButton);
};
deleteOldUI();

// vytvorim canvas element a button element
var canvasElem = document.createElement("CANVAS");
var canvasCtx = canvasElem.getContext("2d");
var buttonElem = document.createElement("BUTTON");
var playerImg = new Image();
var missileImg = new Image();

var setUpCanvas = function(){
    let height = cnHeight;

    let ratio = cnWidth / cnHeight;
    let width = height * ratio;

    canvasElem.id = cnvId;
    canvasElem.width = width;
    canvasElem.height = height;
    canvasElem.style.width = width + "px";
    canvasElem.style.height = height + "px"; 
    canvasCtx.fillStyle = bgColor;
    let background = canvasCtx.fillRect(0, 0, cnWidth, cnHeight);

    buttonElem.id = bttnId;
    buttonElem.style.width = bttnWidth + "px";
    buttonElem.style.height = bttnHeight + "px";
    buttonElem.textContent = bttnText;
    
    document.body.appendChild(canvasElem);
    document.body.appendChild(buttonElem);

    playerImg.src = playerImgPath;
    missileImg.src = playerImgPath;
};
setUpCanvas();

class Player{
    
    constructor(cnvCtx, width, height, size, img){
        this.cnvCtx = cnvCtx;
        this.cnWidth = width;
        this.playerSize = size;
        this.playerPosX = (width - size) / 2 + (size / 2);
        this.playerPosY = (height - size);
        this.skin = img;
    };

    render = function(){
        console.log(this.playerPosX, this.playerPosY);
        this.playerImg = this.cnvCtx.drawImage(this.skin, this.playerPosX, this.playerPosY);
        
    };

    moveRight = function(){
        if (this.playerPosX < this.cnWidth - this.playerSize) {
            // zamaluje predchadzajucu poziciu
            this.cnvCtx.fillRect(this.playerPosX, this.playerPosY, this.playerSize, this.playerSize);
            this.playerPosX += this.playerSize;
            console.log(this.playerPosX);
        }
    };

    moveLeft = function(){
        if (this.playerPosX > 0) {
            this.cnvCtx.fillRect(this.playerPosX, this.playerPosY, this.playerSize, this.playerSize);
            this.playerPosX -= this.playerSize;
            console.log(this.playerPosX);
        }
    };
};

class Missile{
    constructor(cnvCtx, height, size, img){
        this.cnvCtx = cnvCtx;
        this.cnHeight = height;
        this.missileSize = size;
        this.skin = img;
    };
};

function playerInput(e){
    e = e || window.event;
    // posun dolava
    if (e.keyCode == "71") {
        player.moveLeft();
    }
    // posun doprava
    else if (e.keyCode == "72") {
        player.moveRight();
    }
    // shoot
    else if (e.keyCode == "74") {
        
    }
};

var running = false;
let player = new Player(canvasCtx, cnWidth, cnHeight, entityWidth, playerImg)
// main game loop
var mainGameLoop = function(){
    running = true;

    document.addEventListener("keydown", playerInput);

    // loop ktory bude vykreslovat vsetko
    var drawLoop = setInterval(function(){
        player.render();
    }, gameSpeed);

    // loop ktory bude detekovat zasahy
    var hitDetectLoop = setInterval(function(){
    }, gameSpeed);
};

document.getElementById(bttnId).addEventListener('click',function(e){
    e.preventDefault();
    e.stopPropagation();
    if(!running) mainGameLoop();
});