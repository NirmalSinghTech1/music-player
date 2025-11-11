import musicDetails from "./music.js"

// DOM Elements
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

// Playlist section elements
const libraryContainer = document.querySelector('#library-main-container')
const arrowBack = libraryContainer.querySelector('#arrow-back')
const allSongsTab = document.querySelector('#all-songs-tab')
const likedSongsTab = document.querySelector('#liked-songs-tab')
const downloadTab = document.querySelector('#download-tab')

// Global Music Index
let musicIndex = Math.floor(Math.random() * musicDetails.length) + 1

window.addEventListener('load', () => {
    UI.loadMusic(musicDetails[musicIndex - 1])
    UI.loadAllPlaylist()
    FavoriteSong.loadFavoriteSongs()
})

// Handles UI updates and DOM manipulation
class UI {
    
    // display current music-track details
    static loadMusic(music){
        mainImage.setAttribute('src', `./images/${music.poster}.jfif`)
        musicName.innerText = music.title
        artistName.innerText = music.artist
        audio.setAttribute('src', `./tracks/${music.track}.mp3`)
        wrapper.style.background = `linear-gradient(rgba(0,0,0,0.1), #0c0c0c 60%), url("./images/${musicDetails[musicIndex - 1].poster}.jfif") no-repeat`; 
        wrapper.style.backgroundSize = '100%'
        FavoriteSong.loadFavoriteSongs()
    }

    // load all playlist songs - All Tab under categories
    static loadAllPlaylist() {
        allSongsTab.classList.add('current-tab')
        songsList.innerHTML = ``

        musicDetails.forEach( (song, index) => {
            const { title, artist, track, poster } = song
            const li = document.createElement('li')
            li.setAttribute('id', 'song')
            li.innerHTML = `
                <div class="song-img-wrapper" data-img="${index + 1}" >
                    <img src="./images/${poster}.jfif" alt="${title} song poster" class="song-image">
                </div>
                <div class="song-details">
                    <audio src="./tracks/${track}.mp3" class="playlist-audio-track" data-audio="${index + 1}"></audio>
                    <p class="song-name" data-title="${index + 1}">${title}</p>
                    <p class="song-artist">By <span>${artist}</span> • 04:24</p>
                </div>
                <i class="material-icons lib-song-play" data-btn=${index + 1}>play_arrow</i>
            `
            
            songsList.appendChild(li)
        })

        likedSongsTab.classList.remove('current-tab')
        downloadTab.classList.remove('current-tab')
        UI.clearPlayingUi()

        // displaying currently playing music UI
        if(!audio.paused){
            UI.nowPlaying(musicIndex)
        }
    }

    // Load all liked songs - Liked Tab under categories
    static loadLikedSongs() {
        // getting indexes from local-storage
        const likedSongsFromLocal = JSON.parse(localStorage.getItem('likedSongs')) || []
        songsList.innerHTML = ``
        
        likedSongsTab.classList.add('current-tab')
        allSongsTab.classList.remove('current-tab')
        downloadTab.classList.remove('current-tab')

        UI.clearPlayingUi()

        // check if there are any liked songs
        if(likedSongsFromLocal.length > 0) {
            // loading from local-storage
            likedSongsFromLocal.forEach( songId => {
                const { title, track, artist, poster } = musicDetails[songId]
                const li = document.createElement('li')

                li.setAttribute('id', 'song')
                li.innerHTML = `
                    <div class="song-img-wrapper" data-img="${songId}" >
                        <img src="./images/${poster}.jfif" alt="${title} song poster" class="song-image">
                    </div>
                    <div class="song-details">
                        <audio src="./tracks/${track}.mp3" class="playlist-audio-track" data-audio="${songId}"></audio>
                        <p class="song-name" data-title="${songId}">${title}</p>
                        <p class="song-artist">By <span>${artist}</span> • 04:24</p>
                    </div>
                    <i class="material-icons lib-song-play" data-btn=${songId}>play_arrow</i>
                `
                
                songsList.appendChild(li)
                if(!audio.paused && musicName.innerHTML === title){
                    UI.nowPlaying(songId)
                }
            })
        } else {
            songsList.innerHTML = `<p class="no-songs-message">You haven't liked any songs yet.</p>`
        }
    }

    // Download Tab under categories
    static loadDownload() {
        allSongsTab.classList.remove('current-tab')
        likedSongsTab.classList.remove('current-tab')
        downloadTab.classList.add('current-tab')

        songsList.innerHTML = ``
        songsList.innerHTML = `<p class="no-songs-message">This option is currently unavailable.</p>`
    }

    // Clearing current playing music UI when audio is paused
    static clearPlayingUi() {
        const songImgWrapper = document.querySelectorAll('.song-img-wrapper')
        const songNameAll = document.querySelectorAll('.song-name')
        const libSongPlayBtns = document.querySelectorAll('.lib-song-play')

        // clearing sound waves gif
        songImgWrapper.forEach( img => {
            if(img.classList.contains('gif')){
                img.classList.remove('gif')
            }
        })
        // clearing green color of song title
        songNameAll.forEach( name => {
            if(name.classList.contains('green')){
                name.classList.remove('green')
            }
        })

        // Adding pause button to all playlist songs
        libSongPlayBtns.forEach( btn => {
            if(btn.innerHTML === 'pause'){
                btn.innerHTML = 'play_arrow'
            }
        })
    }

    // Updating the playlist UI while a song is playing
    static nowPlaying(currentIndex) {
        console.log('nowplaying', currentIndex)
        const playlistSongImg = document.querySelector(`[data-img="${currentIndex}"]`)
        const playlistSongName = document.querySelector(`[data-title="${currentIndex}"]`)
        const playlistSongPlay = document.querySelector(`[data-btn="${currentIndex}"]`)

        playlistSongImg && playlistSongImg.classList.add('gif');
        playlistSongName && playlistSongName.classList.add('green');
        if(playlistSongPlay){
            playlistSongPlay.innerHTML = 'pause';
        }
    }
}

// Controls music playback functionality
class Music {
    static playMusic() {
        audio.play() 
        UI.clearPlayingUi()
        UI.nowPlaying(musicIndex)
        playPause.innerHTML = 'pause'
        FavoriteSong.loadFavoriteSongs()
    }
    
    static pauseMusic() {
        audio.pause()
        UI.clearPlayingUi()
        playPause.innerHTML = 'play_arrow'
        FavoriteSong.loadFavoriteSongs()
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
    }
    
    static previousMusic() {
        musicIndex--
        if(musicIndex <= 0){
            musicIndex = musicDetails.length
        }
    }
}

// EVENT LISTENERS

// Handles click event for previous track
skipPrevious.addEventListener('click', () => {
    Music.previousMusic()
    UI.loadMusic(musicDetails[musicIndex - 1])
    Music.playMusic()
})

// Handles click event for play/pause button
playPauseBtn.addEventListener('click', () => {
    Music.playPauseMusic()
})

// handles click event for next track
skipNext.addEventListener('click', () => {
    Music.nextMusic()
    UI.loadMusic(musicDetails[musicIndex - 1])
    Music.playMusic()
})

// handles progress bar functionality and updating the UI
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

// Updating music total duration UI when audio available
audio.addEventListener('loadedmetadata', (e) => {
    const durationInSec = e.target.duration
    let min = Math.floor(durationInSec / 60)
    let sec = Math.floor(durationInSec % 60)

    durationTime.innerHTML = `${min}:${sec < 10 ? '0' : ''}${sec}`
})

// Jumps to specific time in the progress bar
function handleProgressClick(event){
    if(event.offsetX >= 0){
        bar.style.width = `${event.offsetX}px`
        let barWidth = progressBar.offsetWidth
        
        let startTime = (event.offsetX * audio.duration) / barWidth
        audio.currentTime = startTime
    }
}

// Handles click event for jumping to specific time in progress bar
progressBar.addEventListener('click', (e) => {
    // XMouseEvent.clickEvent(e)
    handleProgressClick(e)
})

// Handles click event for changing the song mode UI - shuffle, repeat, repeat-one
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

// Playing music as per the mode selected when music ended
audio.addEventListener('ended', () => {
    let mode = musicMode.innerText
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
            UI.loadMusic(musicDetails[musicIndex - 1])
            Music.playMusic()
            break;
        default: 
        break;
    }
})

// Handles liked songs functions
class FavoriteSong {
    // adding liked songs to local storage and updating UI
    static addToFavorite(id) {
        let likedSongs = JSON.parse(localStorage.getItem('likedSongs')) || []

        // Check if song is liked
        if(!favorite.classList.contains('liked')){
            favorite.classList.add('liked')
            // check if song is already included in the local storage
            if(!likedSongs.includes(id)){
                likedSongs.push(id)
                localStorage.setItem('likedSongs', JSON.stringify(likedSongs))
            }
        } else {
            favorite.classList.remove('liked')
            likedSongs = likedSongs.filter( item => item !== id)
            localStorage.setItem('likedSongs', JSON.stringify(likedSongs))
        }
    }

    // Handles Like button UI when page loads
    static loadFavoriteSongs() {
        let likedSongs = JSON.parse(localStorage.getItem('likedSongs')) || []
        const isLiked = likedSongs.includes(musicIndex - 1)
        
        if(isLiked){
            favorite.innerHTML = 'favorite'
            favorite.classList.add('liked')
        } else {
            favorite.innerHTML = 'favorite_border'
            favorite.classList.remove('liked')
        }
    }   
}

// Handles click event when the song like button is clicked
favorite.addEventListener('click', () => {
    favorite.innerText = favorite.innerText === 'favorite' ? 'favorite_border' : 'favorite'

    FavoriteSong.addToFavorite(musicIndex - 1)
    FavoriteSong.loadFavoriteSongs()
})

// Handles click event for show/hide playlist
queueMusic.addEventListener('click', () => {
   libraryContainer.classList.add('show-songs')
   libraryContainer.classList.remove('hide-songs')
    UI.loadLikedSongs()
})

/* =====================
   Library Section Script
   =======================
*/
const songsList = libraryContainer.querySelector('#lib-songs-list')

// Hiding playlist
arrowBack.addEventListener('click', () => {
    libraryContainer.classList.add('hide-songs')  
    libraryContainer.classList.remove('show-songs')
})

// Handles music play/pause directly from playlist
class MyMusic {

    // Pausing all music and updating button UI
    static pauseAllMusic(){
        let allSongs = document.querySelectorAll('.playlist-audio-track')
        const allBtns = document.querySelectorAll('.lib-song-play')

        allSongs.forEach( song => {
            song.pause()
        })

        allBtns.forEach( btn => {
            if(btn.innerHTML === 'pause') {
                btn.innerHTML = 'play_arrow'
            }
        })
    }

    // Handles play/pause music in playlist
    static handlePlayPause(track) {
        let playlistAudio = document.querySelector(`[data-audio="${track}"]`)
        const btn = document.querySelector(`[data-btn="${track}"]`)
        const img = document.querySelector(`[data-img="${track}"]`)
       
        // check if music is currently paused
        if(btn.innerHTML === 'play_arrow') {
            MyMusic.pauseAllMusic()
            
            // Automatically pausing last playing song in player when playlist music is active
            if(!audio.paused){
                Music.pauseMusic()
            }
            playlistAudio.play()
            
            // Updating UI
            img.classList.add('gif')
            UI.clearPlayingUi()
            UI.nowPlaying(track)
            btn.innerHTML = 'pause'
        } else {
            btn.innerHTML = 'play_arrow'
            playlistAudio.pause()
            Music.pauseMusic()
            UI.clearPlayingUi()
        }
    }

    static handlePlayFromPlaylist(trackIndex) {
        musicIndex = Number(trackIndex)
        UI.loadMusic(musicDetails[musicIndex - 1])
        Music.playMusic()
        MyMusic.pauseAllMusic()
    }
}

// Handles playlist section click events 
document.addEventListener('click', (e) => {
    e.target.dataset.btn && MyMusic.handlePlayPause(e.target.dataset.btn)
    e.target.dataset.title && MyMusic.handlePlayFromPlaylist(e.target.dataset.title)
    e.target.dataset.all && UI.loadAllPlaylist()
    e.target.dataset.liked && UI.loadLikedSongs(e.target.dataset.liked)
    e.target.dataset.download && UI.loadDownload()
})