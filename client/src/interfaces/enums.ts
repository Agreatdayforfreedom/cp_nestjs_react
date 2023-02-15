export enum Role {
  ADMIN = 'ADMIN',
  MODERATOR = 'MODERATOR',
  MEMBER = 'MEMBER',
}

export enum Ban {
  UNBANNED = 'UNBANNED',
  PARTIAL_BAN = 'PARTIAL_BAN',
  BANNED = 'BANNED',
}

export enum NotificationType {
  BANNED = 'BANNED',
  ROLE_CHANGED = 'ROLE_CHANGED',
  MEMBER_ADDED = 'MEMBER_ADDED',
  MEMBER_REMOVED = 'MEMBER_REMOVED',
}

export enum IssueStatus {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
}
