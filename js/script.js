console.log('Welcome to PlayFi');

let currentSong = new Audio();
let songs;
let currFolder;
async function getSongs(folder) {
    // console.log(folder)
    currFolder = folder;
    let a = await fetch(`${folder}`)
    // console.log(a);
    let response = await a.text();
    // console.log(response);
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    songs = []

    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        // console.log(element);
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`${folder}`)[1])
        }
    }
    // console.log(songs);

    let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0];
    songUL.innerHTML = "";
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li><img class="invert" src="/img/music.svg" alt="">
                            <div class="info">
                                <div>${song.replaceAll('%20', " ")}</div>
                                <div>Kuldeep D</div>
                            </div>
                            <div class="playnow">
                                <span>Play now</span>
                                <img class="invert" src="/img/play.svg" alt="">
                            </div></li>`;
    }

    // Setting Current song src on the loading of web page


    // Attach an event listener to each song
    Array.from(document.querySelector(".songlist").getElementsByTagName('li')).forEach(e => {
        e.addEventListener("click", () => {
            // console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playMusic(e.querySelector(".info").firstElementChild.innerHTML)
        })
    })

}
// Function to play a music
const playMusic = (track, pause = false) => {
    // console.log(track)
    currentSong.src = `${currFolder}` + track
    // console.log(currentSong.src)
    if (!pause) {
        currentSong.play()
        play.src = "/img/pause.svg"
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
}
// Function to converting time into 00:00 format

function SecondsToMMSS(seconds) {
    const minutes = (Math.floor(seconds / 60));
    const remainingSeconds = Math.floor(seconds % 60);

    // Pad with leading zeros if necessary
    const minutesStr = minutes.toString().padStart(2, '0');
    const secondsStr = remainingSeconds.toString().padStart(2, '0');

    return `${minutesStr}:${secondsStr}`;
}

async function displayAlbums() {
    let a = await fetch('/songs/')
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a")
    let cardContainer = document.querySelector(".cardContainer")
    let array = Array.from(anchors)
    for(let index = 0;index < array.length;index++) {
        const e = array[index]
        // console.log(e)
        if (e.href.includes("/songs/")) {
            let folder = (e.href.split("/").slice(-2)[1])
            // console.log((e.href.split("/").slice(-2)[1]))

            //    get the matadeta of the folder
            let a = await fetch(`/songs/${folder}/info.json`)
            let response = await a.json();
            // console.log(response)
            // console.log(cardContainer.innerHTML)
            cardContainer.innerHTML = cardContainer.innerHTML + `<div data-folder="cs" class="card">
                        <div class="play">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16"
                                color="#000000" fill="#000">
                                <path
                                    d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z"
                                    stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />
                            </svg>
                        </div>
                        <img src="/songs/${folder}/cover.jpeg" alt="">
                        <h2>${response.title}</h2>
                        <p>${response.description}</p>
                    </div>`
            // console.log(cardContainer.innerHTML)
        }
        // console.log(cardContainer.innerHTML)
    }

        // load the playlist whenever click the card
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            songs = await getSongs(`/songs/${item.currentTarget.dataset.folder}/`)
        })
    })
}

async function main() {
    await getSongs("/songs/ncs/");
    // console.log(songs[0].replaceAll("%20"," "))
    // playMusic(songs[0].replaceAll("%20"," "))
    // console.log(songs)
    displayAlbums()
    playMusic(songs[0], true)

    // display all the albums on the page 

    // SHow all the songs in playlist


    // Attach an event listener to previous button and next bottons
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = "/img/pause.svg";
        }
        else {
            currentSong.pause()
            play.src = "/img/play.svg";
        }
    })

    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = `${SecondsToMMSS(currentSong.currentTime)}/${SecondsToMMSS(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    })
    // Updating seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100;

    })
    // event listener for hamburger
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = 0
    })

    // event listener for close
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%"
    })

    // eventlistener for previous and next

    previous.addEventListener("click", () => {
        // console.log('prevoius clicked')
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if (index - 1 > length) {
            playMusic(songs[index - 1])
        }
    })

    next.addEventListener("click", () => {
        // console.log('prevoius clicked')
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if (index + 1 < songs.length) {
            playMusic(songs[index + 1])
        }
    })

    // add an event listener to volume

    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        // console.log(e.target)
        currentSong.volume = (e.target.value / 100)
    })

    // add evenrlistener to mute the track
    document.querySelector(".volume > img").addEventListener("click",e=>{
        console.log(e.target.src.includes("volume.svg"))
        if(e.target.src.includes("volume.svg")){
            e.target.src = e.target.src.replace("volume.svg","mute.svg")
            currentSong.volume = 0;
        }
        else{
            e.target.src = e.target.src.replace("mute.svg","volume.svg")
            console.log(e.target.src)
            currentSong.volume = .10;
        }
    })
}

main()