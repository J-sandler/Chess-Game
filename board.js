//globals
var draggedRef = null;
const moves=[];
let winner="black";
var gameEnd=false;
var tempEval=0;


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

//functions
function movePiece(event) {
  removeHighlights();

  var el=document.getElementById("eval-box");
  var s="eval: "+get_eval().toString();
  el.innerText=s;

  if(event.target.className==="piece") {
    var p=event.target.parentNode;
    p.innerHtml="";
    p.removeChild(event.target);
    p.classList.add("highlight");
    draggedRef.parentNode.classList.add("highlight");
    draggedRef.parentNode.id="e"+draggedRef.parentNode.id[1]+draggedRef.parentNode.id[2];
    draggedRef.parentNode.removeChild(draggedRef);
    p.appendChild(draggedRef);
    p.id=(draggedRef.id[0]+p.id[1]+p.id[2]);
  } else {
    draggedRef.parentNode.classList.add("highlight");
    event.target.classList.add("highlight");
    event.target.innerHtml="";
    event.target.id=draggedRef.id[0]+event.target.id[1]+event.target.id[2];
    draggedRef.parentNode.id="e"+draggedRef.parentNode.id[1]+draggedRef.parentNode.id[2];
    draggedRef.parentNode.removeChild(draggedRef);
    event.target.appendChild(draggedRef);
  }
}

function removeHighlights() {
  const highlights = document.querySelectorAll(".highlight");
  highlights.forEach(highlight=>
    {
      highlight.classList.remove("highlight");
    })
}

function isvalid(from, to, piece, is_capture, event) {
  let color=draggedRef.id[0];
  //fix to if necessary
  if (is_capture) {to=event.target.parentNode.id.slice(1);}
  //establish x and y movement 
  let y=parseInt(to[1])-parseInt(from[1]);let x=parseInt(to[0],18)-parseInt(from[0],18);
  x=Math.abs(x);
  y=(piece!="pawn")?Math.abs(y):y;
  
  //evaluate x and y movement given the piece moving
  if (piece=="pawn") {
    let starting_rank=parseInt(from[1]);
    if (!is_capture) {
      if (x) {
        //unless is enpassant
        return false;
      }
    } 

    if (color=="b") {
      y=-y;
    }

    if(is_capture) {
      if (x>1||y!=1||x==0) {
        return false;
      }
    }

    if(y==2) {
      if(starting_rank!=7&&starting_rank!=2) {
        return false;
      }
    }

    if(y<0||y>2) {
      return false;
    }

  } else if (piece=="bish") {
    if(y!=x) {
      return false;
    }
  } else if (piece=="knight") {
    let val=((y==2&&x==1)||(x==2&&y==1));
    if (!val) {
      return false;
    } 
  } else if (piece=="king") {
    if(x>1||y>1) {
      //unless castle is valid
      return false;
    }
  } else if (piece=="queen") {
    let val=(y==0||x==0||y==x);
    if(!val) {
      return false;
    }
  } else if (piece=="rook") {
    if(y!=0&&x!=0) {
      return false;
    }
  } else {
    alert("You broke the game!, How??");
  }

  //update eval [temporary]:
  if (is_capture) {
    if (color=="w") {
      tempEval+=piece_val(event.target.id.slice(1));
    } else {
      tempEval-=piece_val(event.target.id.slice(1));
    }
  }
  //check if non-knights jump over pieces
  if (is_capture) {
    if(event.target.id.slice(1)=="king") {
      if (color=="w") {winner="white";}
      alert(winner + " has won the game!");
      gameEnd=true;
      return false;
    } 
  }
  var txs=(is_capture)?"x":"";
  moves.push(filt(piece)+txs+to);
  eval_update();
  return true;
}

function filt(piece) {
  var r=(piece=="knight")?"n":piece[0];
  r=(piece=="pawn")?"":r;
  return r;
}

function piece_val(piece) {
  if (piece=="pawn") {
    return 1;
  } 
  if (piece=="knight"||piece=="bish") {
    return 3;
  } 
  if(piece=="rook") {
    return 5;
  }
  return (piece=="queen")?9:99999;
}

//eval mechanics:
function get_eval() {
  //temporary implementation:
  return tempEval;
}

function eval_update() {
  var r=document.querySelector(":root");
  var s=(329.75-(get_eval()*20))+"px";
  r.style.setProperty('--h',s);
}
