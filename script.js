// let element = document.querySelector(".running-timeline");
// function sleep(ms){
//     return new Promise(resolve => setTimeout(resolve, ms));
// }

// async function running(){

//     for(let i=0; i<=90; i++){

//         element.style.width = `${i}%`;

//         await sleep(1000);
//     }
// }

// running();

let songCards = document.querySelectorAll(".song-card");

songCards.forEach((card) => {
  card.addEventListener("mouseenter", () => {
    card.querySelector("#play-song").classList.add("show");
  });

  card.addEventListener("mouseleave", () => {
    card.querySelector("#play-song").classList.remove("show");
  });
});

async function getSongs() {
  let a = await fetch(
    "http://127.0.0.1:5500/Web%20Development/Spotify%20Project/Songs/",
  );
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let anchor = div.getElementsByTagName("a");

  let Songs = [];
  for (let index = 0; index < anchor.length; index++) {
    const element = anchor[index];
    if (element.href.endsWith(".mp3")) {
      Songs.push(element.href);
    }
  }
  return Songs;
}

let song = [];
let playList = [];
let card = document.getElementsByClassName("song-card");
let playButtons = document.getElementsByClassName("hide");
let previousBtn = document.querySelector(".previous-btn");
let playBtn = document.querySelector(".play-btn");
let nextBtn = document.querySelector(".next-btn");

let currentAudio = new Audio();
let currentSongIndex = 0;

async function main() {
  let music = await getSongs();
  song = music;
  for (let i = 0; i < music.length; i++) {
    let fileName = card[i].dataset.song;
    playList[i] = song.find(song =>
        decodeURIComponent(song).includes(fileName)
    )
  }
}
main();
let timeline = document.querySelector(".running-timeline");
let currentSongName = document.querySelector(".current-Song-Name");

function playSong(index) {
    currentSongName.innerHTML = decodeURIComponent(playList[index].split("/").pop().replace(".mp3", " "));
    timeline.style.width = "0%";
    currentAudio.pause();
    currentAudio.src = playList[index];
    currentAudio.play();
    playBtn.querySelector("img").src = "icons/pause.svg";
}

let playback = document.querySelector(".playback");

for (let i = 0; i < playButtons.length; i++) {
  playButtons[i].addEventListener("click", () => {
    currentSongIndex = i;
    let fileName = card[i].dataset.song;
    playList[i] = song.find((song) =>
      decodeURIComponent(song).includes(fileName),
    );
    playback.classList.add("visible");
    playSong(i);
  });
}
playBtn.addEventListener("click", () => {
    if (currentAudio.paused) {
    currentAudio.play();
    playBtn.querySelector("img").src = "icons/pause.svg";
    } else {
    currentAudio.pause();
    playBtn.querySelector("img").src = "icons/play.svg";
    }
});

nextBtn.addEventListener("click", () => {

    currentSongIndex++;

    if(currentSongIndex >= song.length){
        currentSongIndex = 0;
    }

    currentAudio.src = playList[currentSongIndex];
    currentAudio.play();

    currentSongName.innerHTML = decodeURIComponent(playList[currentSongIndex].split("/").pop().replace(".mp3", " ")).replace(" - ", " ");


});

previousBtn.addEventListener("click", () => {

    currentSongIndex--;

    if(currentSongIndex < 0){
        currentSongIndex = song.length - 1;
    }

    currentAudio.src = playList[currentSongIndex];
    currentAudio.play();

    currentSongName.innerHTML = decodeURIComponent(playList[currentSongIndex].split("/").pop().replace(".mp3", " "));

});

let timelineBar = document.querySelector(".timeline");

let currentTime = document.querySelector(".currentduration");
let Duration = document.querySelector(".Duration");

function formatTime(seconds) {

    if (isNaN(seconds)) return "0:00";

    let mins = Math.floor(seconds / 60);
    let secs = Math.floor(seconds % 60);

    if (secs < 10) {
        secs = "0" + secs;
    }

    return `${mins}:${secs}`;
}


currentAudio.addEventListener("timeupdate",()=>{

    if(!currentAudio.duration) return;
    
    let percentage = (currentAudio.currentTime / currentAudio.duration)*100;

    timeline.style.width = percentage +"%";

    currentTime.innerHTML = formatTime(currentAudio.currentTime);

    Duration.innerHTML = formatTime(currentAudio.duration);
})

timelineBar.addEventListener("click", (e) => {

    if(!currentAudio.duration) return;

    let rect = timelineBar.getBoundingClientRect();

    let percentage =
        (e.clientX - rect.left) / rect.width;

    currentAudio.currentTime =
        percentage * currentAudio.duration;

});


let hamBurger = document.querySelector(".hamBurger-content");
let hamBtn = document.querySelector(".hamburger");

hamBtn.addEventListener("click", ()=>{
  hamBurger.classList.remove("ham-hide");
  hamBurger.classList.add("ham-show");

  let cancelBtn = hamBurger.querySelector("#cancel-icon");
  cancelBtn.addEventListener("click", ()=>{
    hamBurger.classList.remove("ham-show");
    hamBurger.classList.add("ham-hide")
  })
})

let searchInput = document.querySelector(".search-input");
let song_cards = document.querySelectorAll(".song-card");

searchInput.addEventListener("input",()=>{
  let SearchText = searchInput.value.toLowerCase();

  song_cards.forEach(card =>{
    let songName = card.dataset.song.toLowerCase();

    if(songName.includes(SearchText)){
      card.style.display = "block";
    }
    else{
      card.style.display = "none";
    }

  })
})

currentAudio.addEventListener("ended" , ()=>{

  currentSongIndex+=1;

  if(currentSongIndex >= playList.length){
    currentSongIndex =0;
  }

  playSong(currentSongIndex);
})





