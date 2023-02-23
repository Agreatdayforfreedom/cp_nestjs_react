import { useMutation, useQuery } from '@apollo/client';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Project } from '../../interfaces/interfaces';
import { ALREADY_REQUESTED, REQUEST_PROJECT } from '../../typedefs';
import Button from '../Button';

interface ProjectProps {
  project: Project;
  canBeRequested?: boolean;
}

const ProjectCard = ({ project, canBeRequested = false }: ProjectProps) => {
  const [fetch] = useMutation(REQUEST_PROJECT);

  const { data, loading, error, refetch } = useQuery(ALREADY_REQUESTED, {
    variables: {
      projectId: project.id,
    },
  });
  const handleRequest = () => {
    fetch({
      variables: { projectId: project.id },
      onCompleted() {
        refetch();
      },
    });
  };

  return (
    <div className="flex items-center justify-between border-b border-slate-700 last:border-none hover:cursor-pointer hover:bg-[var(--medium-blue)] transition-colors">
      <div className="flex flex-col justify-center">
        <Link
          to={`/project/${project.id}/logic`}
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
      {canBeRequested ? (
        data?.alreadyRequested.id && !loading ? (
          <Button name="Pending" color="green" disabled={true} />
        ) : (
          <Button name="Request" color="blue" onClick={handleRequest} />
        )
      ) : undefined}
    </div>
  );
};

export default ProjectCard;
