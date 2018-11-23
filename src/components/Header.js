import React from 'react';

import Logo from './Logo.js';
import Nav from './Nav.js';

export default ({ selectedIndex, handleNavigation, toggleMenuPushed, menuPushed }) => (
  <header>
    <Logo handleNavigation={handleNavigation} />
    <Nav
      selectedIndex={selectedIndex}
      handleNavigation={handleNavigation}
      menuPushed={menuPushed}
      toggleMenuPushed={toggleMenuPushed}
    />
  </header>
);
