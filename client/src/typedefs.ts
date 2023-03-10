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
      avatar
      id
    }
  }
`;

export const SEARCH_USERS = gql`
  query Query($searchValue: String) {
    searchUsers(searchValue: $searchValue) {
      users {
        username
        email
        avatar
        id
      }
      count
    }
  }
`;

export const FIND_ISSUES = gql`
  query Query($projectId: Int!) {
    findIssues(projectId: $projectId) {
      id
      title
      description
      labels {
        id
        color
        labelName
      }
      issueStatus
    }
  }
`;

export const FIND_ISSUE = gql`
  query Query($issueId: Int!) {
    findIssue(issueId: $issueId) {
      id
      title
      description
      labels {
        id
        color
        labelName
      }
      owner {
        id
      }
      issueStatus
      created_at
      closed_at
      updated_at
    }
  }
`;

export const NEW_ISSUE = gql`
  mutation Mutation($title: String!, $description: String!, $projectId: Int!) {
    newIssue(title: $title, description: $description, projectId: $projectId) {
      title
      updated_at
      issueStatus
      labels {
        id
      }
      id
      description
      created_at
    }
  }
`;

export const UPDATE_ISSUE = gql`
  mutation Mutation($title: String!, $description: String!, $id: Int!) {
    updateIssue(title: $title, description: $description, id: $id) {
      title
      updated_at
      labels {
        id
      }
      id
      description
      created_at
    }
  }
`;

export const CLOSE_ISSUE = gql`
  mutation Mutation($issueId: Int!) {
    closeIssue(issueId: $issueId) {
      id
      closed_at
      issueStatus
    }
  }
`;

export const FIND_COMMENTS = gql`
  query Query($issueId: Int!) {
    findComments(issueId: $issueId) {
      id
      content
      minimized
      created_at
      updated_at
      owner {
        id
        user {
          avatar
          username
        }
      }
    }
  }
`;

export const NEW_COMMENT = gql`
  mutation Matation($issueId: Int!, $content: String!) {
    newComment(issueId: $issueId, content: $content) {
      id
      content
      created_at
      updated_at
    }
  }
`;

export const EDIT_COMMENT = gql`
  mutation Mutation($commentId: Int!, $content: String!) {
    updateComment(commentId: $commentId, content: $content) {
      id
      content
      created_at
      updated_at
    }
  }
`;

export const DELETE_COMMENT = gql`
  mutation Mutation($commentId: Int!) {
    deleteComment(commentId: $commentId) {
      id
    }
  }
`;

export const MINIMIZE_COMMENT = gql`
  mutation Mutation($commentId: Int!, $minimized: Boolean!) {
    minimizeComment(commentId: $commentId, minimized: $minimized) {
      id
      minimized
    }
  }
`;

export const FIND_LABELS = gql`
  query Query($issueId: Int!) {
    getLabels(issueId: $issueId) {
      labelName
      id
      color
    }
  }
`;

export const NEW_LABEL = gql`
  mutation Mutation($issueId: Int!, $labelName: String!, $color: String!) {
    newLabel(issueId: $issueId, labelName: $labelName, color: $color) {
      labelName
      id
      color
      issue {
        id
      }
    }
  }
`;

export const QUIT_LABEL = gql`
  mutation Mutation($labelId: Int!) {
    quitLabel(labelId: $labelId) {
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

export const COMMENT_SUB = gql`
  subscription Subscription {
    commentSub {
      id
      content
      owner {
        id
        user {
          id
          username
          avatar
        }
      }
      created_at
      updated_at
    }
  }
`;

export const FIND_PROJECT_BY_PAGE = gql`
  query Query($limit: Int, $offset: Int!, $searchValue: String) {
    findProjectByPage(
      limit: $limit
      offset: $offset
      searchValue: $searchValue
    ) {
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

export const DELETE_PROJECT = gql`
  mutation Mutation($projectId: Int!, $validateName: String!) {
    deleteProject(projectId: $projectId, validateName: $validateName)
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
        avatar
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

export const FIND_REQUESTS = gql`
  query Query($projectId: Int!) {
    findRequests(projectId: $projectId) {
      id
      requestStatus
      user {
        id
        username
        avatar
      }
      project {
        id
      }
    }
  }
`;

export const FIND_REQUESTS_COUNT = gql`
  query Query($projectId: Int!) {
    findCount(projectId: $projectId)
  }
`;

export const REQUEST_PROJECT = gql`
  mutation Mutation($projectId: Int!) {
    requestProject(projectId: $projectId) {
      id
      requestStatus
    }
  }
`;

export const ACTION_REQUEST = gql`
  mutation Mutation($requestId: Int!, $status: RequestStatus!) {
    acceptOrRejectRequest(requestId: $requestId, status: $status) {
      id
      requestStatus
    }
  }
`;

export const ALREADY_REQUESTED = gql`
  query Query($projectId: Int!) {
    alreadyRequested(projectId: $projectId) {
      id
    }
  }
`;

export const REQUEST_SUB = gql`
  subscription Subscription($userId: Int!, $projectId: Int) {
    requestSub(userId: $userId, projectId: $projectId) {
      id
      requestStatus
      user {
        id
        username
        avatar
      }
      project {
        id
      }
      notificationType
    }
  }
`;

export const STATUS_REQUEST_SUB = gql`
  subscription Subscription {
    statusRequestSub {
      id
      requestStatus
      user {
        id
        username
        avatar
      }
      project {
        id
      }
    }
  }
`;

export const FIND_NOTIFICATIONS = gql`
  query Query {
    findNotifications {
      id
      data
      type
      read
      created_at
      user {
        id
      }
    }
  }
`;

export const MARK_AS_READ = gql`
  mutation Mutation($notificationId: Int!) {
    markAsRead(notificationId: $notificationId) {
      id
      read
    }
  }
`;

export const MARK_ALL_AS_READ = gql`
  mutation Mutation {
    markAllAsRead
  }
`;

export const NOTIFICATION_SUB = gql`
  subscription Subscription($userId: Int!) {
    notificationSub(userId: $userId) {
      id
      data
      type
      read
      user {
        id
      }
    }
  }
`;
