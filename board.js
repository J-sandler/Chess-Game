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
    if(move.className[0]!=draggedRef.id[0]||!isvalid(draggedRef.id.slice(1),event.target.id.slice(1),draggedRef.id.slice(1))) {
      return;
    }

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

function isvalid(from, to, piece) {
  return true;
}