// vytvori tabulku s riadkami a vsetkym
function initSpace() {
    var space = document.getElementById('space').querySelector('table');
    space.innerHTML = '';
    var p = 0;
    for(var i=0;i<11;i++) {
        var tr = document.createElement('tr');
        for(var j=0;j<11;j++) {
            var td = document.createElement('td');
            td.id = 'p'+p;
            td.innerHTML = p;
            tr.appendChild(td);
            p++;
        }
        space.appendChild(tr);
    }
}
initSpace();

// nastavi farbu pre kazdy stvorec tabulky
function drawSpace() {
    var i=0;
    for(i=0;i<99;i++) {
        document.getElementById('p'+i).style.background = '#202020';
    }
}

// nakresli mimozemstanov
var aliens = [1,3,5,7,9,23,25,27,29,31];
function drawAliens() {
    var i=0;
    for(i=0;i<aliens.length;i++) {
        document.querySelector('#p'+aliens[i]).style.background = 'green';
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
// znizi mimozemstanov
function lowerAliens() {
    var i=0;
    for(i=0;i<aliens.length;i++) {
        aliens[i]+=11;
    }
}

// nakresli lod 
var ship = [104,114,115,116];
function drawShip() {
    var i=0;
    for(i=99;i<121;i++) {
        document.getElementById('p'+i).style.background = '#202020';
    }
    for(i=0;i<ship.length;i++) {
        document.getElementById('p'+ship[i]).style.background = 'white';
    }
}

// nakresli rakety 
var missiles = [];
function drawMissiles() {
    var i=0;
    var list = [];
    for(i=0;i<missiles.length;i++) {
        list.push('#p'+missiles[i]);
    }
    document.getElementById('cssmissile').innerHTML = list.join(',')+'{background: red !important;}';
}

// hybe raketami hore a ak je raketa na hrane tabulky znici ju
function moveMissiles() {
    var i=0;
    for(i=0;i<missiles.length;i++) {
        missiles[i]-=11 ;
        if(missiles[i] < 0) missiles.splice(i,1);
    }
}


function checkKey(e) {
    e = e || window.event;
    // posun lode do lava
    if (e.keyCode == '37') {
        if(ship[0] > 100) {
            var i=0;
            for(i=0;i<ship.length;i++) {
                ship[i]--;
            }
        }
    }
    // posun lode do prava
    else if (e.keyCode == '39' && ship[0] < 108) {
        var i=0;
        for(i=0;i<ship.length;i++) {
            ship[i]++;
        }
    }
    // spawne raketu
    else if (e.keyCode == '32') {
        missiles.push(ship[0]-11);
    }
}

// skontroluje ci nedoslo ku kolizii a znici vorelca aj raketu
function checkCollisionsMA() {
    for(var i=0;i<missiles.length;i++) {
        if(aliens.includes(missiles[i])) {
            var alienIndex = aliens.indexOf(missiles[i]);
            aliens.splice(alienIndex, 1);
            missiles.splice(i, 1);
        }
    }
}

// 
function RaketaKolidujeSVotrelcom() {
    for(var i=0;i<aliens.length;i++) {
        if(aliens[i]>98) {
            return true;
        }
    }
    return false;
}

function loose() {
    var i=0;
    for(i=0;i<121;i++) {
        document.getElementById('p'+i).style.background = 'red';
    }
    running = false;
}

function win() {
    var i=0;
    for(i=0;i<121;i++) {
        document.getElementById('p'+i).style.background = 'green';
    }
}

// nastavi hodnoty pre dalsi level
var level = 1;
var speed = 512;
function nextLevel() {
    level++;
    console.log('level: '+level);
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
    console.log('gameloop');

    running = true;
    document.addEventListener('keydown',checkKey);

    var a = 0;
    var loop1 = setInterval(function(){
        moveAliens();
        moveMissiles();
        checkCollisionsMA();
        if(a%4==3) lowerAliens();
        if(RaketaKolidujeSVotrelcom()) {
            clearInterval(loop2);
            clearInterval(loop1);
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

document.getElementById('start').addEventListener('keydown',function(e){
    e.preventDefault();
    e.stopPropagation();
});
document.getElementById('start').addEventListener('click',function(){
    /*
    */
    if(!running) gameLoop();
});

