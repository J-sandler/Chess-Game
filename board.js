//globals
var draggedRef = null;
const moves=[];
let winner="black";
var gameEnd=false;
var tempEval=0;
var moveNum=1;


//event listeners
document.addEventListener("dragstart", event => {
    draggedRef = event.target;
})

document.addEventListener("dragover", event => {
  event.preventDefault();
})

document.addEventListener("drop", event => {
  if(gameEnd) {alert(winner + " has won the game!");return;}
  const move=document.getElementById("move");
  if(event.target.id[0]!=draggedRef.id[0]) {
    if(move.className[0]!=draggedRef.id[0]||!isvalid(
    draggedRef.parentNode.id.slice(1),
    event.target.id.slice(1),draggedRef.id.slice(1),
    event.target.id[0]!='e',
    event
    )) {return;}

    event.preventDefault();
    movePiece(event);
    if (move.className=="w") {
      move.classList.remove("w");
      move.classList.add("b");
    } else {
      move.classList.remove("b");
      move.classList.add("w");
    }
  } 
})

