import { gql, useLazyQuery, useQuery } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useNavigate, useParams } from 'react-router-dom';
import Header from '../components/Header';
import InitSpinner from '../components/loaders/InitSpinner';
import SideBar from '../components/SideBar';
import { PROFILE, REFRESH_TOKEN } from '../typedefs';

const MainLayout = () => {
  const params = useParams();

  //! first **
  /*
   *query the profile data,
   *if there's no data,
   *redirect to login.
   */
  const { data, loading, error, refetch } = useQuery(PROFILE, {
    fetchPolicy: 'network-only',
  });

  const [refreshToken, { data: rtData, loading: rtLoading, error: rtError }] =
    useLazyQuery(REFRESH_TOKEN, {
      fetchPolicy: 'network-only',
    });

  useEffect(() => {
    if (data) {
      //!second **
      /*
       *id data is true,
       *then refresh the token
       *sending the projectId and userId
       *every time params changes */
      refreshToken({
        variables: {
          id: data && data.profile.id,
          projectId: (params.id && parseInt(params.id, 10)) || 0,
        },
      });
    }
  }, [data, params]);
  useEffect(() => {
    //!third **
    /*
     *refech for the profile data
     * but now with projectId and
     * currentProjectMember if there is any.
     */
    if (rtData) {
      localStorage.setItem('token', rtData.refreshToken.token);
      refetch();
    }
  }, [rtData]);

  if (loading) return <InitSpinner />;
  if (error) return <Navigate to="/login" />;
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
