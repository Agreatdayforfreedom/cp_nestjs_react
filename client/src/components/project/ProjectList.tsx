import { useLazyQuery, useQuery } from '@apollo/client';
import { nanoid } from '@reduxjs/toolkit';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FIND_PROJECT_BY_PAGE } from '../../typedefs';
import ShineCard from '../loaders/ShineCard';
import Pagination from '../Pagination';

interface ProjectProps {
  project: any;
}

export const ProjectList = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [limit, setLimit] = useState(5);
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get('page') || '1'),
  );
  const [query, { data, loading, error }] = useLazyQuery(FIND_PROJECT_BY_PAGE);

  useEffect(() => {
    if (
      currentPage === 0 ||
      currentPage === Math.ceil(data && data.findProjectByPage.endIndex / limit)
    ) {
      return;
    }
    query({
      variables: {
        limit,
        offset: limit * (currentPage - 1),
      },
    });
    searchParams.set('page', currentPage.toString());
    setSearchParams(searchParams);
  }, [currentPage]);

  if (loading) return <ShineCard />;
  if (error) return <span>error</span>;
  return (
    <div>
      <div className="w-[95%] mx-auto border border-slate-700 bg-[var(--t-blue)] ">
        {data &&
          data.findProjectByPage.projects.map((project: any) => (
            <ProjectCard key={nanoid()} project={project} />
          ))}
      </div>
      <Pagination
        currentPage={currentPage}
        totalCount={data && data.findProjectByPage.endIndex}
        limit={limit}
        onPageChange={(page: number) => setCurrentPage(page)}
      />
    </div>
  );
};

//todo: maybe experiment with subscriptios
const ProjectCard = ({ project }: ProjectProps) => {
  console.log(project.id);
  return (
    <div className="flex items-center justify-between border-b border-slate-700 last:border-none hover:cursor-pointer hover:bg-[var(--medium-blue)] transition-colors">
      <div className="flex flex-col justify-center">
        <Link
          to={`/project/${project.id}/dashboard`}
          className="
          text-slate-400
          font-semibold 
          p-3 hover:text-slate-500
          hover:underline
          "
        >
          {project.title}
        </Link>
        <p
          className={`font-semibold px-3 ${
            project.status ? 'text-green-600' : 'text-red-800'
          }`}
        >
          {project.status.toString()}
        </p>
      </div>
      <p className="px-2 text-slate-500 w-1/3 overflow-clip overflow-ellipsis">
        {project.description}
      </p>
    </div>
  );
};
