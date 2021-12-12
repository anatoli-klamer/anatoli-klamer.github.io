let readyToPutHero = false;
let heroElem = null;
let hero2Elem = null;
let red = [];

function startLevel() {
    const lvl = parseInt(document.getElementById('lvl').value);
    const interval = 1000 - lvl * 35;
    const intruders = lvl;
    gamefield = document.getElementById("gamefield");
    gamefield.innerHTML = '';

    const walls = lvl * 3;
    startGame(20, 20, intruders, interval, walls);
}
setTimeout(startLevel, 1000);

let gamefield;
let maxWidth = 30;
let maxHeight = 30;
const emptyCell = "";
var audioWall;// = new Audio('audio_wall.mp3');
var audioMove;// = new Audio('audio_move.mp3');
var audioBoom = new Audio('audio_boom.wav');
var audioStep = new Audio('step.wav');

function startGame(w, h, redNumber, intruderInterval, nWalls) {
    maxWidth = w;
    maxHeight = h;

    const tbl = document.createElement("table");

    for (let i = 0; i < maxWidth; i++) {
        const tr = tbl.insertRow();
        for (let j = 0; j < maxHeight; j++) {
            const td = tr.insertCell();
            td.appendChild(document.createTextNode(emptyCell));
            //td.style.border = "1px solid black";
            td.onclick = (e) => buildWall(e.target);
            td.i = i;
            td.j = j;
            td.setAttribute("data-i", i.toString())
            td.setAttribute("data-j", j.toString())
            td.setAttribute("data-ij", i.toString() + '-' + j.toString())

            randomInt()
        }
    }

    gamefield.appendChild(tbl);

    heroElem = getBlue();
    hero2Elem = getGreen();
    for (let i = 0; i < redNumber; i++) {
        red[i] = getRed();

        red[i].targetHero = i % 2 == 0 ? heroElem : hero2Elem;

        findTd(randomInt(0, maxWidth), randomInt(0, maxHeight), red[i]);

        setInterval(() => {
            moveIntruder(red[i], getRandomDirection(), getRandomDirection())
        }, intruderInterval);
    }

    findTd(maxWidth - 1, 0, heroElem);
    findTd(0, maxWidth - 1, hero2Elem);

    listenKeyboard();

    var walls =
        Array.from({ length: nWalls })
            .map(() => ({
                i: randomInt(0, maxHeight),
                j: randomInt(0, maxWidth)
            }))
            .forEach((wall) => {
                const i = wall.i;
                const j = wall.j;
                const elem = document.querySelectorAll(`[data-ij='${i}-${j}']`)[0];
                if (elem) {
                    buildWall(elem)
                }
            })


}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function buildWall(elem) {

    const yellow = "yellow";
    const wallColor = "gray";
    const white = "white";
    if (readyToPutHero) {
        readyToPutHero = false;
        if (heroElem) {
            heroElem.remove()
        }
        heroElem = getBlue();
        elem.appendChild(heroElem);
        elem.style.backgroundColor = white;
        heroElem.i = elem.i;
        heroElem.j = elem.j;
        return;
    }

    if (!elem.cellType) {
        elem.cellType = 'wall';
        elem.style.backgroundColor = wallColor;

    } else {
        elem.cellType = '';
        elem.style.backgroundColor = white;
    }
}

function getBlue() {
    const img = document.createElement("img");
    img.src = "blue.png";
    img.heroType = 'blue'
    return img;
}
function getGreen() {
    const img = document.createElement("img");
    img.src = "green.png";
    img.heroType = 'green'
    return img;
}
function getRed() {
    const img = document.createElement("img");
    img.src = "red.png";
    img.heroType = 'red'
    return img;
}
function getBoom() {
    const img = document.createElement("img");
    img.src = "boom.png";
    img.heroType = 'boom'
    return img;
}

function findTd(i, j, elem) {
    const newPlace = document.querySelectorAll(`[data-ij='${i}-${j}']`)[0];
    if (!newPlace || newPlace.cellType === 'wall') {
        audioWall && audioWall.play();
        return;
    }
    if (newPlace.cellType) {
        const boomed = newPlace.cellType;
        if (newPlace.cellType == 'boom') {
            return
        }
        if (newPlace.firstElementChild && elem && newPlace.cellType !== elem.heroType) {
            audioBoom && audioBoom.play();
            newPlace.firstElementChild.remove();
            newPlace.appendChild(getBoom())
            newPlace.cellType = 'boom';
            if (elem.heroType == 'red') {
                if (boomed === 'blue') {
                    elem.targetHero = hero2Elem;
                } else {
                    elem.targetHero = heroElem;
                }
            }
        } else {
            newPlace.cellType = ''
        }

        return;
    }
    audioMove && audioMove.play();
    elem.remove();

    if (elem.parentElement) {
        elem.parentElement.cellType = '';
    }

    newPlace.appendChild(elem);
    elem.i = i;
    elem.j = j;
    newPlace.cellType = elem.heroType;
    audioStep && audioStep.play();
}

function moveAmongUs(elem, i, j) {
    const ii = elem.i + i;
    const jj = elem.j + j;
    findTd(ii, jj, elem)
}
function moveIntruder(elem) {
    const elemDst = elem.targetHero;
    let ii = 0;
    let jj = 0;
    if (elemDst.i > elem.i) {
        ii = getRandomDirection();
    } else {
        ii = -getRandomDirection();
    }
    if (elemDst.j > elem.j) {
        jj = getRandomDirection();
    } else {
        jj = -getRandomDirection();
    }
    const i = elem.i + ii;
    const j = elem.j + jj;
    findTd(i, j, elem)
}

function getRandomDirection() {
    const r = Math.random();
    if (r > 0.5) return 1;
    return 0;
}

function listenKeyboard() {
    document.addEventListener("keydown", function (event) {
        const key = event.key;
        console.log(key);
        processKeyDown(key);

        event.preventDefault();
    });
}

function processKeyButton(event) {
    processKeyDown(event)
}
function processKeyDown(key) {
    switch (key) {
        case 'ArrowUp': {
            moveAmongUs(heroElem, -1, 0);
            break;
        }
        case 'ArrowDown': {
            moveAmongUs(heroElem, +1, 0);
            break;
        }
        case 'ArrowRight': {
            moveAmongUs(heroElem, 0, 1);
            break;
        }
        case 'ArrowLeft': {
            moveAmongUs(heroElem, 0, -1);
            break;
        }
        //green
        case 'w': {
            moveAmongUs(hero2Elem, -1, 0);
            break;
        }
        case 's': {
            moveAmongUs(hero2Elem, +1, 0);
            break;
        }
        case 'd': {
            moveAmongUs(hero2Elem, 0, 1);
            break;
        }
        case 'a': {
            moveAmongUs(hero2Elem, 0, -1);
            break;
        }
        default: {
            return;
            break;
        }
    }
}

