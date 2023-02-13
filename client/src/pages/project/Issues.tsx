import { useQuery } from '@apollo/client';
import React, { useEffect } from 'react';
import { PROFILE } from '../../typedefs';

const Issues = () => {
  const {
    data,
    loading: pLoading,
    error: pError,
  } = useQuery(PROFILE, {
    fetchPolicy: 'network-only',
  });
  // useEffect(() => {
  //   console.log(data);
  // }, [data]);
  return <div>Issues</div>;
};

export default Issues;
