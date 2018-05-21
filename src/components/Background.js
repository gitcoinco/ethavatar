import React from 'react';
import classnames from 'classnames';

export default ({ isBlurred = false, children }) => (
  <div className={classnames({
    bg: true,
    blurred: isBlurred,
  })}>
    {children}
    <img className="circle" src="/images/circle.png" width="784" height="795" role="presentation" />
    <h1>An Avatar for<br />your <span className="h1-5">ETH</span> address</h1>
    <a className="made-with-gitcoin" href="https://gitcoin.co/" target="_blank">
      <img src="/images/made_with_gitcoin.png" width="400" height="67" alt="Made With GitCoin" />
    </a>
  </div>
);
