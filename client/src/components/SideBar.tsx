import React, { useEffect, useLayoutEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AiOutlineHome, AiOutlineUsergroupAdd } from 'react-icons/ai';
import useWindowSize from '../hooks/useWindowSize';
import { Menu } from './Menu';

const SideBar = () => {
  const location = useLocation();

  const [width, _] = useWindowSize();
  // }, [window.innerWidth]);

  return (
    <aside className="fixed hidden md:block h-full top-[84px] w-32 border-r border-slate-700">
      {/* <ul className="flex flex-col items-center mt-10"> */}
      {width >= 770 ? <Menu show={false} /> : undefined}
      {/* </ul> */}
    </aside>
  );
};

export default SideBar;
