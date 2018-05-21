import React from 'react';
import classnames from 'classnames';

const menuItems = [
  'Avatar Lookup',
  'What Is It',
  'Use In Your DApp',
  'Help',
]

export default ({ selectedIndex, handleNavigation }) => (
  <nav>
    {menuItems.map((item, i) => (
      <a
        key={`nav-${item.toLowerCase()}`}
        href="#"
        onClick={handleNavigation(i)}
        className={classnames({
          uppercase: true,
          selected: selectedIndex === i,
        })}
      >
        {item}
      </a>
    ))}
  </nav>
);
