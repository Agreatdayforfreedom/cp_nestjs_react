import { gql } from '@apollo/client';

export const SIGN_UP = gql`
  mutation Mutation($username: String!, $email: String!, $password: String!) {
    signup(username: $username, email: $email, password: $password) {
      user {
        id
      }
      token
    }
  }
`;

export const LOGIN = gql`
  mutation Mutation($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      user {
        id
      }
      token
    }
  }
`;

export const FIND_PROJECT_BY_PAGE = gql`
  query Query($limit: Int, $offset: Int!) {
    findProjectByPage(limit: $limit, offset: $offset) {
      projects {
        id
        title
        description
        status
      }
      endIndex
    }
  }
`;

export const FIND_PROJECT = gql`
  query Query($id: Int!) {
    findOneProject(id: $id) {
      id
      title
      description
      status
      members {
        id
        username
        email
      }
    }
  }
`;

export const FIND_MEMBERS = gql`
  query Query($projectId: Int!) {
    findMembers(projectId: $projectId) {
      id
      role
      ban
      project {
        id
        membersTotal
      }
      user {
        id
        username
        email
      }
    }
  }
`;

export const REMOVE_MEMBER = gql`
  mutation Mutation($memberId: Int!, $projectId: Int!) {
    removeMember(memberId: $memberId, projectId: $projectId)
  }
`;

export const NEW_PROJECT = gql`
  mutation Mutation($title: String!, $description: String!) {
    createProject(title: $title, description: $description) {
      id
      title
      owner {
        id
        username
      }
    }
  }
`;

export const PROFILE = gql`
  query Query {
    profile {
      username
      email
      id
    }
  }
`;
