import React from 'react';

export default ({ handleNavigation }) => (
  <a
    href="#"
    onClick={handleNavigation(null)}
  >
    <img
      className="logo"
      src="/images/logo.png"
      width="356"
      height="70"
      role="presentation"
    />
  </a>
);
