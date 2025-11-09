import musicDetails from "./music.js"

// variables 
const wrapper = document.querySelector('#wrapper')
const favorite = wrapper.querySelector('#favorite')
const mainImage = wrapper.querySelector('#main-image')
const musicName = wrapper.querySelector('.music-name')
const artistName = wrapper.querySelector('.artist-name')
const progressBar = wrapper.querySelector('#song-progress-bar')
const bar = wrapper.querySelector('#bar')
const audio = wrapper.querySelector('#audio')
const currentTime = wrapper.querySelector('.current-time')
const durationTime = wrapper.querySelector('.duration-time')
const musicMode = wrapper.querySelector('#music-mode')
const skipPrevious = wrapper.querySelector('#skip-previous')
const playPauseBtn = wrapper.querySelector('.play-pause-btn')
const playPause = wrapper.querySelector('.play-pause-btn i')
const skipNext = wrapper.querySelector('#skip-next')
const queueMusic = wrapper.querySelector('#queue-music')

let musicIndex = Math.floor(Math.random() * musicDetails.length) + 1
let isMusicPlaying = false
let canPlay = false

window.addEventListener('load', () => {
    UI.loadMusic()
})

class UI {
    static loadMusic(){
        mainImage.setAttribute('src', `./images/${musicDetails[musicIndex - 1].poster}.jfif`)
        musicName.innerText = musicDetails[musicIndex - 1].title
        artistName.innerText = musicDetails[musicIndex - 1].artist
        audio.setAttribute('src', `./tracks/${musicDetails[musicIndex - 1].track}.mp3`)
        wrapper.style.background = `linear-gradient(rgba(0,0,0,0.1), #0c0c0c 60%), url("./images/${musicDetails[musicIndex - 1].poster}.jfif") no-repeat`; 
        wrapper.style.backgroundSize = '385px'
    }
}

export class Music {
    static playMusic() {
        audio.play() 

        playPause.innerHTML = 'pause'
    }
    
    static pauseMusic() {
        audio.pause()
        playPause.innerHTML = 'play_arrow'
    }
    
    static playPauseMusic(){
        if(playPause.innerText === 'play_arrow'){
            Music.playMusic()
        } else Music.pauseMusic()
    }

    static nextMusic() {
        musicIndex++
        if(musicIndex > musicDetails.length){
            musicIndex = 1
        }
        audio.addEventListener('canplay', () => {
            Music.playMusic()
        })
        // console.log(musicIndex)
    }
    
    static previousMusic() {
        musicIndex--
        // console.log(musicIndex)
        if(musicIndex <= 0){
            musicIndex = musicDetails.length
        }

        Music.playMusic()
    }
}

// click event listeners 
skipPrevious.addEventListener('click', () => {
    UI.loadMusic()
    Music.previousMusic()
})

playPauseBtn.addEventListener('click', () => {
    Music.playPauseMusic()
    // UI.loadMusic()
})

skipNext.addEventListener('click', () => {
    UI.loadMusic()
    Music.nextMusic()
})

// progress bar working
audio.addEventListener('timeupdate', (e)=> {
    let audioCurrentTime = e.target.currentTime
    let audioDuration = e.target.duration

    let sec = Math.floor(audioCurrentTime)
    let min = Math.floor(audioCurrentTime / 60)

    let time = audioCurrentTime / audioDuration * 100
    bar.style.width = `${time}%`
    if(sec >= 59){
        sec = sec % 60
    }

    currentTime.innerHTML = `${min < 10 ? '0' : ''}${min}:${sec < 10 ? '0' : ''}${sec}`
})

audio.addEventListener('loadedmetadata', (e) => {
    const durationInSec = e.target.duration
    let min = Math.floor(durationInSec / 60)
    let sec = Math.floor(durationInSec % 60)

    durationTime.innerHTML = `${min}:${sec < 10 ? '0' : ''}${sec}`
})

class XMouseEvent {
    static clickEvent(event) {
        if(event.offsetX >= 0){
            bar.style.width = `${event.offsetX}px`
            let barWidth = progressBar.offsetWidth
            
            let startTime = (event.offsetX * audio.duration) / barWidth
            audio.currentTime = startTime
        }
    }
}

progressBar.addEventListener('click', (e) => {
    XMouseEvent.clickEvent(e)
})

musicMode.addEventListener('click', () => {
    let mode = musicMode.innerText
    switch(mode){
        case 'repeat':
            musicMode.innerText = 'repeat_one'
            break;
        case 'repeat_one':
            musicMode.innerText = 'shuffle'
            break;
        case 'shuffle':
            musicMode.innerText = 'repeat'
            break;
        default: 
            break;
    }
})

audio.addEventListener('ended', () => {
    let mode = musicMode.innerText
    console.log(mode)
    switch(mode) {
        case 'repeat':
            Music.nextMusic()
            UI.loadMusic()
            break;
        case 'repeat_one':
            Music.playMusic()
            break;
        case 'shuffle':
            musicIndex = Math.floor(Math.random() * musicDetails.length) + 1
            console.log('new Index', musicIndex)
            UI.loadMusic()
            Music.playMusic()
            break;
        default: 
            break;
    }
    // Music.nextMusic()
    // UI.loadMusic()
})

favorite.addEventListener('click', () => {
    favorite.innerText = favorite.innerText === 'favorite' ? 'favorite_border' : 'favorite'
    
    favorite.classList.toggle('liked')
    console.log(favorite)
})

