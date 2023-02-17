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

const Project = () => {
  const [showMenu, setShowMenu] = useState<boolean>(false);

  const location = useLocation();
  const params = useParams();

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
      <nav className="border-b border-slate-700">
        {/* {data.profile.id} */}
        {/* {rtData && rtData.refreshToken.token} */}
        <div className="flex items-center justify-between">
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
        <Menu show={showMenu} />
      </nav>
      <Outlet />
    </main>
  );
};

const Menu = ({ show }: { show: boolean }) => {
  const location = useLocation();
  return (
    <ul
      className={`${show ? 'block' : 'hidden'} md:flex
       border-t md:border-t-0
        animate-menu justify-center 
         border-slate-700 `}
    >
      <li
        className={
          location.pathname.includes('dashboard')
            ? `${
                show ? 'border-0' : 'border-x border-t'
              } border-slate-700 mb-[-1px] bg-[var(--medium-blue)]`
            : ''
        }
      >
        <Link
          to="dashboard"
          className="flex items-center hover:bg-[var(--medium-blue)] cursor-pointer px-3 py-1 transition-colors"
        >
          <MdDashboard className="mx-1.5" />
          <span>Dashboard</span>
        </Link>
      </li>
      <li
        className={
          location.pathname.includes('issues')
            ? `${
                show ? 'border-0' : 'border-x border-t'
              } border-slate-700 mb-[-1px] bg-[var(--medium-blue)]`
            : ''
        }
      >
        <Link
          to="issues"
          className="flex items-center hover:bg-[var(--medium-blue)] cursor-pointer px-3 py-1 transition-colors"
        >
          <VscIssues className="mx-1.5" />
          <span>Issues</span>
        </Link>
      </li>
      <li
        className={
          location.pathname.includes('members')
            ? `${
                show ? 'border-0' : 'border-x border-t'
              } border-slate-700 mb-[-1px] bg-[var(--medium-blue)]`
            : ''
        }
      >
        <Link
          to="members"
          className="flex items-center hover:bg-[var(--medium-blue)] cursor-pointer px-3 py-1 transition-colors"
        >
          <BsFillPeopleFill className="mx-1.5" />
          <span>Members</span>
        </Link>
      </li>
      <li className="flex items-center hover:bg-[var(--medium-blue)] cursor-pointer px-3 py-1 transition-colors">
        Histoy
      </li>
      <li
        className={
          location.pathname.includes('config')
            ? `${
                show ? 'border-0' : 'border-x border-t'
              }  border-slate-700 mb-[-1px] bg-[var(--medium-blue)]`
            : ''
        }
      >
        <Link
          to="config"
          className="flex items-center hover:bg-[var(--medium-blue)] cursor-pointer px-3 py-1 transition-colors"
        >
          <BsGearFill className="mx-1.5" />
          <span>Config</span>
        </Link>
      </li>
    </ul>
  );
};

export default Project;
