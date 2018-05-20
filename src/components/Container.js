import React from 'react';
import classnames from 'classnames';

import Background from './Background.js';
import Header from './Header.js';

export default ({
  isBlurred = false,
  isCentered = false,
  selectedIndex = 0,
  children
}) => (
  <div className="App">
    <Background isBlurred={isBlurred}>
      <Header selectedIndex={selectedIndex} />
    </Background>
    <main className={classnames({
      container: true,
      centered: isCentered,
    })}>
      {children}
    </main>
  </div>
);
