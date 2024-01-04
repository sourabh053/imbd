import { useState, useEffect } from "react";
import { API_KEY, IMAGE_BASE_URL, WATCHLIST_KEY } from "../constant";
import { getWatchlistFromLocalStorage } from "../util";

function Movies() {
  const [movies, setMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [pageNumber, setPageNumber] = useState(1);
  const [watchlist, setWatchlist] = useState(getWatchlistFromLocalStorage());

  const handleNext = () => {
    if (pageNumber === 500) return;
    setPageNumber(pageNumber + 1);
  };
  const handlePrev = () => {
    if (pageNumber === 1) return;
    setPageNumber(pageNumber - 1);
  };

  const isMediaAlredyPresentInWacthlist = (mediaId, watchlistMovies) => {
    return watchlistMovies.find((movie) => movie.id === mediaId);
  };
  const saveMediaToLocalStorage = (moviesObj) => {
    let currentWatchlist = getWatchlistFromLocalStorage();

    if (isMediaAlredyPresentInWacthlist(moviesObj.id, currentWatchlist)) return;
    currentWatchlist = [
      ...currentWatchlist,
      {
        id: moviesObj.id,
        title: moviesObj.title,
        posterPath: moviesObj.poster_path,
        releaseDate: moviesObj.release_date,
        voteAverage: moviesObj.vote_average,
        genreIds: moviesObj.genre_ids,
      },
    ];
    localStorage.setItem(WATCHLIST_KEY, JSON.stringify(currentWatchlist));
    setWatchlist(currentWatchlist);
  };

  const removeMediaFromLocalStorage = (mediaId) => {
    if (watchlist.length === 1) {
      localStorage.removeItem(WATCHLIST_KEY);
      setWatchlist([]);
      return;
    }

    let updatedWatchList = watchlist.filter((media) => media.id !== mediaId);
    localStorage.setItem(WATCHLIST_KEY, JSON.stringify(updatedWatchList));
    setWatchlist(updatedWatchList);
  };

  const handleMovieClick = (moviesObj = {}) => {
    const {id: mediaId} = moviesObj || {};
    if(isMediaAlredyPresentInWacthlist(mediaId, watchlist)){
      removeMediaFromLocalStorage(mediaId);
    }else{
      saveMediaToLocalStorage(moviesObj);
    }
  };

  const trendingMoviesUrl = `https://api.themoviedb.org/3/trending/movie/week?language=en-US&api_key=${API_KEY}&page=${pageNumber}`;
  const searchMovieUrl = `https://api.themoviedb.org/3/search/movie?language=en-US&api_key=${API_KEY}&query=${searchQuery}&page=${pageNumber}`;
  const options = { method: "GET", headers: { accept: "application/json" } };

  const getMovies = () => {
    setIsLoading(true);
    fetch(trendingMoviesUrl, options)
      .then((res) => res.json())
      .then((json) => setMovies(json.results))
      .catch((err) => console.error("error:" + err))
      .finally(() => setIsLoading(false));
  };

  const searchMovies = () => {
    setIsLoading(true);
    fetch(searchMovieUrl, options)
      .then((res) => res.json())
      .then((json) => setMovies(json.results))
      .catch((err) => console.error("error:" + err))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    if (searchQuery) {
      searchMovies(searchQuery);
    } else {
      getMovies();
    }
    //eslint-disable-next-line
  }, [pageNumber, searchQuery]);
  return (
    <div>
      <div className="text-2xl my-8 font-bold text-center underline">
        Trending Movies
      </div>
      <div className="flex justify-end px-11 mb-5">
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search"
          className="border"
        />
      </div>
      {isLoading ? (
        <div>Loding...</div>
      ) : (
        <div className="mx-[20px] mb-[12px] flex flex-wrap justify-center">
          {movies.map((movie, index) => {
            const { title = "", poster_path: posterPath } = movie;
            let temp = posterPath;
            if(posterPath === null){
              temp = 'https://www.csaff.org/wp-content/uploads/csaff-no-poster.jpg';
            }else{
              temp = `${IMAGE_BASE_URL}/${posterPath}`
            }
            return (
              <div className="mb-3 cursor-pointer">
                <div
                  key={index}
                  className="w-[160px] h-[30vh] bg-cover rounded-xl m-4 md:h-[40vh] md:w-[180px] hover:scale-110 duration-300 relative"
                  style={{
                    backgroundImage: `url(${temp})`,
                  }}
                >
                  <div
                    className="p-2 absolute right-0 bg-gray-900 rounded-xl"
                    onClick={() => handleMovieClick(movie)}
                  >
                    {isMediaAlredyPresentInWacthlist(movie.id, watchlist)
                      ? "❤️"
                      : "🤍"}
                  </div>
                  {/*  */}
                  <div className="text-xl rounded-b-lg bg-gray-900 bg-opacity-60 p-4 text-white w-full absolute bottom-0">
                    {title}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      <div className="flex justify-around space-x-2 my-5">
        <button disabled={pageNumber === 1 || isLoading} onClick={handlePrev}>
          Previous
        </button>
        <p>{pageNumber}</p>
        <button disabled={pageNumber === 500 || isLoading} onClick={handleNext}>
          Next
        </button>
      </div>
    </div>
  );
}

export default Movies;
