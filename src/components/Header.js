import { NavLink } from "react-router-dom";

function Header() {
    return (
      <header className='flex border space-x-8 justify-between p-2'>
        <div className='flex space-x-4'>
          <NavLink to='/'>Movies</NavLink>
          <NavLink to='/watchlist'>WatchList</NavLink>
        </div>
      </header>
    );
  }
  
  export default Header;