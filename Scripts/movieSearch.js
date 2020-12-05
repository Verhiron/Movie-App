$(document).ready(function() {

    //changes navbar colour + contents when scrolled
    $(window).scroll(function() {
        $('.navbar').toggleClass('scrolled', $(this).scrollTop() > 250);
    })

    //shows a bunch of movies on page load
    $.get("assets/ID.txt", function(data) {

        IdData = data.split("\n");
        lines = data.replace(/\r\n|\r/g, '\n').trim().split('\n');
        line = lines.slice(0, 100);

        $.each(line, function(key, value) {
            const movieLoad = "https://www.omdbapi.com/?apikey=60ec64a7&i=" + value;
            $.ajax(movieLoad).then(function(data) {
                var output = "";
                //if there are no images available then it will use a fallback image
                var poster = (data.Poster == 'N/A') ? 'assets/images/noImg.png' : data.Poster;
                output += `
              <div class="card-group rounded">
                <div class="card card_poster">
                    <a onclick="movieSelected('${data.imdbID}')" khref="#"><img class="card-img-top" src="${poster}" alt="${data.Title} poster"></a>
                </div>
              </div>
              `;

                $("#list").append(output);
            });

        });

    });

    // this is the movie search

    $('#movieSearchBar').on('submit', function(event) {
        const title = $('#searchMovie').val();
        getMovies(title);
        event.preventDefault();
        $('#searchMovie').val("");
    });

    function getMovies(title) {
        const movieURL = "https://www.omdbapi.com/?apikey=60ec64a7&s=" + title;

        $.ajax(movieURL).then(function(data) {
            var error = data.Response;
            if (error == 'False') {
                $("#list").html(data.Error);
            } else {
                var output = "";
                let movies = data.Search;
                $.each(movies, (index, movie) => {
                    const movieID = "https://www.omdbapi.com/?apikey=60ec64a7&i=" + movie.imdbID;
                    $.ajax(movieID).then(function(movie) {
                        var poster = (movie.Poster == 'N/A') ? 'assets/images/noImg.png' : movie.Poster;
                        output += `
                <div class="card-group rounded">
                    <div class="card card_poster">
                        <a onclick="movieSelected('${movie.imdbID}')" khref="#"><img class="card-img-top" src="${poster}" alt="${data.Title} poster"></a>
                    </div>
                </div>
                `;
                        $("#list").html(output);
                    });
                });
            }
        });
    }


});
//function for getting the ID for the individual movie
function movieSelected(id) {
    sessionStorage.setItem('movieId', id);
    window.location = 'movie.html';
    return false;
}
//gets the individual movie and displays it on a page
function getMovie() {
    let movieId = sessionStorage.getItem('movieId');

    const find = "https://www.omdbapi.com/?apikey=60ec64a7&i=" + movieId;

    $.ajax(find).then(function(data) {
        let movie = data;
        let output = `
    <div class="card mb-3 mt-5 p-2 info_card" style="max-width: 750px;">
		<div class="row no-gutters">
			<div class="col-md-4"><img alt="${movie.Title} Image" class="card-img" src="${movie.Poster}"></div>
			<div class="col-md-8">
				<div class="card-body">
					<h5 class="card-title pb-3 text-center">${movie.Title}</h5>
					<p class="pb-3 text-center">${movie.Plot}</p>
					<ul class="list-group list-group">
						<li class="list-group-item" style="height: auto;">Genre - ${movie.Genre}</li>
						<li class="list-group-item" style="height: auto;">Release Year - ${movie.Released}</li>
						<li class="list-group-item" style="height: auto;">Age Rating - ${movie.Rated}</li>
						<li class="list-group-item" style="height: auto;">IMDb Rating - ${movie.imdbRating}</li>
						<li class="list-group-item" style="height: auto;">Writer(s) - ${movie.Writer}</li>
						<li class="list-group-item" style="height: auto;">Director - ${movie.Director}</li>
						<li class="list-group-item" style="height: auto;">Actors - ${movie.Actors}</li>
						<li class="list-group-item" style="height: auto;">Awards - ${movie.Awards}</li>
					</ul>
				</div>
			</div>
		</div>
	</div
        `;
        $('#movie').html(output);
    });
}