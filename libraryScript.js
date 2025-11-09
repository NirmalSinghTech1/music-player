import musicDetails from './music.js'
import { Music } from './script.js'
console.log(Music)

// variables
const libraryContainer = document.querySelector('#library-main-container')
const arrowBack = libraryContainer.querySelector('#arrow-back')
const songsList = libraryContainer.querySelector('#lib-songs-list')

musicDetails.forEach( song => {
    const { title, artist, poster } = song
    const li = document.createElement('li')
    li.setAttribute('id', 'song')
    li.innerHTML = `
    <img src="./images/${poster}.jfif" alt="${title} song poster" class="song-image">
    <div class="song-details">
        <p class="song-name">${title}</p>
        <p class="song-artist">By <span>${artist}</span> • 04:24</p>
    </div>
    <i class="material-icons lib-song-play">play_arrow</i>
    `
        
        songsList.appendChild(li)
    })

// const playArrow = libraryContainer.querySelector('.lib-song-play')
// playArrow.addEventListener('click', () => {
//     Music.playMusic()
// })