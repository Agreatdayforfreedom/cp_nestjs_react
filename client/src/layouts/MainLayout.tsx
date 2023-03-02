import { gql, useQuery, useSubscription } from '@apollo/client';
import { nanoid } from '@reduxjs/toolkit';
import { useEffect, useState } from 'react';
import { Link, Navigate, Outlet, useParams } from 'react-router-dom';
import { URLSearchParams } from 'url';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import Alert from '../components/Alert';
import Header from '../components/Header';
import InitSpinner from '../components/loaders/InitSpinner';
import SideBar from '../components/SideBar';
import { setState } from '../features/projectSlice';
import {
  FIND_REQUESTS,
  MEMBER_SUB,
  PROFILE,
  REFRESH_TOKEN,
  REQUEST_SUB,
  STATUS_REQUEST_SUB,
} from '../typedefs';

const MainLayout = () => {
  const params = useParams();

  const dispatch = useAppDispatch();
  const { alert } = useAppSelector((state) => state.projectSlice);

  const { data, loading, error } = useQuery(PROFILE, {
    fetchPolicy: 'network-only',
  });

  useSubscription(REQUEST_SUB, {
    variables: {
      userId: data?.profile.id,
      projectId: data?.profile.projectId || undefined,
    },
    onData({ client, data }) {
      if (data.data.requestSub.notificationType === 'requestProject') {
        client.cache.modify({
          fields: {
            findRequests(existing, { readField }) {
              console.log(existing);
              const newRequest = client.cache.writeFragment({
                data: data.data.requestSub,
                fragment: gql`
                  fragment NewRequest on RequestProject {
                    id
                    __typename
                  }
                `,
              });
              return [newRequest, ...existing];
            },
            findCount(existing) {
              dispatch(setState({ newRequest: true }));
              return existing + 1;
            },
          },
        });
      }
    },
  });

  if (loading) return <InitSpinner />;
  if (error) return <Navigate to="/login" />;
  return (
    <div className="flex min-h-screen min-w-screen">
      <div className="fixed top-0 h-auto right-0 left-0 w-fit mx-auto z-50">
        {alert && alert.length > 0
          ? alert.map((alert: string) => (
              <Alert key={nanoid()} content={alert} />
            ))
          : ''}
      </div>
      <Header />
      <div className="mt-12 w-full relative">
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
