//`https://www.omdbapi.com/?apikey=ced795e8&s=${searchedMovie}`

const body = document.getElementById("body")
let searchedMovie = document.getElementById("movie-input")
const searchBtn = document.getElementById("search-btn")
const movieWrapper = document.getElementById("movie-wrap")
const closeBtn = document.getElementById("close")
const modalOverlay = document.getElementById("modal-wrapper")
const movieModal = document.getElementById("modal")
let footYear = document.getElementById("year")
let year = new Date
let currentYear = year.getFullYear()

footYear.innerHTML = `© ${currentYear}`


function getMovieData(searchedMovie) {
    return fetch(`https://www.omdbapi.com/?apikey=ced795e8&s=${searchedMovie}`)
    .then(response => response.json())
    .then(data => {
        console.log(data.Search)
        return data.Search //gives the array, just need to figure out how to get at it
    })
}

// On button click, pull the titles from the array of movie objects
function searchDatabase() {
    poster = ""
    movieWrapper.innerHTML =""
        const movieSearch = searchedMovie.value  // Get the search input value
        // Fetch the movie data and then handle the result
        getMovieData(movieSearch).then(movieArray => {
            if (movieArray) {
                // Loop through the array and log the Title of each movie
                movieArray.forEach((movie, index) => {
                        index = movie.imdbID
                        if (movie.Poster === "N/A") {
                            poster = `<img src="../assets/poster-not-available.png" class="movie-poster" alt="not poster available">`;
                          } else {
                            poster = `<img src="${movie.Poster}" class="movie-poster" alt="poster for ${movie.Title}>`;
                          }
                        movieWrapper.innerHTML += `
                        <div class="movie" data-index="${index}">
                            <div class="movie-inner-wrap">
                                <div class="movie-title-wrap">
                                    <h4>${movie.Title}</h4>
                                    <p>${movie.Year}</p>
                                </div>
                                ${poster}
                            </div>
                            <button class="more-info">More Info</button>
                        </div>
                        `
                        })
            } else {
                console.log('No movies found.')
            }
        })
}

function moreMovieInfo(imdbID) {
    poster = ""
    movieModal.innerHTML = ""
    return fetch(`https://www.omdbapi.com/?apikey=ced795e8&i=${imdbID}`)
      .then((response) => response.json())
      .then((details) => {
        // console.log(details);
        const ratings = []
        for(let i=0; i<details.Ratings.length; i++) {
            ratings.push(details.Ratings[i])
            // console.log(ratings.length)
        }
        if (details.Poster === "N/A") {
            poster = `<img src="../assets/poster-not-available.png" class="movie-poster" alt="not poster available">`;
          } else {
            poster = `<a href="${details.Poster}" target="_blank"><img src="${details.Poster}" class="movie-poster" alt="poster for ${movie.Title}></a>`;
          }
        // console.log(ratings)
        movieModal.innerHTML = `
          <div class="modal-movie" data-index="${details.imdbID}">
            <div class="movie-inner-wrap">
                <div class="movie-title-wrap">
                    <h4>${details.Title}</h4>
                    <p>${details.Year}</p>
                </div>
            ${poster}
            </div>
            <div class="modal-movie-details">
                <p class="plot">${details.Plot}</p>
                <p><span class="bold">Rated:</span> ${details.Rated}</p>
                <p><span class="bold">Genre:</span> ${details.Genre}</p>
                <p><span class="bold">Starring:</span>  ${details.Actors}</p>
                <p><span class="bold">Director:</span>  ${details.Director}</p>
                <div class="rating-wrap">
                    <div class="rating"><span class="bold">${ratings[0].Source}:</span> ${ratings[0].Value}</div>
                    `
                    if(ratings.length > 1) {
                        const rottenTomsRating = document.createElement("div")
                        rottenTomsRating.classList.add("rating")
                        rottenTomsRating.innerHTML = `<span class="bold">${ratings[1].Source}:</span> ${ratings[1].Value}`
                        const ratingWrap = document.querySelector(".rating-wrap")
                        ratingWrap.appendChild(rottenTomsRating)
                    }   if(ratings.length > 2) {
                            const metaRating = document.createElement("div")
                            metaRating.classList.add("rating")
                            metaRating.innerHTML = `<span class="bold">${ratings[2].Source}:</span> ${ratings[2].Value}`
                            const ratingWrap = document.querySelector(".rating-wrap")
                            ratingWrap.appendChild(metaRating)
                    }
                    `
                </div>
                <p class="imdb-info">Find out more about ${details.Title} on <a href="https://www.imdb.com/title/${details.imdbID}" target="_blank">IMDB</a></p>
            </div>
          </div>
        `

      })
  }

  function displayModal(imdbID) {
    modalOverlay.style.display = "flex";
    moreMovieInfo(imdbID);
  }

  // event listeners


function debounce(func, delay) {
    let timeoutId;
    return function(...args) {
        if (timeoutId) {
            clearTimeout(timeoutId); // Clears any previous timeout
        }
        timeoutId = setTimeout(() => {
            func.apply(this, args) // Execute the function after the delay
        }, delay)
    }
}

const debouncedSearchDatabase = debounce(searchDatabase, 600);

//live search as type in word - is this better than on enter or click? This has a delay so stops constant api pings on each keyup
  document.addEventListener('keyup', debouncedSearchDatabase)

  //search on enter
//   searchedMovie.addEventListener("keydown", (event) => {
//     if (event.key === "Enter") {
//       event.preventDefault();
//       searchDatabase();
//       moreMovieInfo();
//     }
//   });

  searchBtn.addEventListener("click", () => {
    searchDatabase();
  });

  movieWrapper.addEventListener("click", (e) => {
    if (e.target.classList.contains("more-info")) {
      const movieCard = e.target.closest(".movie");
      const imdbID = movieCard.getAttribute("data-index");
      displayModal(imdbID);
    //   body.style.overflow = "hidden"
    }
  });

  closeBtn.addEventListener("click", () => {
    modalOverlay.style.display = "none";
    // body.style.overflow = "visible"
  });

  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) {
      modalOverlay.style.display = "none";
    //   body.style.overflow = "visible"
    }
  });
