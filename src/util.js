import { WATCHLIST_KEY } from "./constant";

export const getWatchlistFromLocalStorage = () => {
    const watchlist = localStorage.getItem(WATCHLIST_KEY);
    let value;
    if (watchlist) {
      value = JSON.parse(watchlist);
    } else {
      value = [];
    }
    return value;
  };