import React from 'react';
import Footer from './Footer';
import Header from './Header';

function Layout( {content} ) {
  return (
    <div>
      <Header />
      <div className='main'>
         <main>
            {content}
         </main>
      </div>
      <Footer />
    </div>
  );
}

export default Layout;
