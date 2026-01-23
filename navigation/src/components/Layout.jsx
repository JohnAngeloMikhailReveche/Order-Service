import React from 'react';
import UniversalNavbar from './Navbar';

function Layout({ children }) {
  return (
    <>
      <UniversalNavbar />
      <div style={{ paddingTop: '76px' }}>
        {children}
      </div>
    </>
  );
}

export default Layout;
