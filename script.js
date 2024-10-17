console.log("Lets write some javaScript");
let songs;
let currentSong = new Audio();
async function getSongs(){
    let a = await fetch("http://127.0.0.1:5500/songs/");
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    let songs = []
    for (let i = 0; i < as.length; i++) {
        const element = as[i];
        if(element.href.endsWith(".mp3")){
            songs.push(element.href.split("/songs/")[1]);
        }
    }
    return songs;
}

function secondToSecondMinute(seconds){
    const minutes = Math.floor(seconds / 60)
    const remainingSecond = Math.floor(seconds % 60)
    const formattedMinutes = String(minutes).padStart(2,'0')
    const formattedSeconds = String(remainingSecond).padStart(2,'0')
    return `${formattedMinutes}:${formattedSeconds}`
}

const playMusic = (track) =>{
    // let audio = new Audio("/songs/" + track)
    currentSong.src = "/songs/" + track;
    currentSong.play()
    play.src = "pause.svg"
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
}
async function main()
{
    // get the list of all the songs
    songs = await getSongs();
    currentSong.src = "/songs/" + songs[0];
    document.querySelector(".songinfo").innerHTML = songs[0].replaceAll("%20"," ")
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
    // show all the song in the playlist
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li>
        <img class="invert" src="music.svg" alt="">
        <div class="info">
            <div>${song.replaceAll("%20"," ")}</div>
            <div>Zaid Ansari</div>
        </div>
        <div class="playnow">
            <span>Play Now</span>
            <img class="invert" src="play.svg" alt="">
        </div></li>`
    }

    // Attach an event listener to each songs

    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e=>{
        e.addEventListener("click", element=>{
            console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playMusic(e.querySelector(".info").firstElementChild.innerHTML)
        })
    })

    // Attach an event listener to play, next and previous
    play.addEventListener("click", ()=>{
        if(currentSong.paused){
            currentSong.play()
            play.src = "pause.svg"
        }
        else
        {
            currentSong.pause()
            play.src = "play2.svg"
        }
    })

    // Listen for timeupdate event

    currentSong.addEventListener("timeupdate", ()=>{
        // console.log(currentSong.currentTime,currentSong.duration)
        document.querySelector(".songtime").innerHTML = `${secondToSecondMinute(currentSong.currentTime)}/${secondToSecondMinute(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime/currentSong.duration) * 100 + "%";
    })

    // Add an event listener to seekbar
    document.querySelector(".seekbar").addEventListener("click", e=>{
        let percent = (e.offsetX/e.target.getBoundingClientRect().width) * 100;
        if(percent < 0)
            percent = 0;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = (currentSong.duration * percent)/100;

    })

    // Add eventlistener for hamburger
    document.querySelector(".hamburger").addEventListener("click",()=>{
        document.querySelector(".left").style.left = "0"
    })

    // Add eventlistener for hamburger
    document.querySelector(".close").addEventListener("click",()=>{
        document.querySelector(".left").style.left = "-100%"
    })

   // Add eventlistener to previous
   previous.addEventListener("click", ()=>{
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        if((index-1) >= 0)
        {
            playMusic(songs[index-1])
        }
    })
    
    // Add eventlistener to next
    next.addEventListener("click", ()=>{
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        if((index+1) < songs.length)
        {
            playMusic(songs[index+1])
        }
   })
   // Add an event to volume
   document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
        currentSong.volume = parseInt(e.target.value)/100;
   })
}

main()