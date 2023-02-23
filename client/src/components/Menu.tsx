import { MdDashboard } from 'react-icons/md';
import { VscIssues } from 'react-icons/vsc';
import { BsFillPeopleFill, BsGearFill } from 'react-icons/bs';
import { FaUserFriends } from 'react-icons/fa';
import { HiUser } from 'react-icons/hi';
import { Link, useLocation, useParams } from 'react-router-dom';
import useWindowSize from '../hooks/useWindowSize';
import { useQuery } from '@apollo/client';
import { FIND_REQUESTS_COUNT } from '../typedefs';
import { useAppSelector } from '../app/hooks';

export const Menu = ({ show }: { show: boolean }) => {
  const params = useParams();
  const location = useLocation();
  const [width, _] = useWindowSize();
  const { newRequest } = useAppSelector((state) => state.projectSlice);

  const fullScreen = width >= 770;
  const { data } = useQuery(FIND_REQUESTS_COUNT, {
    variables: {
      projectId: params.id && parseInt(params.id, 10),
    },
  });

  const className = `
  border-slate-700 bg-[var(--dark-blue-gray)] relative
  ${show ? 'border-0' : 'border-x border-t'} 
  ${
    fullScreen
      ? ' border-none hover:bg-[var(--medium-blue-gray)] rounded-full bg-[var(--medium-blue-gray)]'
      : 'mb-[-1px]'
  }
  `;

  return (
    <ul
      className={`${show ? 'block' : 'hidden'} md:block md:mt-4
        animate-menu justify-center h-52
         border-slate-700 bg-[var(--medium-blue)] border-b md:bg-transparent md:border-none `}
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
        className={`py-2 hover:bg-[var(--medium-blue-gray)]  relative ${
          location.pathname.includes('requests') ? className : ''
        }`}
      >
        <div className="relative flex items-center">
          <HiUser className="mx-1.5" size={20} />
          <span>Requests</span>
          <div className="absolute h-5 w-5 flex items-center justify-center right-1 rounded-full font-bold text-slate-200 text-xs bg-red-600/70">
            {data?.findCount > 9 ? '+9' : data?.findCount}
          </div>
          {newRequest ? (
            <span className="absolute -right-12 font-bold text-lg new-req-ad">
              New!
            </span>
          ) : undefined}
        </div>
        <Link
          to="requests"
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