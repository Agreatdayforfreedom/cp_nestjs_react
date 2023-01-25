import React from 'react';

const Header = ({ data }: any) => {
  return (
    <header className="absolute w-full h-12 border-b border-slate-700">
      {data.profile.username}
    </header>
  );
};

export default Header;
