import { Link } from 'react-router-dom';
import { Project } from '../../interfaces/interfaces';

interface ProjectProps {
  project: Project;
}

const ProjectCard = ({ project }: ProjectProps) => {
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
    </div>
  );
};

export default ProjectCard;
