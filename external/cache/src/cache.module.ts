import { Module } from '@nestjs/common';
import { CacheService } from './cache.service';
import { CACHE_REPOSITORY_TOKEN } from './cache-repository.interface';

@Module({
  providers: [
    CacheService,
    {
      provide: CACHE_REPOSITORY_TOKEN,
      useClass: CacheService,
    },
  ],
  exports: [CACHE_REPOSITORY_TOKEN, CacheService],
})
export class CacheModule {}
