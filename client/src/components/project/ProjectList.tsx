import { useLazyQuery, useQuery } from '@apollo/client';
import { nanoid } from '@reduxjs/toolkit';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useSearchParams } from 'react-router-dom';
import { Project } from '../../interfaces/interfaces';
import { FIND_PROJECT_BY_PAGE } from '../../typedefs';
import ShineCard from '../loaders/ShineCard';
import Pagination from '../Pagination';
import { SearchBar } from '../SearchBar';
import ProjectCard from './ProjectCard';

export const ProjectList = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [limit, setLimit] = useState(5);
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get('page') || '1'),
  );
  const { data, loading, error, refetch } = useQuery(FIND_PROJECT_BY_PAGE);

  useEffect(() => {
    if (
      currentPage === 0 ||
      currentPage ===
        Math.ceil(data && data.findProjectByPage.endIndex / limit - 1)
    ) {
      return;
    }
    refetch({
      limit,
      offset: limit * (currentPage - 1),
    });
    searchParams.set('page', currentPage.toString());
    setSearchParams(searchParams);
  }, [currentPage]);
  if (loading) return <ShineCard />;
  return (
    <div>
      <SearchBar label="Find a project" refetch={refetch} />

      <div className="w-[95%] mx-auto border border-slate-700 bg-[var(--t-blue)] ">
        {data?.findProjectByPage.projects.length > 0 ? (
          data.findProjectByPage.projects.map((project: Project) => (
            <ProjectCard
              key={nanoid()}
              canBeRequested={true}
              project={project}
            />
          ))
        ) : (
          <p className="text-xl text-center">This is empty</p>
        )}
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
