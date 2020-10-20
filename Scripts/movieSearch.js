$(document).ready(function() {
    //shows a bunch of movies on page load

    $.get("assets/ID.txt", function(data){

        IdData = data.split("\n");
        lines = data.replace(/\r\n|\r/g, '\n').trim().split('\n');
        line = lines.slice(0, 100);

      $.each(line, function(key, value){
          const movieLoad = "https://www.omdbapi.com/?apikey=60ec64a7&i=" + value;
          $.ajax(movieLoad).then(function(data){
              var output = "";
              //if there are no images available then it will use a fallback image
              var poster = (data.Poster == 'N/A') ? 'assets/images/noImg.png' : data.Poster; 
              output += `
              <div class="movie">
              <a onclick="movieSelected('${data.imdbID}')" khref="#"><img src="${poster}" alt="W3Schools.com"></a>
              <a onclick="movieSelected('${data.imdbID}')" class="Select_button" href="#">${data.Title}</a>
              </div>
              `;
              
              $("#list").append(output);
            });
          
      });

    });

    // this is the movie search

    $('#movieSearchBar').on('submit', function(event){
        const title =  $('#searchMovie').val(); 
        getMovies(title);
        event.preventDefault();
        $('#searchMovie').val("");
    });

    function getMovies(title){
        const movieURL = "https://www.omdbapi.com/?apikey=60ec64a7&s=" + title;

        $.ajax(movieURL).then(function(data){
            var output = "";
            let movies = data.Search;
            $.each(movies, (index, movie) => {
                var poster = (movie.Poster == 'N/A') ? 'assets/images/noImg.png' : movie.Poster; 
                output += `
                <div class="movie">
                <a onclick="movieSelected('${movie.imdbID}')" khref="#"><img src="${poster}" alt="W3Schools.com"></a>
                <a onclick="movieSelected('${movie.imdbID}')" class="Select_button" href="#">${movie.Title}</a>
                </div>
                `;
              });
        
            $("#list").html(output);
          
        });
        
    }
    

});
//function for getting the ID for the individual movie
function movieSelected(id){
    sessionStorage.setItem('movieId', id);
    window.location = 'movie.html';
    return false;
}
//gets the individual movie and displays it on a page
function getMovie(){
    let movieId = sessionStorage.getItem('movieId');

    const find = "https://www.omdbapi.com/?apikey=60ec64a7&i=" + movieId;
  
    $.ajax(find).then(function(data){
        let movie = data;
        let output =`
        <title>${movie.Title}</title>
        <div class="movieContainer">
        <img src="${movie.Poster}">
        <div class="column">
        <h1>${movie.Title}</h1>
        <p>${movie.Plot}</p>
        <ul class="w3-ul">
              <li><strong class="listTitle">Genre:</strong> ${movie.Genre}</li>
              <li><strong class="listTitle">Released:</strong> ${movie.Released}</li>
              <li><strong class="listTitle">Rated:</strong> ${movie.Rated}</li>
              <li><strong class="listTitle">IMDB Rating:</strong> ${movie.imdbRating}</li>
              <li><strong class="listTitle">Director:</strong> ${movie.Director}</li>
              <li><strong class="listTitle">Writer:</strong> ${movie.Writer}</li>
              <li><strong class="listTitle">Actors:</strong> ${movie.Actors}</li>
        </ul>
        </div>
        </div>
        `;
        $('#movie').html(output);
    });
    }