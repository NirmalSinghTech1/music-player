import musicDetails from './music.js'

document.addEventListener('DOMContentLoaded', () => {

    // variables
    const libraryContainer = document.querySelector('#library-main-container')
    const arrowBack = libraryContainer.querySelector('#arrow-back')
    const songsList = libraryContainer.querySelector('#lib-songs-list')
    
    musicDetails.forEach( (song, index) => {
        const { title, artist, track, poster } = song
        const li = document.createElement('li')
    
        li.setAttribute('id', 'song')
        li.innerHTML = `
            <img src="./images/${poster}.jfif" alt="${title} song poster" class="song-image">
            <div class="song-details">
                <audio src="./tracks/${track}.mp3" data-audio="${index}"></audio>
                <p class="song-name"><a href="index.html">${title}</a></p>
                <p class="song-artist">By <span>${artist}</span> • 04:24</p>
            </div>
            <i class="material-icons lib-song-play" data-btn=${index}>play_arrow</i>
        `
            
            songsList.appendChild(li)
        })
    
    const playPauseBtn = libraryContainer.querySelectorAll('.lib-song-play')
    
    class Audio {
        static handlePlayPause(track) {
            let audio = document.querySelector(`[data-audio="${track}"]`)
            let allSongs = document.querySelectorAll('audio')
            const allBtns = document.querySelectorAll('.lib-song-play')
            let btn = document.querySelector(`[data-btn="${track}"]`)
            
            if(btn.innerHTML === 'play_arrow') {
                allSongs.forEach( audio => {
                    audio.pause()
                })
    
                allBtns.forEach( btn => {
                    if(btn.innerHTML === 'pause') {
                        btn.innerHTML = 'play_arrow'
                    }
                })
                audio.play()
                btn.innerHTML = 'pause'
            } else {
                audio.pause()
                btn.innerHTML = 'play_arrow'
            }
            // if(track.innerText === 'play_arrow') {
            //     Audio.play
            // } else Audio.pause()
        }
    }
    
    document.addEventListener('click', (e) => {
        e.target.dataset.btn && Audio.handlePlayPause(e.target.dataset.btn)
    })
    
    // playArrow.addEventListener('click', () => {
    //     Music.playMusic()
    // })
})