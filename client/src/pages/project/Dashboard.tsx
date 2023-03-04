import { useQuery } from '@apollo/client';
import { Navigate, useParams } from 'react-router-dom';
import Spinner from '../../components/loaders/Spinner';
import { FIND_PROJECT, PROFILE } from '../../typedefs';

const Dashboard = () => {
  const params = useParams();

  const {
    data: pData,
    loading: pLoading,
    error: pError,
  } = useQuery(PROFILE, {
    fetchPolicy: 'network-only',
  });

  const { data, loading, error } = useQuery(FIND_PROJECT, {
    fetchPolicy: 'network-only',
    variables: {
      id: params.id && parseInt(params.id, 10),
    },
  });

  if (loading || pLoading) return <Spinner />;
  if (error) return <Navigate to="/" />;
  return (
    <section>
      <p className="animate-pulse text-slate-600">
        (informative text) I don't know what to do here{' '}
      </p>
      <h1 className="text-3xl px-2 m-5">{data?.findOneProject.title}</h1>

      <div className=" z-0">
        <h1 className="border-y border-slate-700 p-3 bg-[var(--dark-blue)] brightness-75">
          {data?.findOneProject.description}
        </h1>
      </div>
    </section>
  );
};

export default Dashboard;
