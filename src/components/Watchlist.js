import { useState, useEffect } from "react";
import { API_KEY, IMAGE_BASE_URL, WATCHLIST_KEY } from "../constant";
import { getWatchlistFromLocalStorage } from "../util";

function Watchlist() {
  const [genreMap, setGenreMap] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [watchlist, setWatchlist] = useState(getWatchlistFromLocalStorage());

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
  const sortByRating = () => {
    const temp = [...watchlist];
    const updatedWatchList = temp.sort((a, b) => b.voteAverage - a.voteAverage);
    setWatchlist(updatedWatchList);
  };

  const handleFilter = (e) => {
    const selectedGenreId = e.target.value;
    if (selectedGenreId === "All") {
      setWatchlist(getWatchlistFromLocalStorage());
    } else {
      const filteredWatchList = getWatchlistFromLocalStorage().filter(
        ({ genreIds }) => genreIds.includes(parseInt(selectedGenreId))
      );
      setWatchlist(filteredWatchList);
    }
  };

  const searchMovieUrl = `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`;
  const options = { method: "GET", headers: { accept: "application/json" } };

  const getGenre = () => {
    setIsLoading(true);
    fetch(searchMovieUrl, options)
      .then((res) => res.json())
      .then(({ genres }) => {
        const computedGenreMap = genres.reduce((acc, genreObj) => {
          const { id, name } = genreObj;
          return { ...acc, [id]: name };
        }, {});
        setGenreMap(computedGenreMap);
      })
      .catch((err) => console.error("error:" + err))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    getGenre();
    // eslint-disable-next-line
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {watchlist.length === 0 ? (
        "No Watchlisted Movies"
      ) : (
        <div className="mx-auto px-4 mt-4">
          <div className="flex justify-between">
            <select
              type="button"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-xl text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              disabled={watchlist.length === 0}
              onChange={handleFilter}
            >
              <option value="All">All</option>
              {getWatchlistFromLocalStorage().map(({ genreIds = [] }) => {
                return genreIds.map((genreId) => (
                  <option key={genreId} value={genreId}>
                    {genreMap[genreId]}
                  </option>
                ));
              })}
            </select>
            <button
              type="button"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-xl text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              disabled={watchlist.length === 0}
              onClick={sortByRating}
            >
              Sort by Rating
            </button>
          </div>
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xl text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Poster
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Title
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Average Rating
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Genre(s)
                  </th>
                  <th scope="col" className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {watchlist.map(
                  ({
                    id,
                    title = "",
                    genreIds = [],
                    voteAverage,
                    posterPath,
                  }) => {
                    let temp = posterPath;
                    if (posterPath === null) {
                      temp =
                        "https://www.csaff.org/wp-content/uploads/csaff-no-poster.jpg";
                    } else {
                      temp = `${IMAGE_BASE_URL}/${posterPath}`;
                    }
                    return (
                      <tr
                        key={id}
                        className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-600"
                      >
                        <td className="w-[120px] h-[25vh] min-h-[200px]">
                          <img src={`${temp}`} alt={title} />
                        </td>
                        <td className="text-xl px-6 py-4">{title}</td>
                        <td className="text-xl px-6 py-4">{voteAverage}</td>
                        <td className="text-xl px-6 py-4">
                          {genreIds
                            .map((genreId) => genreMap[genreId] || "")
                            .join(", ")}
                        </td>
                        <td
                          className=" space-x-1 px-6 py-4 cursor-pointer text-red-200 hover:text-red-500"
                          onClick={() => removeMediaFromLocalStorage(id)}
                        >
                          <span>Delete</span>
                          <span>🗑️</span>
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default Watchlist;
