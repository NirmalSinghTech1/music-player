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

const libraryContainer = document.querySelector('#library-main-container')
const arrowBack = libraryContainer.querySelector('#arrow-back')

let musicIndex = Math.floor(Math.random() * musicDetails.length) + 1
// console.log(musicIndex)

window.addEventListener('load', () => {
    UI.loadMusic(musicDetails[musicIndex - 1])
    UI.loadPlaylist()
})

class UI {
    static loadMusic(music){
        mainImage.setAttribute('src', `./images/${music.poster}.jfif`)
        musicName.innerText = music.title
        artistName.innerText = music.artist
        audio.setAttribute('src', `./tracks/${music.track}.mp3`)
        wrapper.style.background = `linear-gradient(rgba(0,0,0,0.1), #0c0c0c 60%), url("./images/${musicDetails[musicIndex - 1].poster}.jfif") no-repeat`; 
        wrapper.style.backgroundSize = '385px'
    }

    static loadPlaylist() {
        musicDetails.forEach( (song, index) => {
            const { title, artist, track, poster } = song
            const li = document.createElement('li')

            li.setAttribute('id', 'song')
            li.innerHTML = `
                <div class="song-img-wrapper" data-img="${index}" >
                    <img src="./images/${poster}.jfif" alt="${title} song poster" class="song-image">
                </div>
                <div class="song-details">
                    <audio src="./tracks/${track}.mp3" class="playlist-audio-track" data-audio="${index}"></audio>
                    <p class="song-name" data-title="${index}">${title}</p>
                    <p class="song-artist">By <span>${artist}</span> • 04:24</p>
                </div>
                <i class="material-icons lib-song-play" data-btn=${index}>play_arrow</i>
            `
            
            songsList.appendChild(li)
        })
    }

    static clearPlayingUi() {
        const songImgWrapper = document.querySelectorAll('.song-img-wrapper')
        const songNameAll = document.querySelectorAll('.song-name')
        const libSongPlayBtns = document.querySelectorAll('.lib-song-play')

        console.log('clearing')
        songImgWrapper.forEach( img => {
            if(img.classList.contains('gif')){
                img.classList.remove('gif')
            }
        })
        songNameAll.forEach( name => {
            if(name.classList.contains('green')){
                name.classList.remove('green')
            }
        })

        libSongPlayBtns.forEach( btn => {
            if(btn.innerHTML === 'pause'){
                btn.innerHTML = 'play_arrow'
            }
        })
    }

    static nowPlaying(currentIndex) {
        const playlistSongImg = document.querySelector(`[data-img="${currentIndex}"]`)
        const playlistSongName = document.querySelector(`[data-title="${currentIndex}"]`)
        const playlistSongPlay = document.querySelector(`[data-btn="${currentIndex}"]`)

        playlistSongImg.classList.add('gif')
        playlistSongName.classList.add('green')
        playlistSongPlay.innerHTML = 'pause'
        console.log('playing')
    }
}

class Music {
    static playMusic() {
        audio.play() 

        UI.clearPlayingUi()
        UI.nowPlaying(musicIndex - 1)
        playPause.innerHTML = 'pause'
    }
    
    static pauseMusic() {
        audio.pause()
        UI.clearPlayingUi()
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
        console.log('next', musicIndex)
        // console.log(musicIndex)
    }
    
    static previousMusic() {
        musicIndex--
        if(musicIndex <= 0){
            musicIndex = musicDetails.length
        }
        audio.addEventListener('canplay', () => {
            Music.playMusic()
        })
        console.log('previous', musicIndex)
    }
}

// click event listeners 
skipPrevious.addEventListener('click', () => {
    Music.previousMusic()
    UI.loadMusic(musicDetails[musicIndex - 1])
})

playPauseBtn.addEventListener('click', () => {
    Music.playPauseMusic()
    // UI.loadMusic()
})

skipNext.addEventListener('click', () => {
    Music.nextMusic()
    UI.loadMusic(musicDetails[musicIndex - 1])
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
            UI.loadMusic(musicDetails[musicIndex - 1])
            break;
        case 'repeat_one':
            Music.playMusic()
            break;
        case 'shuffle':
            musicIndex = Math.floor(Math.random() * musicDetails.length) + 1
            console.log('new Index', musicIndex)
            UI.loadMusic(musicDetails[musicIndex - 1])
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

queueMusic.addEventListener('click', () => {
   libraryContainer.classList.add('show-songs')
   libraryContainer.classList.remove('hide-songs')
})

/* =====================
   Library Section Script
   =======================
   */
const songsList = libraryContainer.querySelector('#lib-songs-list')

arrowBack.addEventListener('click', () => {
    libraryContainer.classList.add('hide-songs')  
    libraryContainer.classList.remove('show-songs')
})

const playBtn = libraryContainer.querySelectorAll('.lib-song-play')

class Audio {
    static pauseAllMusic(){
        let allSongs = document.querySelectorAll('.playlist-audio-track')
        allSongs.forEach( song => {
            song.pause()
        })
    }

    static handlePlayPause(track) {
        let playlistAudio = document.querySelector(`[data-audio="${track}"]`)
        const allBtns = document.querySelectorAll('.lib-song-play')
        const btn = document.querySelector(`[data-btn="${track}"]`)
        const img = document.querySelector(`[data-img="${track}"]`)
       
        
        if(btn.innerHTML === 'play_arrow') {
           
            Audio.pauseAllMusic()
            allBtns.forEach( btn => {
                if(btn.innerHTML === 'pause') {
                    btn.innerHTML = 'play_arrow'
                }
            })

            img.classList.add('gif')
            playlistAudio.play()

            if(!audio.paused){
                Music.pauseMusic()
            }
            UI.clearPlayingUi()
            UI.nowPlaying(track)
            btn.innerHTML = 'pause'
        } else {
            playlistAudio.pause()
            Music.pauseMusic()
            UI.clearPlayingUi()
            btn.innerHTML = 'play_arrow'
        }
    }

    static handlePlayFromPlaylist(trackIndex) {
        UI.loadMusic(musicDetails[trackIndex])
        Music.playMusic()
       UI.clearPlayingUi()
       UI.nowPlaying(trackIndex)

       Audio.pauseAllMusic()
    }
}

document.addEventListener('click', (e) => {
    e.target.dataset.btn && Audio.handlePlayPause(e.target.dataset.btn)
    e.target.dataset.title && Audio.handlePlayFromPlaylist(e.target.dataset.title)
})