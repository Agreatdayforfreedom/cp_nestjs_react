import { gql, useQuery } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import InitSpinner from '../components/loaders/InitSpinner';
import SideBar from '../components/SideBar';
import { PROFILE } from '../typedefs';

const MainLayout = () => {
  const { data, loading, error } = useQuery(PROFILE, {
    fetchPolicy: 'network-only',
  });

  if (error?.message === 'Unauthorized') return <Navigate to="/login" />;
  if (loading) return <InitSpinner />;
  return (
    <div className="flex min-h-screen min-w-screen">
      <Header data={data} />
      <SideBar data={data} />

      <div className="mt-12 w-full">
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
