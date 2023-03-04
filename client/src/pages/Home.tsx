import Button from '../components/Button';
import MyProjects from '../components/project/MyProjects';
import { ProjectList } from '../components/project/ProjectList';
import { SearchBar } from '../components/SearchBar';
import ProjectsMemberOf from './project/ProjectsMemberOf';

const Home = () => {
  return (
    <main className="w-full h-full">
      <Button tag="link" to="/project/new" name="New Project" />

      <section>
        <div>
          <h2 className="font-bold text-slate-500">Your projects</h2>
          <MyProjects />
        </div>
        <div>
          <h2 className="font-bold text-slate-500">
            Projects you are member of
          </h2>
          <ProjectsMemberOf />
        </div>
        <div>
          {/* <h2 className="font-bold text-slate-500">Find a project!</h2> */}
          <ProjectList />
        </div>
      </section>
    </main>
  );
};

export default Home;
