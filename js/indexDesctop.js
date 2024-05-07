//Dom
let container = document.querySelector(".container");
let board = document.getElementById("board");
let boardSize = 7;
let boardSquare = Math.pow(boardSize,2);


//Game data
let redMoves = true;
let selected;
let isTileUp = true;
let isRequireTake = false;
let lastRiskChip = null;
let lastRiskFocus = null;

let lastMove = {
 chip: [],
 focus: [],
}


for (let i=0; i <= boardSquare; i++) {
 let tile = document.createElement("div");
 tile.classList.add("tile");
 board.appendChild(tile);
}

let tileSelect = document.querySelectorAll("#board > .tile");


//Write position of each tile and set it to it

for (let i = 0; i < boardSquare; i+=7) {
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

fillOddtiles(0, boardSize * 2,tileSelect,"<div class='blue-piece'></div>");
fillOddtiles(boardSquare - (boardSize * 2), boardSquare,tileSelect,"<div class='red-piece'></div>");

//Check conditions for move, make move

let pieceSelect = document.querySelectorAll("#board .tile > div");
let oddTiles = document.querySelectorAll("#board > .tile:nth-child(odd)");

for (t of oddTiles) {
 t.onclick = (e)=>{
  let moverClassName = redMoves ? "red-piece" : "blue-piece";
  
  let targetTile = e.target;
  if (isMoveValid(selected,targetTile) && isTileUp) {
   targetTile.appendChild(selected);
   //check all movers chips if has risks
   let moversChipSelect = document.querySelectorAll(moverClassName);
   }
   //console.log(moversChipSelect[1], moverClassName);
   
   container.classList.toggle("blue-background");
   selected.classList.remove("focus-select");
   isTileUp = false;
   redMoves = redMoves ? false : true;
   checkNextMove(selected)
   /*for (c of pieceSelect) {
     //checkNextMove(selected);
    if (c.className == moverClassName) {
     //console.log(c);
     selected = c;
     //checkNextMove(selected);
     
    }
  }*/
 }
}

//Implementing move

function isMoveValid (chip,block) {
 let originBlock = chip.closest(".tile").id.split(",");//Closest block className toArray
 let destinBlock = block.id.split(",");//block className toArray
 //alert("ಠ,_｣ಠ");
 
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
 let lastFocus = "";

 let evenStep = rangeDiff.x == rangeDiff.y ? rangeDiff.x || rangeDiff.y : false;
 let isNotDefaultStep = originBlock.toString() != destinBlock.toString() && destinBlock != "";
 //let isTaking = lastRiskFocus ? lastRiskFocus.id == block.id : false;
 let isTaking2 = lastMove.focus.includes(block);
 console.log(isTaking2)
 
 
 
 if (isNotDefaultStep && evenStep == 1 && isRequireTake == false) {
  return true;
 } else if(isNotDefaultStep && evenStep == 2 && isRequireTake == true && isTaking2) {
  isRequireTake = false;
  lastRiskChip.closest('.tile').removeChild(lastRiskChip);
  lastRiskChip = null;
  lastRiskFocus = null;
  //console.log('id',block.id)
  return true;
 } else {
    false;
 }
}


//Something

for (t of pieceSelect) {
 t.onclick = (e)=>{
  let chipFocusedSelect = document.querySelector(".focus-select");
  if (chipFocusedSelect != null) {chipFocusedSelect.classList.remove("focus-select");}
  let chipClassName = redMoves ? "red-piece" : "blue-piece";
  if (e.target.className == chipClassName) {
  selected = e.target;
  selected.classList.toggle("focus-select");
  console.log(selected.className);
  //alert(selected)
  isTileUp = true;
  }
 }
}

//Check if the last move gives the risk of feeding

function checkNextMove(chip,moveType) {
 //Check risk

//Check if a regular one sided piece sweep
if (moveType == "bias") {
 //Something
}

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
  //console.log(moveFocusId);
  let moveFocus = document.getElementById(moveFocusId) || 'void';
  if (moveFocus != 'void' && moveFocus.innerHTML == "" && chipClassName != tile.querySelector('div').className) {
   moveFocus.classList.add("step-tile");
   lastRiskChip = chip;
   lastMove.chip.push(chip);
   lastRiskChip.innerText = 'ಠಗಠ';
   lastRiskFocus = moveFocus;
   lastMove.focus.push(moveFocus);
   isRequireTake = true;
   //console.log(id);
  }
 } else if (moveType == 'take') {

 }

}

}