import { useQuery } from '@apollo/client';
import { nanoid } from '@reduxjs/toolkit';
import React, { useState } from 'react';
import ShineCard from '../../components/loaders/ShineCard';
import ProjectCard from '../../components/project/ProjectCard';
import { Project } from '../../interfaces/interfaces';
import { FIND_PROJECTS_MEMBEROF } from '../../typedefs';

const ProjectsMemberOf = () => {
  const { data, loading, error } = useQuery(FIND_PROJECTS_MEMBEROF);

  if (loading) return <ShineCard />;
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
