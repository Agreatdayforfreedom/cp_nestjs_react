import { useLazyQuery, useQuery } from '@apollo/client';
import { useEffect } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import InitSpinner from '../../components/loaders/InitSpinner';
import { PROFILE, REFRESH_TOKEN } from '../../typedefs';

const Logic = () => {
  const params = useParams();

  const { data, loading, error } = useQuery(PROFILE, {
    fetchPolicy: 'network-only',
  });

  const [refreshToken, { data: rtData, loading: rtLoading, error: rtError }] =
    useLazyQuery(REFRESH_TOKEN, {
      fetchPolicy: 'network-only',
    });
  useEffect(() => {
    if (data) {
      refreshToken({
        variables: {
          id: data.profile.id,
          projectId: (params.id && parseInt(params.id, 10)) || 0,
        },
      });
    }
  }, [data]);
  const navigate = useNavigate();
  useEffect(() => {
    if (rtData) {
      localStorage.setItem('token', rtData.refreshToken.token);
      window.dispatchEvent(new Event('storage'));
      return navigate('dashboard');
    }
  }, [rtData]);

  if (loading) return <InitSpinner />;
  if (error) return <Navigate to="/" />;
  return <InitSpinner />;
};

export default Logic;
