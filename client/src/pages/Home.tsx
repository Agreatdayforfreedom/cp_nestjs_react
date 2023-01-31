import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import MyProjects from '../components/project/MyProjects';
import { ProjectList } from '../components/project/ProjectList';
import ProjectsMemberOf from './project/ProjectsMemberOf';

const Home = () => {
  return (
    <main className="w-full h-full">
      <Button tag="link" to="/project/new" name="New Project" />

      <section>
        <div>
          <span className="font-bold text-slate-500">Your projects</span>
          <MyProjects />
        </div>
        <div>
          <span className="font-bold text-slate-500">
            Projects you are member of
          </span>
          <ProjectsMemberOf />
        </div>
        <div>
          <span className="font-bold text-slate-500">Find a project!</span>
          <ProjectList />
        </div>
      </section>
    </main>
  );
};

export default Home;
