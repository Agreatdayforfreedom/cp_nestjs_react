import { useQuery, useSubscription } from '@apollo/client';
import { useEffect, useState } from 'react';
import { Link, Navigate, Outlet, useParams } from 'react-router-dom';
import { URLSearchParams } from 'url';
import Header from '../components/Header';
import InitSpinner from '../components/loaders/InitSpinner';
import Notification from '../components/Notification';
import SideBar from '../components/SideBar';
import { MEMBER_SUB, PROFILE, REFRESH_TOKEN } from '../typedefs';

const MainLayout = () => {
  const [showNotification, setShowNotification] = useState(false);
  const params = useParams();

  const { data, loading, error } = useQuery(PROFILE, {
    fetchPolicy: 'network-only',
  });

  //todo: improve notification and do something else.
  if (loading) return <InitSpinner />;
  if (error) return <Navigate to="/login" />;
  return (
    <div className="flex min-h-screen min-w-screen">
      <Header />
      {/* <SideBar /> */}
      <div className="mt-12 w-full relative">
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
