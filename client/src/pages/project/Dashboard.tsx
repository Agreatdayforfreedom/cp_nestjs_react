import { useQuery } from '@apollo/client';
import React from 'react';
import { useParams } from 'react-router-dom';
import { FIND_PROJECT } from '../../typedefs';

const Dashboard = () => {
  const params = useParams();

  const { data, loading, error } = useQuery(FIND_PROJECT, {
    variables: {
      id: params.id && parseInt(params.id, 10),
    },
  });

  if (loading) return <span>loading</span>;
  if (error) return <span>errrr</span>;
  // if (!data) return <span>nodata</span>;
  console.log(data);
  return (
    <section>
      <h1 className="text-3xl px-2 m-5">{data.findOneProject.title}</h1>

      <span>{JSON.stringify(data.findOneProject.status)}</span>

      <div className=" z-0">
        <h1 className="border-y border-slate-700 p-3 bg-[var(--dark-blue)] brightness-75">
          {data.findOneProject.description}
        </h1>
      </div>
    </section>
  );
};

export default Dashboard;
