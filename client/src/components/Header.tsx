import React from 'react';
import { AiOutlineHome } from 'react-icons/ai';
import { Link, useLocation } from 'react-router-dom';

const Header = ({ data }: any) => {
  const location = useLocation();

  return (
    <header className="absolute w-full h-12 border-b border-slate-700">
      <ul className="flex items-center h-12 ">
        <li className="flex ">
          <Link
            to="/"
            className={`${
              location.pathname === '/' && 'bg-[var(--purple)]'
            } p-1.5 rounded-full inline-block`}
          >
            <AiOutlineHome size={30} />
          </Link>
        </li>
      </ul>
    </header>
  );
};

export default Header;
