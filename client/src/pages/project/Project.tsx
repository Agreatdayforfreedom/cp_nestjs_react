import { useLazyQuery, useQuery, useSubscription } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { MdDashboard } from 'react-icons/md';
import { VscIssues } from 'react-icons/vsc';
import { BsFillPeopleFill, BsGearFill } from 'react-icons/bs';
import { RiMenuLine } from 'react-icons/ri';
import {
  Link,
  Navigate,
  Outlet,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom';
import {
  FIND_AUTH_MEMBER,
  FIND_MEMBERS,
  FIND_PROJECT,
  MEMBER_SUB,
  PROFILE,
  REFRESH_TOKEN,
} from '../../typedefs';
import { AiOutlineUsergroupAdd } from 'react-icons/ai';
import Spinner from '../../components/loaders/Spinner';
import { NotificationType, Role } from '../../interfaces/enums';
import InitSpinner from '../../components/loaders/InitSpinner';
import Notification from '../../components/Notification';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { setClass, setRemoved } from '../../features/members/memberSlice';
import FreezeScreen from '../../components/FreezeScreen';
import SideBar from '../../components/SideBar';
import useWindowSize from '../../hooks/useWindowSize';

const Project = () => {
  const [showMenu, setShowMenu] = useState<boolean>(false);

  const location = useLocation();
  const params = useParams();

  const [width, _] = useWindowSize();

  const { removed } = useAppSelector((state) => state.memberSlice);
  const dispatch = useAppDispatch();

  const { data, loading, error } = useQuery(PROFILE, {
    fetchPolicy: 'network-only',
  });

  const { data: sData } = useSubscription(MEMBER_SUB, {
    variables: {
      userId: data && data.profile.id,
      projectId: params.id && parseInt(params.id, 10),
    },
  });
  useEffect(() => {
    if (sData) {
      if (
        sData.memberSub.id === data.profile.currentProjectMember.id &&
        sData.memberSub.notificationType === NotificationType.MEMBER_REMOVED
      ) {
        dispatch(
          setClass({
            memberClass: NotificationType.MEMBER_REMOVED,
          }),
        );
        dispatch(setRemoved(true));
      }
    }
  }, [sData]);

  useEffect(() => {
    setShowMenu(false);
  }, [location]);

  return (
    <main>
      {removed ? <FreezeScreen /> : null}
      <nav className="border-b fixed top-12 z-20 bg-[var(--medium-blue)] w-full border-slate-700">
        <div className="flex items-center justify-between md:justify-end">
          <RiMenuLine
            size={30}
            className="mx-4 my-2 cursor-pointer md:hidden"
            onClick={() => setShowMenu((prev) => !prev)}
          />
          {data && data.profile.role !== Role.MEMBER && (
            <Link
              to="search"
              className={`${
                location.pathname === '/search' &&
                'border-2 border-[var(--purple)]'
              } p-1.5 rounded-full inline-block `}
            >
              <AiOutlineUsergroupAdd size={25} />
            </Link>
          )}
        </div>
        {width <= 770 ? <Menu show={showMenu} /> : undefined}
      </nav>
      <SideBar />
      <div className="md:ml-32 mt-10 ">
        <Outlet />
      </div>
    </main>
  );
};

export const Menu = ({ show }: { show: boolean }) => {
  const location = useLocation();
  const [width, _] = useWindowSize();

  const fullScreen = width >= 770;

  const className = `
  border-slate-700 bg-[var(--dark-blue-gray)] relative
  ${show ? 'border-0' : 'border-x border-t'} 
  ${
    fullScreen
      ? ' border-none hover:bg-[var(--medium-blue-gray)] rounded-full bg-[var(--medium-blue-gray)]'
      : 'mb-[-1px]'
  }
  `;

  const noFocuses = ``;

  return (
    <ul
      className={`${show ? 'block' : 'hidden'} md:block md:mt-4
        animate-menu justify-center
         border-slate-700 `}
    >
      <li
        className={`py-2 hover:bg-[var(--medium-blue-gray)]  relative ${
          location.pathname.includes('dashboard') ? className : ''
        }`}
      >
        <div className="flex items-center">
          <MdDashboard className="mx-1.5" size={20} />
          <span>Dashboard</span>
        </div>
        <Link
          to="dashboard"
          className="absolute top-0 w-full h-full  cursor-pointer px-3 py-1 transition-colors"
        />
      </li>
      <li
        className={`py-2 hover:bg-[var(--medium-blue-gray)]  relative ${
          location.pathname.includes('issues') ? className : ''
        }`}
      >
        <div className="flex items-center">
          <VscIssues className="mx-1.5" size={20} />
          <span>Issues</span>
        </div>
        <Link
          to="issues"
          className="absolute top-0 w-full h-full  cursor-pointer px-3 py-1 transition-colors"
        ></Link>
      </li>
      <li
        className={`py-2 hover:bg-[var(--medium-blue-gray)]  relative ${
          location.pathname.includes('members') ? className : ''
        }`}
      >
        <div className="flex items-center">
          <BsFillPeopleFill className="mx-1.5" />
          <span>Members</span>
        </div>
        <Link
          to="members"
          className="absolute top-0 w-full h-full  cursor-pointer px-3 py-1 transition-colors"
        ></Link>
      </li>

      <li
        className={`py-2 hover:bg-[var(--medium-blue-gray)] relative ${
          location.pathname.includes('config') ? className : ''
        }`}
      >
        <div className="flex items-center">
          <BsGearFill className="mx-1.5" />
          <span>Config</span>
        </div>
        <Link
          to="config"
          className="absolute top-0 w-full h-full  cursor-pointer px-3 py-1 transition-colors"
        ></Link>
      </li>
    </ul>
  );
};

export default Project;
