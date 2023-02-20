import { Ban, IssueStatus, Role } from './enums';

export interface Member {
  id: number;
  user: User;
  project: Project;
  role: Role;
  ban: Ban;
}

export interface User {
  id: number;
  avatar: string;
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

export interface Issue {
  id: number;
  title: string;
  description: string;
  labels: Label[];
  issueLabels: Label[];
  issueStatus: IssueStatus;
  owner: Member;
  project: Project;
  created_at: Date;
  updated_at: Date;
}

export interface Label {
  id: number;
  labelName: string;
  color: string;
}

export interface Comment {
  id: number;
  content: string;
  owner: Member;
  issue: Issue;
  created_at: Date;
  updated_at: Date;
}
