var draggedRef = null;
document.addEventListener("dragstart", event => {
    draggedRef = event.target;
})

document.addEventListener("dragover", event => {
  event.preventDefault();
})

document.addEventListener("drop", event => {
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

function movePiece(event) {
  removeHighlights();
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

  //evaluate x and y movement given the piece moving
  if (piece=="pawn") {
    let starting_rank=parseInt(from[1]);
    if (!is_capture) {
      if (x) {
        //unless is enpessant
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
    y=Math.abs(y);
    if(y!=x) {
      return false;
    }
  } else if (piece=="knight") {
    y=Math.abs(y);
    let val=((y==2&&x==1)||(x==2&&y==1));
    if (!val) {
      return false;
    } 
  } else if (piece=="king") {
    y=Math.abs(y);
    if(x>1||y>1) {
      //unless castle is valid
      return false;
    }
  } else if (piece=="queen") {
    y=Math.abs(y);
    let val=(y==0||x==0||y==x);
    if(!val) {
      return false;
    }
  } else if (piece=="rook") {
    y=Math.abs(y);
    if(y!=0&&x!=0) {
      return false;
    }
  } else {
    alert("You broke the game!, How??");
  }
  //check if non-knights jump over pieces
  if (is_capture) {
    if(event.target.id.slice(1)=="king") {
      let winner="black";
      if (color=="w") {winner="white";}
      alert(winner + " has won the game!");
      return false;
    }
  }
  return true;
}
