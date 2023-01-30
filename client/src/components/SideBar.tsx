import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AiOutlineHome, AiOutlineUsergroupAdd } from 'react-icons/ai';

const SideBar = () => {
  const location = useLocation();

  return (
    <aside className="hidden sm:block mt-12 w-20 border-r border-slate-700">
      <ul className="flex flex-col items-center mt-10">
        <li>
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
    </aside>
  );
};

export default SideBar;
