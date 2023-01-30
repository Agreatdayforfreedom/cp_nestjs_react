import { Ban, Role } from './enums';

export interface Member {
  id: number;
  user: User;
  project: Project;
  role: Role;
  ban: Ban;
}

export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  totalMembers: number;
  owner: User;
  status: boolean; //todo change to enum
}
