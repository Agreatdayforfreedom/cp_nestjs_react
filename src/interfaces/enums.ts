// import {} from

export enum Role {
  /**
   * @member PROFILE member is to determine if the guard is accessing from the profile role */
  PROFILE = 'PROFILE',
  ADMIN = 'ADMIN',
  MODERATOR = 'MODERATOR',
  MEMBER = 'MEMBER',
}

export enum Ban {
  PROFILE = 'PROFILE',
  UNBANNED = 'UNBANNED',
  PARTIAL_BAN = 'PARTIAL_BAN',
  BANNED = 'BANNED',
}

/**
 * this enum is used for attach with the specific subscripion issued
 */
export enum NotificationType {
  BANNED = 'BANNED',
  PARTIAL_BAN = 'PARTIAL_BAN',
  UNBANNED = 'UNBANNED',
  ROLE_CHANGED = 'ROLE_CHANGED',
  MEMBER_ADDED = 'MEMBER_ADDED',
  MEMBER_REMOVED = 'MEMBER_REMOVED',
}

export enum IssueStatus {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
}

export enum RequestStatus {
  PENDING = 'PENDING',
  REJECTED = 'REJECTED',
  ACCEPTED = 'ACCEPTED',
}

/**
 * this enum is used in the type column of the Notification entity.
 */
//adopted child by the enum family
export type Notification_Type =
  | {}
  | Exclude<Ban, Ban.PROFILE>
  | Exclude<Role, Role.PROFILE>
  | Exclude<RequestStatus, RequestStatus.PENDING>
  | IssueStatus;
export const Notification_Enum = {
  ...Ban,
  ...Role,
  ...RequestStatus,
  ...IssueStatus,
};
