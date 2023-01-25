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
    }
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
