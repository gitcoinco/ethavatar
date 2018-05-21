import React from 'react';

export default ({icon, link, alt}) => (
  <a href={link} className="dapp">
    <img src={icon} alt={alt} width="70" height="70" />
  </a>
)
