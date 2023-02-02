import { SetMetadata } from '@nestjs/common';
import { Role } from '../../project/entities/member.entity';

export const Roles = (...roles: Role[] | 'PROFILE'[]) =>
  SetMetadata('roles', roles);
