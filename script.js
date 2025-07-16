console.log('hello world');


let songs;
let currFolder;

async function getSongs(folder) {
  let a = await fetch(`./${folder}/`);
  currFolder = folder;
  let response = await a.text();
  // console.log(response);

  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  songs = [];
  for (let i = 0; i < as.length; i++) {
    const element = as[i];
    if (element.href.endsWith(".m4a")) {
      songs.push(element.href.split(`/${folder}/`)[1]);
    }
  }
  // console.log(songs)

  //show all songs in the playlist
  let songUl = document.querySelector(".songList").getElementsByTagName("ul")[0];
  songUl.innerHTML = "";
    for (const song of songs) {
    songUl.innerHTML =
      songUl.innerHTML +
      `<li>
                  <div class="song">
                    <img src="./assest/music.svg" alt="🎵">
                    <span class="song-name">${song.replaceAll(
                      "%20",
                      " "
                    )}</span>
                    <div class="song-play">
                      <span class="play-t">Play now</span>
                      <img class="S-play" src="./assest/play.svg" alt="">
                    </div>
                  </div>
        </li>`;
  }

  // Attah a event listner to each song
  Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e=>{
    e.addEventListener("click",element=>{
      console.log(e.querySelector(".song-name").innerHTML)
      playSong(e.querySelector(".song-name").innerHTML)
    })
  })
  
  return songs;
}

const currentSong = new Audio();

function playSong(gana,pause=false){
  // let audio = new Audio("/spotify/Songs/" + gana);
  currentSong.src = `/spotify/${currFolder}/` + gana;
  if(!pause){   
    currentSong.play()
   play.src = "./assest/pause.svg"
  }
  currentSong.play();  
  document.querySelector(".songInfo").innerHTML = gana.replaceAll("%20"," ")
}

function secondsToMinutes(seconds) {
  // Calculate minutes and seconds
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  // Format minutes and seconds to always show two digits
  const formattedMinutes = minutes.toString().padStart(2, '0');
  const formattedSeconds = remainingSeconds.toString().padStart(2, '0');

  return `${formattedMinutes}:${formattedSeconds}`;
}

async function displayAlbum(){
  let a = await fetch(`./Songs/`);
  let response = await a.text();
  // console.log(response);
  let div = document.createElement("div");
  div.innerHTML = response;
  let anchor = div.getElementsByTagName("a")
  let cardcontainer = document.querySelector(".cards-container")
  let array = Array.from(anchor)
  for(let i = 0;i<array.length;i++){
    const e = array[i]
    if(e.href.includes("/Songs")){
      let folder = e.href.split("/").slice(-2)[0]
      // console.log(folder)

      // get meta data of the  folder
      let a = await fetch(`./Songs/${folder}/info.json`);
      let response = await a.json();
      // console.log(response)
      cardcontainer.innerHTML = cardcontainer.innerHTML + 
      `<div data-folder="${folder}" class="card">
              <img
                src="${response.img}"
                alt=""
              />
              <span class="play-btn"
                ><img src="./assest/play.svg" alt="play"
              /></span>
              <h2 class="song-title">${response.title}</h2>
              <h4 class="song-description">${response.description}</h4>
        </div>`
    }
  }
    // add event listner for song album
    Array.from(document.getElementsByClassName("card")).forEach(e=>{
      // console.log(e)
      e.addEventListener("click",async item=>{
        console.log(item.currentTarget.dataset.folder)
        songs = await getSongs(`Songs/${item.currentTarget.dataset.folder}`)
        // songs = await getSongs(item.currentTarget.dataset.folder)
        // console.log(songs)
        playSong(songs[0])
      })
    }
    )
}


async function main() {
  displayAlbum();
  await getSongs(`Songs/hindi`);
  playSong(songs[0],pause=true)
  console.log(songs);

  // attach a event listner to play,pause svg
  play.addEventListener("click",()=>{
    if(currentSong.paused){
      currentSong.play()
      play.src = "./assest/pause.svg"
    }
    else{
      currentSong.pause()
      play.src = "./assest/play.svg"
    }
  })

  // Attact event listner for time update
  currentSong.addEventListener("timeupdate",()=>{
    // console.log(currentSong.currentTime,currentSong.duration)
    document.querySelector(".song-duration").innerHTML = `${secondsToMinutes(Math.floor(currentSong.currentTime))}/${secondsToMinutes(Math.floor(currentSong.duration))}`
    document.querySelector(".circle").style.left = (currentSong.currentTime/currentSong.duration)*100 + "%";

    // Add an event to seekbar
    document.querySelector(".seek-bar").addEventListener("click",e=>{
      console.log(e.target.getBoundingClientRect(),e.offsetX)
      const percent = (e.offsetX/e.target.getBoundingClientRect().width)*100
      document.querySelector(".circle").style.left = percent + "%";
      currentSong.currentTime = (currentSong.duration*percent)/100
    })
    //add event for auto next song play
    if(currentSong.duration == currentSong.currentTime){
      let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
      if((index+1)>(length-1))
      {
        playSong(songs[index+1])
      }
    }
  })
  //Add event listner to previous and next button
  previous.addEventListener("click",()=>{
    console.log('previous clicked');
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
    if((index-1)>=0)
    {
      playSong(songs[index-1])
    }
    
  })
  next.addEventListener("click",()=>{
    console.log('next clicked');
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
    if((index+1)>(length-1))
    {
      playSong(songs[index+1])
    }
  })

  //add event listner for songs menu
  document.querySelector('#menu').addEventListener("click",()=>{
    document.querySelector(".part-1").style.left = "0"
  })

  //add event listner for songs menu close
  document.querySelector(".close").addEventListener("click",()=>{
    document.querySelector(".part-1").style.left = "-100%"
  })

  //add event listner for volume control
  document.querySelector("#volumeControl").addEventListener("change",(e)=>{
    console.log(e.target.value)
    currentSong.volume = (e.target.value)/100
    if(e.target.value > 0){
        document.querySelector(".volume-svg").src = "./assest/volume-up.svg"
    }
  })

  // event listner for mute volume
  document.querySelector(".volume>img").addEventListener("click",(e)=>{
    if(e.target.src.includes("volume-up.svg")){
      e.target.src = "./assest/volume-mute.svg"
      currentSong.volume = "0";
      document.querySelector("#volumeControl").value = "0"
    }else{
      e.target.src = "./assest/volume-up.svg"
      currentSong.volume = "0.30"
      document.querySelector("#volumeControl").value = "30"
    }   
  })  
  

}

main();
