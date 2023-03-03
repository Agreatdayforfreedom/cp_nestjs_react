import { useQuery } from '@apollo/client';
import { nanoid } from '@reduxjs/toolkit';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ShineCard from '../../components/loaders/ShineCard';
import ProjectCard from '../../components/project/ProjectCard';
import { Project } from '../../interfaces/interfaces';
import { FIND_PROJECTS_MEMBEROF } from '../../typedefs';

const ProjectsMemberOf = () => {
  const { data, loading, error } = useQuery(FIND_PROJECTS_MEMBEROF);

  if (loading) return <ShineCard />;
  if (data?.findProjectsMemberOf.length === 0 || !data)
    return (
      <div className="my-5 flex items-center justify-center">
        <h2 className="text-xl text-slate-400">
          You are not a member of any project yet.
          <span className="px-1 text-blue-300">Find one!</span>
        </h2>
      </div>
    );
  return (
    <div className="w-[95%] mx-auto border border-slate-700 bg-[var(--t-blue)] ">
      {data &&
        data.findProjectsMemberOf.map((project: Project) => (
          <ProjectCard key={nanoid()} project={project} />
        ))}
    </div>
  );
};

export default ProjectsMemberOf;
