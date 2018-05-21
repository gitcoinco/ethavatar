import React from 'react';
import classnames from 'classnames';

import Background from './Background.js';
import Header from './Header.js';

const isPresent = selectedIndex => selectedIndex !== null && selectedIndex !== undefined;

let lastSelectedIndex;

const panels = (handleNavigation) => [
  <div>
    Avatar Lookup
  </div>,
  <div>
    What Is It
  </div>,
  <div>
    Use It In Your DApp
  </div>,
  <div>
    <header>
      <h4>Help</h4>
      <h4 className="pointer" onClick={handleNavigation()}>Back</h4>
    </header>
    <div>
      <h2>Upload your Avatar</h2>
    </div>
  </div>,
];

const selectPanel = (handleNavigation, selectedIndex) => {
  lastSelectedIndex = isPresent(selectedIndex) ? selectedIndex : lastSelectedIndex;
  return panels(handleNavigation)[lastSelectedIndex];
}

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
