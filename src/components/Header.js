import React from 'react';

import Logo from './Logo.js';
import Nav from './Nav.js';

export default () => (
  <header>
    <Logo />
    <Nav selectedIndex={0} />
  </header>
);
