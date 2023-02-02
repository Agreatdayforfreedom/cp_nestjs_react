import { useQuery } from '@apollo/client';
import { nanoid } from '@reduxjs/toolkit';
import React from 'react';
import { Navigate } from 'react-router-dom';
import { Project } from '../../interfaces/interfaces';
import { FIND_MY_PROJECTS } from '../../typedefs';
import InitSpinner from '../loaders/InitSpinner';
import ShineCard from '../loaders/ShineCard';
import ProjectCard from './ProjectCard';

const MyProjects = () => {
  const { data, loading, error } = useQuery(FIND_MY_PROJECTS);

  if (loading) return <ShineCard len={2} />;
  if (error) return <Navigate to="/" />;
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
