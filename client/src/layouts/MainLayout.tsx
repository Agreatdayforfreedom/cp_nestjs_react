import { gql, useLazyQuery, useQuery } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useNavigate, useParams } from 'react-router-dom';
import Header from '../components/Header';
import InitSpinner from '../components/loaders/InitSpinner';
import SideBar from '../components/SideBar';
import { PROFILE, REFRESH_TOKEN } from '../typedefs';

const MainLayout = () => {
  const params = useParams();

  const [fetch, { data: profileData, loading: loadingData, error: errorData }] =
    useLazyQuery(PROFILE, {
      fetchPolicy: 'network-only',
    });

  const { data, loading, error } = useQuery(REFRESH_TOKEN, {
    fetchPolicy: 'network-only',
    variables: {
      projectId: (params.id && parseInt(params.id, 10)) || 0,
    },
  });

  useEffect(() => {
    if (data) {
      localStorage.setItem('token', data.refreshToken.token);
      fetch();
    }
  }, [data]);

  if (loading) return <InitSpinner />;
  if (error || errorData) return <span>error</span>;
  return (
    <div className="flex min-h-screen min-w-screen">
      <Header />
      <SideBar />
      <div className="mt-12 w-full relative">
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
