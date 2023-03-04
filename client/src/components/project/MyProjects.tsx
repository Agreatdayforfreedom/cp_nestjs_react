import { useQuery } from '@apollo/client';
import { nanoid } from '@reduxjs/toolkit';
import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Project } from '../../interfaces/interfaces';
import { FIND_MY_PROJECTS } from '../../typedefs';
import InitSpinner from '../loaders/InitSpinner';
import ShineCard from '../loaders/ShineCard';
import ProjectCard from './ProjectCard';

const MyProjects = () => {
  const { data, loading, error } = useQuery(FIND_MY_PROJECTS);

  if (loading) return <ShineCard len={2} />;
  if (data?.findMyProjects.length === 0)
    return (
      <div className="my-5 flex items-center justify-center">
        <h2 className="text-xl text-slate-400">
          You have not created any project yet.
          <span>
            <Link
              to="project/new"
              className="px-1 text-blue-300 hover:underline"
            >
              Go and create one!
            </Link>
          </span>
        </h2>
      </div>
    );
  return (
    <div className="w-[95%] mx-auto border border-slate-700 bg-[var(--t-blue)] ">
      {data &&
        data.findMyProjects.map((project: Project) => (
          <ProjectCard key={nanoid()} project={project} />
        ))}
    </div>
  );
};

export default MyProjects;
