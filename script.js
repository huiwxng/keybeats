const whites = document.getElementsByClassName("white");
const blacks = document.getElementsByClassName("black");
const keys = document.querySelectorAll(".key");
// recording feature(s)
let isRecording = false;
let notes = [];
let timings = [];
let recordedNotes = [];
let recordedTimings = [];
let lastKeyPress = 0;
let counter = 0;
const recordBtn = document.getElementById("record");
const btns = document.getElementById("btns");
const playBtns = document.getElementsByClassName("play");
const clearBtn = document.getElementById("clear");
const recordings = document.getElementById("recordings");


//shows recent note played
const noteContainer = document.getElementById("recentNoteContainer");

// play note
function playNote(keycode) {  
  const audio = document.querySelector(`audio[data-key="${keycode}"]`);
  const key = document.querySelector(`.key[data-key="${keycode}"]`);
  if (!key) {
    return;
  }
  // ------ This allows for the key press animation to be interrupted mid animation when a key is pressed again so it is always animation the most recent key press 
  key.classList.remove("pressed")
  requestAnimationFrame((time) => {
    requestAnimationFrame((time) => {
  key.classList.add("pressed");
    });
  });
// ------------------------------------------------
  
  audio.currentTime = 0;
  audio.play();
  // shows recent note played
  let recentNote = key.getAttribute('data-note');
  noteContainer.innerHTML = `${recentNote}`
    
  if (isRecording) {
    notes.push(keycode);

    let n = new Date();
    timings.push(n - last);
  }
}

function onKeyDown(e) {
  playNote(e.keyCode);
}

// detects key downs
document.addEventListener("keydown", onKeyDown);
keys.forEach((keyEl => {
  console.log(keyEl);
  keyEl.addEventListener('click', (clickEvent) => {
    target = clickEvent.target;
    playNote(target.dataset.key);
  })
}));

recordBtn.addEventListener("click", ()=>{
  isRecording = !isRecording;
  if (isRecording) {
    notes = [];
    timings = [];
    last = new Date();
    recordBtn.innerHTML = "STOP RECORDING";
    recordBtn.classList.add("recAnimation");
  }
  else {
    // notes not being recorded
    recordBtn.classList.remove("recAnimation");

    recordBtn.innerHTML = "START RECORDING";
    recordedNotes.push(notes);
    recordedTimings.push(timings);
    recordings.insertAdjacentHTML("beforeend", `<button data-num="${counter}" class='play' id='recording${counter}'>PLAY RECORDING ${counter+1}</button>`);
      
    let btn = recordings.children[recordings.children.length-1];
    btn.addEventListener("click", function() {
      let c = this.dataset.num;
      this.classList.add("playingAnimation");
      
      recordedNotes[c].forEach((note, index)=>{

        let ourTimings = recordedTimings[c];
        // let playbackTime = 500 * index;
        let playbackTime = ourTimings[index];
        
        setTimeout(()=>{
          playNote(note);
          
          if (index === recordedNotes[c].length - 1) {
      this.classList.remove("playingAnimation");  
          }
          
          }, playbackTime);
      });

    });
    counter++;
  }
});

clearBtn.onclick = function() {
  recordings.innerHTML = "";
  recordedNotes = [];
  counter = 0;
}

