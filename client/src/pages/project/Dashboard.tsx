import { useLazyQuery, useQuery, useSubscription } from '@apollo/client';
import React, { useEffect, useLayoutEffect } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import InitSpinner from '../../components/loaders/InitSpinner';
import Spinner from '../../components/loaders/Spinner';
import { FIND_PROJECT, MEMBER_SUB, PROFILE } from '../../typedefs';

const Dashboard = () => {
  const params = useParams();

  const {
    data: pData,
    loading: pLoading,
    error: pError,
  } = useQuery(PROFILE, {
    fetchPolicy: 'network-only',
  });
  // useEffect(() => {
  //   queryProfile();
  // }, []);

  const { data, loading, error } = useQuery(FIND_PROJECT, {
    fetchPolicy: 'network-only',
    variables: {
      id: params.id && parseInt(params.id, 10),
    },
  });

  // useEffect(() => {
  //   fetch();
  // }, []);
  // if (pData && pData.profile.projectId === 0) {
  //   console.log('puto');
  // }
  // console.log(pData);
  if (loading || pLoading) return <Spinner />;
  if (error) return <Navigate to="/" />;
  // if (!data) return <span>nodata</span>;
  return (
    <section>
      <p>{pData && pData.profile.projectId}</p>
      <h1 className="text-3xl px-2 m-5">{data?.findOneProject.title}</h1>
      <span>{JSON.stringify(data?.findOneProject.status)}</span>

      <div className=" z-0">
        <h1 className="border-y border-slate-700 p-3 bg-[var(--dark-blue)] brightness-75">
          {data?.findOneProject.description}
        </h1>
      </div>
    </section>
  );
};

export default Dashboard;
