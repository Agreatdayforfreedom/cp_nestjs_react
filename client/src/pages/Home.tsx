import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import { ProjectList } from '../components/project/ProjectList';

const Home = () => {
  return (
    <main className="w-full h-full">
      <Button tag="link" to="/project/new" name="New Project" />

      <section>
        <ProjectList />
      </section>
    </main>
  );
};

export default Home;
