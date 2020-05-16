$(document).ready(() => {
  // obteniendo elementos del DOM
  var sectionHome = $('#home-search');
  var btnSearch = $('#search-btn');
  var inputTextSearch = $('#input-search');
  var itemHome = $('#v-pills-home-tab');
  var itemDrama = $('.drama');
  var itemAction = $('.action');
  var itemAdventure = $('.adventure');
  var itemAnimation = $('.animation');
  var itemComedy = $('.comedy');
  var itemHorror = $('.horror');
  var itemRomance = $('.romance');
  var titleModal = $('#title-movie');
  var synopsisModal = $('#synopsis');
  var actorsModal = $('#actors');
  var releaseDatesModal = $('#release-dates');
  var voteAverageModal = $('#vote-average');
  var imgModal = $('#img-modal');
  var trailerMovie = $('#trailer-movie');
  var btnFavorites = $('#add-favorites');
  var dataFavorites = [];

  // construir vista incial (seccion HOME) al cargar la página
  function getBestMoviesSectionHome() {
    var popularMoviesData = 'https://api.themoviedb.org/3/discover/movie?api_key=5076f0f992d07860e10ee70c4f034e5e&sort_by=popularity.desc';
    $.getJSON(popularMoviesData)
      .then((result) => {
        console.log(result);
        let movies = result.results;
        let moviesHtml = '';
        $.each(movies, (index, movie) => {
          moviesHtml += `
        <div class="col-6 col-sm-4 col-md-2">
          <div class="text-center">
            <img src="http://image.tmdb.org/t/p/w185/${movie.poster_path}" class="img-fluid selected-movie" data-id="${movie.id}" data-api="tmdb">
            <h5 class="letter-user">${movie.title}</h5>
          </div>
        </div>
      `;
        });
        $(sectionHome).html(moviesHtml);
        $('.selected-movie').click(function(event) {
          event.preventDefault();
          console.log('hice click');
          var id = $(this).attr('data-id');
          var nameApi = $(this).attr('data-api');
          sessionStorage.id = id;
          sessionStorage.nameApi = nameApi;
          window.location.href = 'movie.html';
          getMovieData(id, nameApi);
        });
      }).catch((err) => {
        console.log(err);
      });;
  }

  // asociando eventos a elementos del DOM
  itemHome.on('click', getBestMoviesSectionHome)
  btnSearch.on('click', (event) => {
    event.preventDefault();
    if (inputTextSearch.val()) {
      getMovies(inputTextSearch.val());
    };
  });

  // funcion para mostrar la informacion de la pelicula seleccionada
  function getMovieData(id, nameApi) {
    var secionAllCast = $('.v-pills-cast');
    var sectionBehindScenes = $('.v-pills-scenes');
    var sectionRecommendations = $('.v-pills-recommendations');
    var sectionReviews = $('.v-pills-reviews');
    var youtubeURL = 'https://www.youtube.com/embed/';    
    var titleMovie ; 
    if (nameApi === 'tmdb') {
      var dataMovie = 'https://api.themoviedb.org/3/movie/' + id + '?api_key=5076f0f992d07860e10ee70c4f034e5e';
      var creditMovieData = 'https://api.themoviedb.org/3/movie/' + id + '/credits?api_key=5076f0f992d07860e10ee70c4f034e5e';
      var trailerMovieData = 'https://api.themoviedb.org/3/movie/' + id + '/videos?api_key=5076f0f992d07860e10ee70c4f034e5e';
      var similarMoviesData = 'https://api.themoviedb.org/3/movie/' + id + '/similar?api_key=5076f0f992d07860e10ee70c4f034e5e&page=1';
      var reviewsData = 'https://api.themoviedb.org/3/movie/' + id + '/reviews?api_key=5076f0f992d07860e10ee70c4f034e5e&page=1';
      var listCastMovie = [];
      var trailerYoutubeKey;
      var tmdbImagesURL = 'http://image.tmdb.org/t/p/w185/';
      // obtener los creditos de la pelicula
      $.getJSON(creditMovieData)
        .then((result) => {
          console.log(result);
          for (let index = 0; index < 11; index++) {
            const nameCast = result['cast'][index]['name'];
            listCastMovie.push(nameCast);
          }
          // obtener seccion all cast
          var allCastData = result.cast;
          let movies = result.results;
          let castHtml = '';
          console.log(allCastData);
          $.each(allCastData, (index, movie) => {
            var profileImg = 'http://image.tmdb.org/t/p/w185/' + movie.profile_path;
            if (!movie.profile_path) {
              profileImg = '../../assets/images/not-image.jfif';
            }
            castHtml += `
          <div class="col-6 col-sm-4 col-md-2">
            <div class="text-center">
              <img src="${profileImg}" class="img-fluid selected-movie" data-id="${movie.id}" data-api="tmdb">
              <h5 class="letter-user">${movie.name}</h5>
            </div>
          </div>
        `;
          });
          $(secionAllCast).html(castHtml);
        });
      // obtener el trailer de la pelicula
      $.getJSON(trailerMovieData)
        .then((result) => {
          console.log(result);
          for (let index = 0; index < result.results.length; index++) {
            if (result.results[index]['type'] === 'Trailer') {
              trailerYoutubeKey = result.results[index]['key'];
              break;
            }
          }
        });
      // obtener la seccion de opiniones de la pelicula
      $.getJSON(reviewsData)
        .then((result) => {
          var listReviews = result.results;
          var reviewsHtml = '';
          $.each(listReviews, (index, review) => {
            reviewsHtml += `
            <p class="col-sm-8"><cite>${review.author}</cite>${review.content}</p>
            `;
          });
          $(sectionReviews).html(reviewsHtml);
        });

      // obtener la seccion behind scenes
      getDataBehindScenes();
      // obtener la seccion de peliculas similares
      $.getJSON(similarMoviesData)
        .then((result) => {
          var listSimilarMovies = result.results;
          var moviesHtml = '';
          $.each(listSimilarMovies, (index, movie) => {
            moviesHtml += `
            <div class="col-6 col-sm-4 col-md-2">
              <div class="text-center">
                <img src="http://image.tmdb.org/t/p/w185/${movie.poster_path}" class="img-fluid selected-movie" data-id="${movie.id}" data-api="tmdb">
                <h5 class="letter-user">${movie.title}</h5>
              </div>
            </div>
          `;
          });
          $(sectionRecommendations).html(moviesHtml);
          $('.selected-movie').click(function(event) {
            event.preventDefault();
            console.log('hice click');
            var id = $(this).attr('data-id');
            var nameApi = $(this).attr('data-api');
            sessionStorage.id = id;
            sessionStorage.nameApi = nameApi;
            window.location.href = 'movie.html';
            // getMovieData(id, nameApi);
          });
        }).catch((err) => {
          console.log(err);
        });
      // obtener la informacion de la pelicula
      $.getJSON(dataMovie)
        .then((result) => {
          listCastMovie = listCastMovie.toString();
          // insertar la información obtenida en HTML
          titleMovie = result.title ;
          titleModal.text(titleMovie);
          imgModal.attr('src', tmdbImagesURL + result.poster_path);
          synopsisModal.text(result.overview);
          actorsModal.text(listCastMovie);
          voteAverageModal.text(result.vote_average);
          releaseDatesModal.text(result.release_date);
          btnFavorites.attr('data-id', id);
          btnFavorites.attr('data-api', nameApi);
          $('#view-trailer').css('display', 'block');
          trailerMovie.css('display', 'block');
          trailerMovie.attr('src', youtubeURL + trailerYoutubeKey);
          // vericar si la pelicula ya fue agregada a favoritos
          for (let index = 0; index < dataFavorites.length; index++) {
            if (dataFavorites[index]['id'] === id) {
              btnFavorites.text('Added to Favorites');
            } else {
              btnFavorites.text('Add to Favorites');
            };
          };
        });
    } else if (nameApi === 'omdb') {
      $.getJSON('http://www.omdbapi.com?i=' + id + '&apikey=bea6c355')
        .then((result) => {
          console.log(result);
          let movie = result.data;
          console.log(movie);
          titleModal.text(result['Title']);
          imgModal.attr('src', result['Poster']);
          synopsisModal.text(result['Plot']);
          actorsModal.text(result['Actors']);
          voteAverageModal.text(result.imdbRating);
          releaseDatesModal.text(result['Released']);
          $('#view-trailer').css('display', 'none');
          trailerMovie.css('display', 'none');
          btnFavorites.attr('data-id', id);
          btnFavorites.attr('data-api', nameApi);
          // vericar si la pelicula ya fue agregada a favoritos
          for (let index = 0; index < dataFavorites.length; index++) {
            if (dataFavorites[index]['id'] === id) {
              btnFavorites.text('Added to Favorites');
            } else {
              btnFavorites.text('Add to Favorites');
            };
          };
        })
        .catch((err) => {
          console.log(err);
        });
    }

    function getDataBehindScenes() {
      var searchYoutube = encodeURI(titleMovie);      
      var youtubeApiHttp = 'https://www.googleapis.com/youtube/v3/search?part=id%2Csnippet&maxResults=10&order=relevance&q=' + searchYoutube + '%20behind%20scenes&type=video&videoEmbeddable=true&key=AIzaSyB0aCiCOYadELOxRuF0O_YwzAprTOIRAA8';
      $.getJSON(youtubeApiHttp)
        .then((result) => {
          console.log(result);
          var listResultVideos = result.items;
          var behindScenesHtml = '';
          $.each(listResultVideos, (index, video) => {
            behindScenesHtml += `
            
            `;
          }
          );
        });
    }
  }

  getBestMoviesSectionHome();
  getMovieData(sessionStorage.id, sessionStorage.nameApi);
});
