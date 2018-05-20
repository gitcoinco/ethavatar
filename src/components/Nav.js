import React from 'react';
import classnames from 'classnames';

const menuItems = [
  'Avatar Lookup',
  'What Is It',
  'Use In Your DApp',
  'Help',
]

export default ({ selectedIndex }) => (
  <nav>
    {menuItems.map((item, i) => (
      <div key={`nav-${item.toLowerCase()}`} className={classnames({
        uppercase: true,
        selected: selectedIndex === i,
      })}>
        {item}
      </div>
    ))}
  </nav>
);
