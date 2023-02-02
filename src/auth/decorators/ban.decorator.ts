import { SetMetadata } from '@nestjs/common';
import { Ban } from '../../project/entities/member.entity';

export const Bans = (...bans: Ban[]) => SetMetadata('bans', bans);
