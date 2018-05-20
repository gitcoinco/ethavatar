import React from 'react';
import classnames from 'classnames';

export default ({isBlurred = false, children}) => (
  <div className={classnames({
    bg: true,
    blurred: isBlurred,
  })}>
    {children}
    <img className="circle" src="/images/circle.png" width="784" height="795" role="presentation" />
  </div>
);
