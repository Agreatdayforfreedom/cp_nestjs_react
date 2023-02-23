import { gql, useQuery, useSubscription } from '@apollo/client';
import { useEffect, useState } from 'react';
import { Link, Navigate, Outlet, useParams } from 'react-router-dom';
import { URLSearchParams } from 'url';
import { useAppDispatch } from '../app/hooks';
import Header from '../components/Header';
import InitSpinner from '../components/loaders/InitSpinner';
import Notification from '../components/Notification';
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
      } else {
        alert(
          `You have been ${data.data.requestSub.requestStatus} from ${data.data.requestSub.project.title}`,
        );
      }
    },
  });
  // if (srData) console.log(srData);

  //todo: improve notification and do something else.
  if (loading) return <InitSpinner />;
  if (error) return <Navigate to="/login" />;
  return (
    <div className="flex min-h-screen min-w-screen">
      <Header />
      <div className="mt-12 w-full relative">
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
