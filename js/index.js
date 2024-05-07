//Dom
let container = document.querySelector(".container");
let board = document.getElementById("board");
//make an odd number for size and make sure it is an integer like 1 not 1.1 or 1.2
let boardSize = 7;
let boardSquare = Math.pow(boardSize,2);
//The lines each team of peaces occupy vertically
let chipVerticalReach = Math.round(boardSize / 4) || 7;

//Game data
let redMoves = true;
let selected;
let isTileUp = false;
let isRequireTake = false;
let lastRiskChip = null;
let lastRiskFocusArr = [];

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

fillOddtiles(0, boardSize * chipVerticalReach,tileSelect,"<div class='blue-piece'></div>");
fillOddtiles(boardSquare - (boardSize * chipVerticalReach), boardSquare,tileSelect,"<div class='red-piece'></div>");

//Check conditions for move, make move

let pieceSelect = document.querySelectorAll("#board .tile > div");
let oddTiles = document.querySelectorAll("#board > .tile:nth-child(odd)");

for (t of oddTiles) {
 t.onclick = (e)=>{
  let targetTile = e.target;
  if (isMoveValid(selected,targetTile) && isTileUp) {
   targetTile.appendChild(selected);
   checkNextMove(selected);
   container.classList.toggle("blue-background");
   selected.classList.remove("focus-select");
   isTileUp = false;
   redMoves = redMoves ? false : true;
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
 let evenStep = rangeDiff.x == rangeDiff.y ? rangeDiff.x || rangeDiff.y : false;
 let isNotDefaultStep = originBlock.toString() != destinBlock.toString() && destinBlock != "";
 let isTaking = lastRiskFocusArr.includes(block.id);
 let isEmptyTargetBlock = block.innerHTML == "";

 
 //check if the player is king chip
 let opponentBaseYZenith = redMoves ? 0 : boardSize - 1;
 if (destinTile.y == opponentBaseYZenith) {
   chip.classList.add('king-chip');
 }
 console.log(destinTile.y,opponentBaseYZenith);
 if (isNotDefaultStep && evenStep == 1 && isEmptyTargetBlock && isRequireTake == false) {
  return true;
 } else if(isNotDefaultStep && evenStep == 2 && isEmptyTargetBlock && isRequireTake == true && isTaking) {
  isRequireTake = false;
  lastRiskChip.closest('.tile').removeChild(lastRiskChip);
  //make the lastRiskFocus to default then aswell as move chip by returning true
  lastRiskFocusArr.length = 0;
  return true;
 } else if (isNotDefaultStep && isEmptyTargetBlock && isRequireTake == false) {
   return true;
 } else {
    false;
 }
}


//Something

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

function checkNextMove(chip,moveType) {
 //Check risk
let chipClassName = redMoves ? 'red-piece' : 'blue-piece';
let chipTile = chip.closest(".tile").id.split(",");
let aroundTileId = {
 topLeft: `${chipTile[0]-1},${chipTile[1]-1}`,
 topRight: `${chipTile[0]-1+2},${chipTile[1]-1}`,
 bottomLeft: `${chipTile[0]-1},${chipTile[1]-1+2}`,
 bottomRight: `${chipTile[0]-1+2},${chipTile[1]-1+2}`,
}

for (position in aroundTileId) {
 let id = aroundTileId[position];
 let tile = document.getElementById(id) || "void";
 let tileHasContent = tile != "void" && tile.innerHTML != "";
 
 
 if (tileHasContent && tile != "void") {
  let idXY = id.split(",");
  let chipDistance = {
   x: idXY[0] - chipTile[0],
   y: idXY[1] - chipTile[1],
  };
  //Change the dist reduce yo the risked one be distance
  let moveFocusId = `${+chipTile[0] - +chipDistance.x},${+chipTile[1] - +chipDistance.y}`;
  let moveFocus = document.getElementById(moveFocusId) || 'void';
  if (moveFocus != 'void' && moveFocus.innerHTML == "" && chipClassName != tile.querySelector('div').className) {
   moveFocus.classList.add("step-tile");
   lastRiskChip = chip;
   lastRiskChip.innerText = '👌';
   lastRiskFocusArr.push(moveFocus.id);
   isRequireTake = true;
  }
 } else if (moveType == 'take') {

 }

}

}