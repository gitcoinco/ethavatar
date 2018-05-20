import React from 'react';

import Background from './Background.js';
import Header from './Header.js';

export default () => (
  <div className="App">
    <Background isBlurred={true}>
      <Header selectedIndex={0} />
    </Background>
    <main className="container centered">
      <h2>No Connection To The Ethereum Network</h2>
      <p>Browse this website with:</p>
      <p>Metamask / Parity / Mist</p>
      <a href="/help">Need Help?</a>
    </main>
  </div>
);
