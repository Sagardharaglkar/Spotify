let currentSong = new Audio();
let songs = [];
let curFolder;
let valumeVal = 0;
let path ="https://github.com/Sagardharaglkar/Spotify/";
// console.log(window.location.origin);
console.log("Push succsess4");

const {origin} = window.location;
console.log(origin);

// let path = "https://meek-alpaca-2d9fc7.netlify.app/";


async function getSongs(folder) {
    curFolder = folder;
    // let a = await fetch(`http://127.0.0.1:3000/Spotify/${folder}/`);
    let a = await fetch(`${folder}/`);
    // console.log(a);
    
    // let a = await fetch(`https://drive.google.com/drive/folders/1GXz5cC-6P8MCRD4R59mFEZjlb6kCVuew?usp=drive_link`);
    let responce = await a.text();
    // console.log(responce);

    let div = document.createElement("div");
    div.innerHTML = responce;
    let as = div.getElementsByTagName("a");

    songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1]);
        }
    }
    console.log(songs);
    

    //show all the songs in the playlist
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0];
    songUL.innerHTML = "";
    for (const song of songs) {
        // console.log(song.replaceAll("%20", " "));

        songUL.innerHTML = songUL.innerHTML + `
                <li>  
                    <div class="cardInfoFirst">                    
                      <img src="img/music.svg" class="invert " alt="">
                      <div class="info">
                        <div>${song.replaceAll("%20", " ")}</div>
                        <div>Song Artist</div>
                      </div></div>


                </li>`;

    }

    //Attach an event listener to each song
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            // console.log(e.querySelector(".info").firstElementChild.innerHTML);
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());

        })

    })

    return songs;
}

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return `00:00`
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formatedMinutes = String(minutes).padStart(2, '0');
    const formatedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formatedMinutes}:${formatedSeconds}`;
}

const playMusic = (track, pause = false) => {
    currentSong.src = `${curFolder}/` + track;

    if (!pause) {
        play.src = "img/pause.svg"

        currentSong.play();
    }


    document.querySelector(".songInfo").innerHTML = decodeURI(track);
    document.querySelector(".songTime").innerHTML = "00:00 / 00:00";

}

async function displayAlbums() {
    let a = await fetch(`songs/`);
    let responce = await a.text();
    let div = document.createElement("div");
    div.innerHTML = responce;
    let anchors = div.getElementsByTagName("a");
    let cardContainer = document.querySelector(".cardContainer");
    // let folders =[];
    // Array.from(anchors).forEach(async e => {
    let array = Array.from(anchors);
    console.log(array);
    
    for (let index = 0; index < array.length; index++) {
        const e = array[index];

        if (e.href.includes("songs/")) {
            let folder = e.href.split("/").slice(-2)[0];
            console.log(folder);
            
            let a = await fetch(`songs/${folder}/info.json`);
            let responce = await a.json();
            // console.log(responce);
            cardContainer.innerHTML = cardContainer.innerHTML + `<div data-folder="${folder}" class="card">
                    <div  class="play">
                        <svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="30" cy="30" r="28" fill="#00ff00"/>
                            <polygon points="25,20 40,30 25,40" fill="black"/>
                          </svg>
                    </div>
                    <img src="/songs/${folder}/cover.jpg" alt="">
                    <h2>${responce.title}</h2>
                    <p>${responce.description}</p>
                </div>`

        }
    }
    //Load the playlist wheneve card is clicked

    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`);
            playMusic(songs[0]);
            // item.dataset.folder
        })
    })
    // console.log(anchors);

}

async function main() {
    // Get the list of all the Songs
    await getSongs("songs/Ashiqui2");
    playMusic(songs[0], true);
    // console.log(songs);

    //Display All the albums on the page
    displayAlbums();


    //Attach an event listener to play, next, previous
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            // playMusic();
            currentSong.play();
            play.src = "img/pause.svg"
        } else {
            currentSong.pause();
            play.src = "img/play.svg"
        }
    })

    // currentSong.addEventListener("timeupdate", () => {
    //     if (currentSong.paused) {
    //         play.src = "img/pause.svg"
    //     }
    // })

    //Listen for timeUpdate events
    currentSong.addEventListener("timeupdate", () => {
        // console.log(secondsToMinutesSeconds(currentSong.currentTime), secondsToMinutesSeconds(currentSong.duration));;
        document.querySelector(".songTime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
        if (currentSong.currentTime == currentSong.duration) {
            let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
            playMusic(songs[(index + 1) % songs.length]);
        }

    })

    // Play the First song
    // var audio = new Audio(songs[0]);
    // audio.play();

    // audio.addEventListener("loadeddata", () => {
    //     let duration = audio.duration;
    //     console.log(duration, audio.currentTime,);

    // })

    //Add an event listener to seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = (currentSong.duration * percent) / 100;
    })

    //Add an eventListener to hamburger
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = 0;
    })

    //Add an eventListener to close

    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-110% ";
    })

    previous.addEventListener("click", () => {
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);

        if (index - 1 < 0) {
            playMusic(songs[(songs.length - 1)]);

        } else {
            playMusic(songs[(index - 1) % songs.length]);

        }
    })

    next.addEventListener("click", () => {
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);

        playMusic(songs[(index + 1) % songs.length]);
    })


    //add an event to volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        valumeVal = parseInt(e.target.value) / 100;
        currentSong.volume = valumeVal;
        // console.log(valumeVal);


    })

    //Add event listener to mute the track
    document.querySelector(".volume > img").addEventListener("click", e => {
        // console.log(e.target);
        // console.log(valumeVal);

        if (e.target.src.includes("img/volume.svg")) {
            e.target.src = e.target.src.replace("volume", "mute");
            currentSong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        } else {
            currentSong.volume = valumeVal;
            e.target.src = e.target.src.replace("mute", "volume");
            document.querySelector(".range").getElementsByTagName("input")[0].value = valumeVal * 100;

        }

    })


}


main();