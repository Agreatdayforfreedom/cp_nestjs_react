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

export const FIND_USERS = gql`
  query Query {
    findUsers {
      username
      email
      id
    }
  }
`;

export const ADD_MEMBER = gql`
  mutation Mutation($nextMemberId: Int!, $projectId: Int!) {
    addMember(nextMemberId: $nextMemberId, projectId: $projectId) {
      id
      role
      ban
      user {
        id
        username
        email
      }
    }
  }
`;

// export const MEMBER_BANNED = gql`
//   subscription Subscription {
//     banned {
//       id
//       ban
//     }
//   }
// `;

// export const ROLE_CHANGED = gql`
//   subscription Subscription {
//     roleChanged {
//       id
//       role
//     }
//   }
// `;

export const MEMBER_SUB = gql`
  subscription Subscription($userId: Int!, $projectId: Int!) {
    memberSub(userId: $userId, projectId: $projectId) {
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
      notificationType
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
      owner {
        id
      }
    }
  }
`;

export const FIND_PROJECTS_MEMBEROF = gql`
  query Query {
    findProjectsMemberOf {
      id
      title
      description
      status
      owner {
        id
      }
    }
  }
`;

export const FIND_MY_PROJECTS = gql`
  query Query {
    findMyProjects {
      id
      title
      description
      status
      owner {
        id
      }
    }
  }
`;

export const BAN_MEMBER = gql`
  mutation Mutation(
    $memberWhoBanId: Int!
    $memberToBanId: Int!
    $banType: String!
  ) {
    banMember(
      memberWhoBanId: $memberWhoBanId
      memberToBanId: $memberToBanId
      banType: $banType
    ) {
      id
      ban
    }
  }
`;

export const CHANGE_ROLE_MEMBER = gql`
  mutation Mutation($memberId: Int!, $roleType: String!) {
    changeMemberRole(memberId: $memberId, roleType: $roleType) {
      id
      role
    }
  }
`;

export const FIND_AUTH_MEMBER = gql`
  query Query($projectId: Int!) {
    findAuthMember(projectId: $projectId) {
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
    removeMember(memberId: $memberId, projectId: $projectId) {
      id
      notificationType
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
      projectId
      currentProjectMember {
        id
        ban
        role
      }
    }
  }
`;

export const REFRESH_TOKEN = gql`
  query Query($projectId: Int!, $id: Int!) {
    refreshToken(projectId: $projectId, id: $id) {
      user {
        id
      }
      token
    }
  }
`;
