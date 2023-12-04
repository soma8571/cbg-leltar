import React from 'react';
import {Link} from  'react-router-dom';
import { useCookies } from 'react-cookie';

function Header() {

  const [cookies, setCookies] = useCookies(['loggedIn']);
  
  const logout = () => {
    setCookies('loggedIn', false);
  }

  return (
    <div className='header'>
      <div className="logo">
        <img src={`${process.env.PUBLIC_URL}\CBG_logo.png`} alt="logo"/>
      </div>
      <header>
         <nav>
            <ul className='main-nav'>
               {/* <li><Link to={"/"}>Főoldal</Link></li> */}
               <li><Link to={"/uj-alkalmazott"}>Alkalmazottak</Link></li>
               {/* <li><Link to={"/read-from-drive"}>Beolvasás drive-ról</Link></li> */}
               <li><Link to={"/uj-tetel"}>Új leltári tétel</Link></li>
               <li><Link to={"/kereses"}>Keresés</Link></li>
            </ul>
         </nav>
      </header>
      <div className="logout">
        <button onClick={logout}>Kilépés</button>
      </div>
    </div>
  )
}

export default Header;
