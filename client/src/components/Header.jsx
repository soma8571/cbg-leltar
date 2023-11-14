import React from 'react';
import {Link} from  'react-router-dom';

function Header() {
  return (
    <div className='header'>
      <header>
         <nav>
            <ul className='main-nav'>
               <li><Link to={"/"}>Főoldal</Link></li>
               <li><Link to={"/uj-alkalmazott"}>Új alkalmazott</Link></li>
               <li><Link to={"/read-from-drive"}>Beolvasás drive-ról</Link></li>
            </ul>
         </nav>
      </header>
      
    </div>
  )
}

export default Header;
