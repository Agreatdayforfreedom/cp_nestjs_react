import { useQuery } from '@apollo/client';
import React, { useState } from 'react';
import { MdDashboard } from 'react-icons/md';
import { VscIssues } from 'react-icons/vsc';
import { BsFillPeopleFill, BsGearFill } from 'react-icons/bs';
import { RiMenuLine } from 'react-icons/ri';
import { Link, Outlet, useParams } from 'react-router-dom';
import { FIND_PROJECT } from '../../typedefs';
import { AiOutlineUsergroupAdd } from 'react-icons/ai';

const Project = () => {
  const [showMenu, setShowMenu] = useState<boolean>(false);

  return (
    <main>
      <nav className="border-b border-slate-700">
        <div className="flex items-center justify-between">
          <RiMenuLine
            size={30}
            className="mx-4 my-2 cursor-pointer md:hidden"
            onClick={() => setShowMenu((prev) => !prev)}
          />
          <Link
            to="search"
            className={`${
              location.pathname === '/search' &&
              'border-2 border-[var(--purple)]'
            } p-1.5 rounded-full inline-block `}
          >
            <AiOutlineUsergroupAdd size={25} />
          </Link>
        </div>
        <Menu show={showMenu} />
      </nav>
      <Outlet />
    </main>
  );
};

const Menu = ({ show }: { show: boolean }) => {
  return (
    <ul
      className={`${show ? 'block' : 'hidden'} md:flex
       border-t md:border-t-0
        animate-menu justify-center 
         border-slate-700`}
    >
      <li>
        <Link
          to="dashboard"
          className="flex items-center hover:bg-[var(--blue)] cursor-pointer px-3 py-1 transition-colors"
        >
          <MdDashboard className="mx-1.5" />
          <span>Dashboard</span>
        </Link>
      </li>
      <li>
        <Link
          to="issues"
          className="flex items-center hover:bg-[var(--blue)] cursor-pointer px-3 py-1 transition-colors"
        >
          <VscIssues className="mx-1.5" />
          <span>Issues</span>
        </Link>
      </li>
      <li>
        <Link
          to="members"
          className="flex items-center hover:bg-[var(--blue)] cursor-pointer px-3 py-1 transition-colors"
        >
          <BsFillPeopleFill className="mx-1.5" />
          <span>Members</span>
        </Link>
      </li>
      <li className="flex items-center hover:bg-[var(--blue)] cursor-pointer px-3 py-1 transition-colors">
        Histoy
      </li>
      <li>
        <Link
          to="config"
          className="flex items-center hover:bg-[var(--blue)] cursor-pointer px-3 py-1 transition-colors"
        >
          <BsGearFill className="mx-1.5" />
          <span>Config</span>
        </Link>
      </li>
    </ul>
  );
};

export default Project;
