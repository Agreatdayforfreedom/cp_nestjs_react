import { SetMetadata } from '@nestjs/common';
import { Ban } from '../../interfaces/enums';

export const Bans = (...bans: Ban[]) => SetMetadata('bans', bans);
