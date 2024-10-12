//`https://www.omdbapi.com/?apikey=ced795e8&s=${searchedMovie}`

let searchedMovie = document.getElementById("movie-input")
const searchBtn = document.getElementById("search-btn")
const movieWrapper = document.getElementById("movie-wrap")
const closeBtn = document.getElementById("close")
const modalOverlay = document.getElementById("modal-wrapper")
const movieModal = document.getElementById("modal")


function getMovieData(searchedMovie) {
    return fetch(`https://www.omdbapi.com/?apikey=ced795e8&s=${searchedMovie}`)
    .then(response => response.json())
    .then(data => {
        return data.Search //gives the array, just need to figure out how to get at it
    })
}

// function getIMDBData(imdbID) {
//     return fetch(`https://www.omdbapi.com/?apikey=ced795e8&i=${imdbID}`)
//     .then(response => response.json())
//     .then(data => {
//         console.log(data)
//         return data.Search //gives the array, just need to figure out how to get at it
//     })
// }


// On button click, pull the titles from the array of movie objects
function searchDatabase() {
    movieWrapper.innerHTML =""
        const movieSearch = searchedMovie.value  // Get the search input value
        // Fetch the movie data and then handle the result
        getMovieData(movieSearch).then(movieArray => {
            if (movieArray) {
                // Loop through the array and log the Title of each movie
                movieArray.forEach((movie, index) => {
                        index = movie.imdbID
                        movieWrapper.innerHTML += `
                        <div class="movie" data-index="${index}">
                        <h4>${movie.Title}</h4>
                        <p>${movie.Year}</p>
                        <img src="${movie.Poster}" class="movie-poster">
                        <p>For more information go to <a href="https://www.imdb.com/title/${movie.imdbID}" target="_blank">IMDB</a></p> d s
                        `
                        })
            } else {
                console.log('No movies found.')
            }
        })
}

function moreMovieInfo() {
        const movieSearchIMDB = searchedMovie.value  // Get the search input value
        // Fetch the movie data and then handle the result
        getMovieData(movieSearchIMDB).then(movieArray => {
            if (movieArray) {
                // Loop through the array and log the Title of each movie
                movieArray.forEach(movie => {
                    return fetch(`https://www.omdbapi.com/?apikey=ced795e8&i=${movie.imdbID}`)
                    .then(response => response.json())
                    .then(details => {
                        movieModal.innerHTML = `
                        <div class="movie">
                        <h4>${details.Title}</h4>
                        <p>${details.Year}</p>
                        <img src="${details.Poster}" class="movie-poster">
                        <p>For $more information go to <a href="https://www.imdb.com/title/${details.imdbID}" target="_blank">IMDB</a></p>
                        <p>${details.Actors}</p>
                        `
                        })
                })
            } else {
                console.log('No movies found.')
            }
        })
}

function displayModal() {
    modalOverlay.style.display = 'flex'
    moreMovieInfo()
}

// event listeners
searchedMovie.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault()
    searchDatabase()
    }
})

searchBtn.addEventListener('click', () => {
    searchDatabase()
})

movieWrapper.addEventListener('click', (e) => {
    modalOverlay.setAttribute('id', 'modal-wrapper')
    if(e.target !== movieWrapper) {
        const movieCard = e.target.closest(".movie")
        const index = movieCard.getAttribute('data-index')
        moreMovieInfo(index)
        displayModal(index)
    }
})

closeBtn.addEventListener('click', () => {
    modalOverlay.setAttribute('id', 'hidden')
    modalOverlay.style.display = 'none'
})