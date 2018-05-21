import React from 'react';
import classnames from 'classnames';

import Background from './Background.js';
import Header from './Header.js';
import Accordion from './Accordion.js';

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
      <Accordion title="This is question one on an accordion menu">
        <p>This is question one on an accordion menu</p>
      </Accordion>
      <Accordion title="Add question here?">
        <p>
          Nori grape silver beet broccoli kombu beet greens fava bean
          quandong celery. Bunya Link to something here nuts black
          eyed pea prairie turnip. Sierra leone bologi leek soko chicory
          celtuce parsley salsify.

          Nori grape silver beet broccoli kombu beet greens fava bean
          quandong bologi leek soko chicory celery.
        </p>
      </Accordion>
      <h2>For DApp Developers</h2>
      <Accordion title="How do I use ETH Avatar in my DApp?">
        <p>Good question! TODO - Lorem ipsum goes here</p>
      </Accordion>
    </div>
  </div>,
];

const selectPanel = (handleNavigation, selectedIndex) => {
  lastSelectedIndex = isPresent(selectedIndex) ? selectedIndex : lastSelectedIndex;
  return panels(handleNavigation)[lastSelectedIndex];
};

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
