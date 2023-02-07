import { gql, useLazyQuery, useQuery, useSubscription } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useNavigate, useParams } from 'react-router-dom';
import Header from '../components/Header';
import InitSpinner from '../components/loaders/InitSpinner';
import Notification from '../components/Notification';
import SideBar from '../components/SideBar';
import { Ban } from '../interfaces/enums';
import { MEMBER_SUB, PROFILE, REFRESH_TOKEN } from '../typedefs';

const MainLayout = () => {
  const [showNotification, setShowNotification] = useState(false);
  const params = useParams();

  const { data, loading, error } = useQuery(PROFILE, {
    fetchPolicy: 'network-only',
  });

  const {
    data: sData,
    loading: sLoading,
    error: sError,
  } = useSubscription(MEMBER_SUB, {
    variables: {
      userId: data && data.profile.id,
      projectId: params.id && parseInt(params.id, 10),
    },
  });
  useEffect(() => {
    if (sData) {
      setShowNotification(Boolean(sData.memberSub.id));
    }
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  }, [sData]);
  //todo: improve notification and do something else.
  if (loading) return <InitSpinner />;
  if (error) return <Navigate to="/login" />;
  return (
    <div className="flex min-h-screen min-w-screen">
      {!sLoading && showNotification ? (
        <Notification>
          <span className="text-black">
            {sData ? sData.memberSub.user.username : ''}
          </span>
          {sData.memberSub.notificationType === 'banned' ? (
            <>
              <span className="text-black"> was </span>
              <span className="text-black font-bold">
                {sData ? sData.memberSub.ban : ''}
              </span>
            </>
          ) : (
            <>
              <span className="text-black"> is </span>
              <span>{sData.memberSub.role}</span>
            </>
          )}
        </Notification>
      ) : undefined}
      <Header />
      <SideBar />
      <div className="mt-12 w-full relative">
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
