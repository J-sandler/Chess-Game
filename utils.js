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
  
  //save initial values to avoid mutation
  const iy=parseInt(to[1])-parseInt(from[1]);
  const ix=parseInt(to[0],18)-parseInt(from[0],18);
  
  //evaluate x and y movement given the piece moving
  if (piece=="pawn") {
    let starting_rank=parseInt(from[1]);
    if (!is_capture) {
      if (x) {
        //unless is enpassant
        return false;
      }
    } 

    if (color=="b") {y=-y;}

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
      //unless castle is valid [temp]
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

  if (!is_clear_path(from,ix,iy,piece)) return false;

  if (is_capture) {
    if(event.target.id.slice(1)=="king") {
      if (color=="w") {winner="white";}
      alert(winner + " has won the game!");
      gameEnd=true;
      return false;
    } 
  }
  
  var txs=(is_capture)?"x":"";
  moves.push(filt(piece,is_capture,from)+txs+to);
  
  moveNum=(color=="b")?moveNum+1:moveNum;
  moves_update(color);
  
  eval_update();

  return true;
}

//helper method for move notation
function filt(piece,is_capture,from) {
  var r=(piece=="knight")?"N":piece[0].toUpperCase();
  r=(piece=="pawn"&&is_capture)?from[0]:r;
  r=(piece=="pawn"&&!is_capture)?"":r;
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
  //[temp implementation] (soon to include nn eval)
  return tempEval;
}

//update eval bar
function eval_update() {
  var r=document.querySelector(":root");
  var s=(329.75-(get_eval()*20))+"px";
  r.style.setProperty('--h',s);
}

//updates moves column
function moves_update(color) {
  if(moves.length>=60)return;

  var el=document.getElementById("played-moves");

  var txt=(color=="w")?moveNum+ ": "+moves[moves.length-1]:" "+moves[moves.length-1]+"<br>";

  txt=(is_check())?txt+"+":txt;
  el.innerHTML+=txt;
}

//evaluates check
function is_check() {
  //[temp implementation]:
  return false;
}

function movePiece(event) {
  removeHighlights();

  var el=document.getElementById("eval-box");
  var s="eval: "+get_eval().toString();
  el.innerText=s;

  const pc=event.target.className=="piece";
  const p=(pc)?event.target.parentNode:event.target;

  p.innerHtml="";
  if (pc) p.removeChild(event.target);
  p.classList.add("highlight");
  draggedRef.parentNode.classList.add("highlight");
  p.id=(draggedRef.id[0]+p.id[1]+p.id[2]);
  draggedRef.parentNode.id="e"+draggedRef.parentNode.id[1]+draggedRef.parentNode.id[2];
  draggedRef.parentNode.removeChild(draggedRef);
  p.appendChild(draggedRef);
}

//prevents pieces from jumping over other pieces
function is_clear_path(from,ix,iy,piece) {
  ind(from);
  if (piece=="knight") return true;
  //evaluate straight moves:
  if (!ix) {
    if(iy<0) {
      for (let i=-1;i>iy;i--) {
        const sqr=(from[0]+((parseInt(from[1]))+i).toString());
        console.log(sqr);
        const inds=ind(sqr);
        if (!document.getElementById(getSquare[inds[0]][inds[1]])) return false;
      }
    } else {
      for (let i=1;i<iy;i++) {
        const sqr=(from[0]+((parseInt(from[1]))+i).toString());
        console.log(sqr);
        const inds=ind(sqr);
        if (!document.getElementById(getSquare[inds[0]][inds[1]])) return false;
      }
    }
    return true;
  }

  if (!iy) {
    if(ix<0) {
      for (let i=-1;i>ix;i--) {
        const inds=[];
        inds.push(8-parseInt(from[1]));
        inds.push((parseInt(from[0],18)-10)+i);
        if (!document.getElementById(getSquare[inds[0]][inds[1]])) return false;
      }
    } else {
      for (let i=1;i<ix;i++) {
        const inds=[];
        inds.push((8-parseInt(from[1])));
        inds.push((parseInt(from[0],18)-10)+i);
        if (!document.getElementById(getSquare[inds[0]][inds[1]])) return false;
      }
    }
    return true;
  }
  //evaluate diagonal moves:
  if (iy<0) {
    if (ix<0) {
      for(let i=-1;i>iy;i--) {
        const inds=[];
        inds.push((8-parseInt(from[1]))-i);
        inds.push((parseInt(from[0],18)-10)+i);
        if (!document.getElementById(getSquare[inds[0]][inds[1]])) return false;
      }
    } else {
      for(let i=-1;i>iy;i--) {
        const inds=[];
        inds.push((8-parseInt(from[1]))-i);
        inds.push((parseInt(from[0],18)-10)-i);
        if (!document.getElementById(getSquare[inds[0]][inds[1]])) return false;
      }  
    }
  } else {
    if (ix<0) {
      for(let i=1;i<iy;i++) {
        const inds=[];
        inds.push((8-parseInt(from[1]))-i);
        inds.push((parseInt(from[0],18)-10)-i);
        if (!document.getElementById(getSquare[inds[0]][inds[1]])) return false;
      }
    } else {
      for(let i=1;i<iy;i++) {
        const inds=[];
        inds.push((8-parseInt(from[1]))-i);
        inds.push((parseInt(from[0],18)-10)+i);
        if (!document.getElementById(getSquare[inds[0]][inds[1]])) return false;
      }  
    }
  }
  return true;
}

function ind(from) {
  const out=[];
  out.push(8-parseInt(from[1]));
  out.push((parseInt(from[0],18)-10));
  return out;
}

//helper map:
const getSquare=[
  ["ea8","eb8","ec8","ed8","ee8","ef8","eg8","eh8"],
  ["ea7","eb7","ec7","ed7","ee7","ef7","eg7","eh7"],
  ["ea6","eb6","ec6","ed6","ee6","ef6","eg6","eh6"],
  ["ea5","eb5","ec5","ed5","ee5","ef5","eg5","eh5"],
  ["ea4","eb4","ec4","ed4","ee4","ef4","eg4","eh4"],
  ["ea3","eb3","ec3","ed3","ee3","ef3","eg3","eh3"],
  ["ea2","eb2","ec2","ed2","ee2","ef2","eg2","eh2"],
  ["ea1","eb1","ec1","ed1","ee1","ef1","eg1","eh1"]
];