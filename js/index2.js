//Game Settings
let boardSize = 7;
let redMoves = true;
let reverseMoveOn = false;



//DOM
const container = document.querySelector(".container");
const board = document.getElementById("board");

//local storage settings pre-set
function setBackgroundColor() {redMoves ? container.style.background = '#a81d1d' : container.style.background = '#1b3d99';}
setBackgroundColor();

//make an odd number for size and make sure it is an integer like 1 not 1.1 or 1.2
let boardSquare = Math.pow(boardSize,2);
//The lines each team of peaces occupy vertically
let chipVerticalReach = Math.round(boardSize / 4) || 7;


//LIVE STATUS
let time = 0;
let moves = {
  red: 0,
  blue: 0,
};



//LIVE STATUS
//DOM
const liveTime = document.getElementById('live-time');
const liveMove = document.getElementById('live-move');

let timeString = '00:00';

function updateSecondsTime() {
  time++;
  let minute = Math.trunc(time / 60);
  let second = time - minute * 60;
  
  let minuteDisplay = minute < 10 ? `0${minute}` : minute;
  let secondDisplay = second < 10 ? `0${second}` : second;

  timeString = `${minuteDisplay}:${secondDisplay}`;
  liveTime.innerText = timeString;
}

let secondsTick = null;

function setTimer(type,tick) {
  if (type == 'play') {
    secondsTick = setInterval(updateSecondsTime,tick = 1000);
  } else if (type == 'pause') {
    clearInterval(secondsTick);
  }
}

//default start time whI can edit
setTimer('play');

//GAME SeTTINGS DOM FUNCTION

//DOM
const settingsButton = document.getElementById('settings-button');
const settingsBoard = document.getElementById('settings-board');

settingsButton.onclick = ()=>{
  let toggleType = settingsBoard.style.display == 'none' ? 'block' : 'none';
  settingsBoard.style.display = toggleType;
  liveTime.classList.toggle('live-stat-blink');
  if (toggleType == 'block') {
    setTimer('pause');
  } else if (toggleType == 'none') {
    setTimer('play');
  }
}























//Game data
let selected;
let isTileUp = false;
let isRequireTake = false;
let countedRisks = 0;


let lastRiskChip = null;
let lastRiskFocusArr = [];
let lastStepTile = null;

let lastCheckedTile = null;



//set board grid
board.setAttribute('style',`grid-template: repeat(${boardSize},1fr) / repeat(${boardSize},1fr);`)

for (let i=0; i <= boardSquare; i++) {
 let tile = document.createElement("div");
 tile.classList.add("tile");
 board.appendChild(tile);
}

let tileSelect = document.querySelectorAll("#board > .tile");


//Write position of each tile and set it to it

for (let i = 0; i < boardSquare; i+=boardSize) {
 let y = i / boardSize;
 for (let t = 0; t < boardSize;t++) {
  tileSelect[i+t].id = `${t},${y}`;
 }
}


//Add the default pieces in position
function fillOddtiles (start, end, nodeSelect,node) {
 for (let i = start; i < end; i++) {
  if (!(i % 2)) {
   nodeSelect[i].innerHTML = node;
  }
 }
}

//set firstMover class name in the bottom area


fillOddtiles(0, boardSize * chipVerticalReach,tileSelect,`<div class=${redMoves ? 'blue-piece' : 'red-piece'}></div>`);
fillOddtiles(boardSquare - (boardSize * chipVerticalReach), boardSquare,tileSelect,`<div class=${redMoves ? 'red-piece' : 'blue-piece'}></div>`);



//Check conditions for move, make move

let pieceSelect = document.querySelectorAll("#board .tile > div");
let oddTiles = document.querySelectorAll("#board > .tile:nth-child(odd)");

for (t of oddTiles) {
 t.onclick = (e)=>{
  //the newMover function to not repeat character rewriting for some reason
  function newMover() {
    //update moves of the players' chip
    redMoves ? moves.red++ : moves.blue++;
    redMoves = redMoves ? false : true;
    setBackgroundColor()
    isTileUp = false;
   //console.log(redMoves)

   //CHECK NEXT MOVER IF VIEWS ANY OPPONENT'S RISK
   let chipClassName = redMoves ? "red-piece" : "blue-piece";
   let moverChipSelect = document.querySelectorAll('.'+chipClassName);
   document.querySelectorAll(".step-tile").forEach((e)=>{e.classList.remove('step-tile')});

   document.querySelectorAll('.jump-tile').forEach((e)=>{e.classList.remove('jump-tile'); console.log(e)});
   lastStepTile = null;


   ///CHECHK IT HERE KHKSJDVNKJSDVNDSLKVJBNLSDKJVBNSLD           THE DELAY AND RISK CHECK TIMING IS KINDA OFF IN THE SETTIMEOUT 
   lastRiskFocusArr.length = 0;
   for(let moverChip of moverChipSelect) {
     //moverChip.innerText = ':-)';
     checkFeedingRisks(moverChip);
     let checkedTileSelect = document.querySelectorAll('.checked-tile') || null;
     checkedTileSelect ? checkedTileSelect.forEach((e)=>{
      e.classList.remove('checked-tile');
    }) : false; 
  }
    selected.classList.remove("focus-select");
    //alert('ran');
    //console.log('checked');
    
    liveMove.innerText = `${moves.red}/${moves.blue}`
    //Check next mover chip if it's over 
    checkIfLose();
  }


  let targetTile = e.target;

  let stepTileSelect = document.querySelectorAll('.step-tile');
  let isJumpingMove = stepTileSelect ? stepTileSelect.length > 1 : false;
 
  if (isJumpingMove && isTileUp && e.target.classList.contains('step-tile') && e.target.classList.contains('jump-tile')) {
    //alert(isJumpingMove);
   lastStepTile.appendChild(selected);
   document.querySelectorAll('.risked-chip').forEach((e)=>{
     e.classList.add('burning-fade');
     e.closest('.tile').removeChild(e);
     setTimeout(()=>{
      },1000 * 2)
    });
    isRequireTake = false;
   //make the lastRiskFocus to default then aswell as move chip by returning true
    newMover();
   return;
  }


  if (isMoveValid(selected,targetTile) && isTileUp) {
   targetTile.appendChild(selected);
   newMover();
  }
 }
}

//Implementing move

function isMoveValid (chip,block) {
 let originBlock = chip.closest(".tile").id.split(",");//Closest block className toArray
 let destinBlock = block.id.split(",");//block className toArray
 //alert("Хорошо");
 
 //each tiles objects
 let originTile = {
  x: originBlock[0],
  y: originBlock[1],
 }
 
 let destinTile = {
  x: destinBlock[0],
  y: destinBlock[1],
 }
 
 let rangeDiff = {
  x: Math.abs(destinTile.x - originTile.x),
  y: Math.abs(destinTile.y - originTile.y),
 }
 
 
 //CONDITIONS
 
 
 block.innerText == "";


 let evenStep = rangeDiff.x == rangeDiff.y ? rangeDiff.x || rangeDiff.y : false;
 let isNotDefaultStep = originBlock.toString() != destinBlock.toString() && destinBlock != "";
 let isTaking = lastRiskFocusArr.includes(block.id);
 let isEmptyTargetBlock = block.innerHTML == "";
 
 //CHECK IS MOVE REVERSING HOME
 //console.log(redMoves);
 let reverseMove = redMoves ? originTile.y < destinTile.y : originTile.y > destinTile.y;
 if(!reverseMoveOn && reverseMove && !block.classList.contains('step-tile') && evenStep == 1 && isEmptyTargetBlock) {
   alert('ReVERSiNg mover!!');
   return false;
 }



 //console.log(isTaking); 
 //check if the player is king chip
 let opponentBaseYZenith = redMoves ? 0 : boardSize - 1;
 if (destinTile.y == opponentBaseYZenith) {
  //chip.setAttribute('king-chip','true');
 }
 //console.log(destinTile.y,opponentBaseYZenith);
 if (isNotDefaultStep && evenStep == 1 && isEmptyTargetBlock && isRequireTake == false) {
  return true;
 } else if(isNotDefaultStep && evenStep == 2 && isEmptyTargetBlock && isRequireTake == true && isTaking) {
  isRequireTake = false;
  lastRiskChip.closest('.tile').removeChild(lastRiskChip);
  //make the lastRiskFocus to default then aswell as move chip by returning true
  return true;
 } else {
    false;
 }
}


//SELECTING THE CHIPS

for (t of pieceSelect) {
 t.onclick = (e)=>{
  let chipClassName = redMoves ? "red-piece" : "blue-piece";
  let isValidPicker = e.target.classList.contains(chipClassName);
  let focusChip = document.querySelector('.focus-select') || false;
  if (focusChip) {
   focusChip.classList.remove("focus-select");
  }
  if (isValidPicker) {
  selected = e.target;
  selected.classList.add("focus-select");
  //alert(selected)
  isTileUp = true;
  }
 }
}

//Check if the last move gives the risk of feeding

function checkFeedingRisks(chip) {

 //Check risk
 //chip.innerHTML = ':-)';
let chipClassName = redMoves ? 'red-piece' : 'blue-piece';
//console.log(chipClassName)
let chipTile = chip.closest(".tile").id.split(",") || chip;
let aroundTileId = {
 topLeft: `${chipTile[0]-1},${chipTile[1]-1}`,
 topRight: `${chipTile[0]-1+2},${chipTile[1]-1}`,
 bottomLeft: `${chipTile[0]-1},${chipTile[1]-1+2}`,
 bottomRight: `${chipTile[0]-1+2},${chipTile[1]-1+2}`,
}


//CHECK THE PROBLEM HERE


for (position in aroundTileId) {
 let id = aroundTileId[position];
 let tile = document.getElementById(id) || "void";
 let tileHasContent = tile != "void" && tile.innerHTML != "";
 
 if (tileHasContent) {
  let insideChip = tile.querySelector(redMoves ? '.blue-piece' : '.red-piece') || false;
  //insideChip.innerText = ':-]';
  //let chipTile = tile.querySelector('div');
  let isNotLooping = !tile.classList.contains('checked-tile');
  let idXY = id.split(",");
  let chipDistance = {
    x: idXY[0] - chipTile[0],
    y: idXY[1] - chipTile[1],
  };
  //Change the dist reduce yo the risked one be distance
  let moveFocusId = `${+chipTile[0] + (+chipDistance.x * 2)},${+chipTile[1] + (+chipDistance.y * 2)}`;
  let moveFocus = document.getElementById(moveFocusId) || null;
  //console.log(moveFocusId);
  if (moveFocus != null && moveFocus.innerHTML == "" && chipClassName != tile.querySelector('div').className && isNotLooping) {
    insideChip.classList.add('risked-chip');
    tile.classList.add('checked-tile');
    //alert('working');
    moveFocus.classList.add("step-tile");
    
    lastStepTile = moveFocus;
    //kinda need some editin from this

    lastRiskChip = insideChip;
    //lastRiskChip.innerText = '👌';
    lastRiskFocusArr.push(moveFocus.id);
    
    //CHECK if a blank step tile that extends a single take for multiple chips and add class its a chip that extends taking.
    if (chip.classList.contains('tile')) {
      moveFocus.classList.add('jump-tile');
      lastCheckedTile.classList.add('jump-tile');
      console.log(lastCheckedTile);
    }
    
    
    
    //TEMPOR CHANGE 🏐🏐🏐🏐🏐🏐
    isRequireTake = true;

    //The last checked tile
    lastCheckedTile = moveFocus || chip;

   //return the tile to be rechecked if there is more

   return checkFeedingRisks(moveFocus);
  }

 }

}

}


//CHECK WINNER FUNCTION

//DOM
const winBoard = document.getElementById('win-board');
const winnerTitle = document.getElementById('winner-title');

const timeStats = document.getElementById('time-stats');
const moveStats = document.getElementById('move-stats');


function checkIfLose() {
  let chipClassName = redMoves ? 'red-piece' : 'blue-piece';
  let moverChipSelect = document.querySelectorAll('.'+chipClassName);
  if (moverChipSelect.length < 1) {
    winBoard.style.display = 'flex';
    setTimer('pause');
    timeStats.innerText = timeString;
    moveStats.innerHTML = `<span>${moves.red}</span>/<span>${moves.blue}</span>`;
  }
}





//[ ] Add the rating feedback

//[ ] MAke automatically lost if the surrounding tiles provide no move
//[ ] Set the king chip
//[ ] Assume its mediaquery time is next