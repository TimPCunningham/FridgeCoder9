const LINE_HEIGHT = 50;


function initOptionEvents() {
  let options = document.querySelectorAll('.letter-option');

  for(option of options) {
    option.addEventListener('dragstart', (ev) => {
      ev.dataTransfer.setData("value", ev.target.innerHTML);
      ev.dataTransfer.setData("rotation", ev.target.style.transform);
      ev.dataTransfer.setData("color", ev.target.style.color);
    });
  }
}

function initLines() {
  let linesDiv = document.querySelector('.lines');
  let fridgeDiv = document.querySelector('.fridge');

  for(let x = 0; x < fridgeDiv.clientHeight; x+=LINE_HEIGHT) {
    linesDiv.innerHTML += `<div class='line' style='height: ${LINE_HEIGHT}px; line-height: ${LINE_HEIGHT}px'>${x/LINE_HEIGHT}</div>`;
  }
}

function populateLetterBox() {
  let letterbox = document.querySelector('.letterbox');

  for(let charCode = 33; charCode <= 126; charCode++) {
    let res = String.fromCharCode(charCode);
    let rotation = Math.floor(Math.random() * 20) - 10;
    let color = randomHexColor();

    letterbox.innerHTML += `<div draggable="true" class='letter-option' style='transform: rotate(${rotation}deg); color: ${color}'>${res}</div>`;
  }
}

function run() {
  let fridgeDiv = document.querySelector('.fridge');
  let elements = Array.from(document.querySelectorAll('.drop-element'));
  let code = '';

  for(let i = 0; i < fridgeDiv.clientHeight; i+= LINE_HEIGHT) {
    let currentLine = elements.filter(el => {
      let pos = getNumFromPixels(el.style.top) + (el.clientHeight / 2.0);
      return pos >= i && pos < i+LINE_HEIGHT;
    }).map(el => {
      return {
        value: el.innerHTML,
        left: getNumFromPixels(el.style.left)
      };
    }).sort((a, b) => {
      return a.left >= b.left;
    });
    
    if(currentLine.length > 0) {
      code += convertLine(currentLine) + '\n';
    } else {
      code += '\n';
    }
  }

  eval(code);
}

function convertLine(line) {
  let result = '';

  for(let index = 0; index < line.length; index++) {
    let token = line[index];
    if(index > 0) {
      let lastToken = line[index-1];
      result += (token.left - lastToken.left) >= 45 ? ' ' + token.value : token.value;
    } else {
      result += token.value;
    }
  }

  return result;
}

function randomHexColor() {
  return '#' + Math.floor(Math.random() * 16777215).toString(16); // 16777215 === ffffff
}

function drop(ev) {
  ev.preventDefault();

  if(ev.dataTransfer.getData('existing')) {
    let id = ev.dataTransfer.getData('existing');
    let div = document.querySelector('#' + id);
    div.style.top = ev.clientY-12.5 + "px";
    div.style.left = ev.clientX-20 + "px";
  } else {
    let dt = ev.dataTransfer;
    let div = document.createElement('div');

    div.id = "id" + randID();
    div.classList = 'drop-element';
    div.draggable = true;
    div.ondragstart = dragElm;
    div.style.top = ev.clientY-12.5 + "px";
    div.style.left = ev.clientX-20 + "px";
    div.style.color = dt.getData('color');
    div.style.transform = dt.getData('rotation');
    div.innerHTML = dt.getData('value');

    document.querySelector('.fridge').appendChild(div);
  }
}

function dropOptions(ev) {
  ev.preventDefault();
  if(ev.dataTransfer.getData('existing')) {
    let id = ev.dataTransfer.getData('existing');
    document.querySelector('#' + id).remove();
  }
}

function allowDrop(ev) {
  ev.preventDefault();
}

function getNumFromPixels(pix) {
  return parseInt(pix.toString().substr(0, pix.toString().length-2));
}

function dragElm(ev) {
  ev.dataTransfer.setData('existing', ev.target.id);
}

function randID() {
  return Math.random().toString(36).substr(2);
}

window.onload = function() {
  populateLetterBox();
  initOptionEvents();
  initLines();
}