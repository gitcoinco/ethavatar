import React from 'react';
import classnames from 'classnames';

export default ({ isBlurred = false, children, menuPushed }) => (
  <div className={classnames({
    bg: true,
    blurred: isBlurred,
  })}>
    {children}
    <img className={classnames({
        circle: true,
        pushed: menuPushed,
      })}
      src="/images/circle.png"
      width="784"
      height="795"
      role="presentation"
    />
    <h1 className={classnames({pushed: menuPushed})}>An Avatar for your ETH address</h1>
    <a className="made-with-gitcoin" href="https://gitcoin.co/" target="_blank">
      <img src="/images/made_with_gitcoin.png" width="400" height="67" alt="Made With GitCoin" />
    </a>
  </div>
);
