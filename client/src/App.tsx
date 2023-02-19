import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
  useNavigate,
} from 'react-router-dom';
import AuthLayout from './layouts/AuthLayout';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import NewProject from './pages/project/NewProject';
import Project from './pages/project/Project';
import Dashboard from './pages/project/Dashboard';
import Members from './pages/project/Members';
import Issues from './pages/project/Issues';
import Config from './pages/project/Config';
import Search from './pages/project/Search';
import Logic from './pages/project/Logic';
import NewIssue from './pages/project/NewIssue';
import Issue from './pages/project/Issue';
import EditIssue from './pages/project/EditIssue';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="project">
            <Route path="new" element={<NewProject />} />
            <Route path=":id" element={<Project />}>
              <Route path="logic" element={<Logic />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="issues" element={<Outlet />}>
                <Route index element={<Issues />} />
                <Route path="new" element={<NewIssue />} />
                <Route path=":issueId" element={<Issue />} />
                <Route path=":issueId/edit" element={<EditIssue />} />
              </Route>
              <Route path="search" element={<Search />} />
              <Route path="members" element={<Members />} />
              <Route path="config" element={<Config />} />
              <Route path="*" element={<Navigate to="dashboard" />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
