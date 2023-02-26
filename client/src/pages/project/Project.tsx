import { useQuery, useSubscription } from '@apollo/client';
import { useEffect, useState } from 'react';
import { RiMenuLine } from 'react-icons/ri';
import { Link, Outlet, useLocation, useParams } from 'react-router-dom';
import { MEMBER_SUB, PROFILE } from '../../typedefs';
import { AiOutlineUsergroupAdd } from 'react-icons/ai';
import { NotificationType, Role } from '../../interfaces/enums';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { setClass, setRemoved } from '../../features/memberSlice';
import FreezeScreen from '../../components/FreezeScreen';
import SideBar from '../../components/SideBar';
import useWindowSize from '../../hooks/useWindowSize';
import { Menu } from '../../components/Menu';

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
  const { newRequest } = useAppSelector((state) => state.projectSlice);

  return (
    <main>
      {removed ? <FreezeScreen /> : null}
      <nav className="border-b fixed h-9 top-12 z-10 bg-[var(--medium-blue)] w-full border-slate-700">
        <div className="flex h-9 items-center justify-between md:justify-end">
          <RiMenuLine
            size={25}
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
      <div className="md:ml-32 mt-9">
        <Outlet />
      </div>
      <SideBar />
    </main>
  );
};

export default Project;
