import React from 'react';
import classnames from 'classnames';

import Background from './Background.js';
import Header from './Header.js';
import { selectPanel } from './Panels.js';
import { isPresent } from '../utils/lib.js';

export default ({
  isBlurred = false,
  isCentered = false,
  selectedIndex = null,
  handleNavigation,
  children,
}) => (
  <div className="App">
    <Background isBlurred={isBlurred}>
      <Header
        selectedIndex={selectedIndex}
        handleNavigation={handleNavigation}
      />
    </Background>
    <main className={classnames({
      container: true,
      centered: isCentered,
      pushed: isPresent(selectedIndex),
    })}>
      {children}
    </main>
    <article className={classnames({
      pushed: isPresent(selectedIndex),
    })}>
      {selectPanel(handleNavigation, selectedIndex)}
    </article>
  </div>
);
