import { SetMetadata } from '@nestjs/common';

export const SkipAuth = () => SetMetadata('SkipAuth', true);
