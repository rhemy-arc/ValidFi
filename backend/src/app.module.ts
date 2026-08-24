import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';
import { redisStore } from 'cache-manager-redis-store';
import { AppConfigModule } from './config/config.module';
import { TypedConfigService } from './config/config.service';
import { EnvironmentVariables } from './config/env.validation';
import { IdentityModule } from './identity/identity.module';
import { VerificationModule } from './verification/verification.module';
import { AccessControlModule } from './access-control/access-control.module';
import { DataSharingModule } from './data-sharing/data-sharing.module';
import { AuthModule } from './auth/auth.module';
import { IpfsModule } from './ipfs/ipfs.module';
import { AiModule } from './ai/ai.module';
import { SorobanModule } from './soroban/soroban.module';
import { IndexerModule } from './indexer/indexer.module';
import { HealthModule } from './health/health.module';
import { AuditModule } from './audit/audit.module';
import { BackupModule } from './backup/backup.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { PermissionsModule } from './permissions/permissions.module';
import { CredentialVersioningModule } from './credential-versioning/credential-versioning.module';
import { CredentialsModule } from './credentials/credentials.module';
import { CredentialEventsModule } from './credentials/credential-events.module';
import { HealthAuthorityModule } from './health-authority/health-authority.module';
import { CredentialSharingHistoryModule } from './credential-sharing-history/credential-sharing-history.module';
import { CredentialExportModule } from './credential-export/credential-export.module';
import { LoggerModule } from './common/logger/logger.module';
import { RequestContextMiddleware } from './common/logger/logger.middleware';

@Module({
  imports: [
    AppConfigModule,
    LoggerModule,
    TypeOrmModule.forRootAsync({
      imports: [AppConfigModule],
      useFactory: (configService: ConfigService<EnvironmentVariables, true>) => ({
        type: 'postgres',
        host: configService.get('DB_HOST', { infer: true }),
        port: configService.get('DB_PORT', { infer: true }),
        username: configService.get('DB_USERNAME', { infer: true }),
        password: configService.get('DB_PASSWORD', { infer: true }),
        database: configService.get('DB_DATABASE', { infer: true }),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: configService.get('NODE_ENV', { infer: true }) === 'development',
        logging: configService.get('NODE_ENV', { infer: true }) === 'development',
      }),
      inject: [ConfigService],
    }),
    ThrottlerModule.forRootAsync({
      imports: [AppConfigModule],
      useFactory: (configService: ConfigService<EnvironmentVariables, true>) => [
        {
          ttl: configService.get('THROTTLE_TTL', { infer: true }),
          limit: configService.get('THROTTLE_LIMIT', { infer: true }),
        },
      ],
      inject: [ConfigService],
    }),
    CacheModule.registerAsync({
      imports: [AppConfigModule],
      // @ts-ignore
      useFactory: (configService: ConfigService<EnvironmentVariables, true>) => ({
        store: redisStore,
        host: configService.get('REDIS_HOST', { infer: true }),
        port: configService.get('REDIS_PORT', { infer: true }),
        password: configService.get('REDIS_PASSWORD', { infer: true }),
        ttl: 3600,
      }),
      inject: [ConfigService],
    }),
    IdentityModule,
    VerificationModule,
    AccessControlModule,
    DataSharingModule,
    AuthModule,
    IpfsModule,
    AiModule,
    SorobanModule,
    IndexerModule,
    HealthModule,
    AuditModule,
    BackupModule,
    AnalyticsModule,
    PermissionsModule,
    CredentialVersioningModule,
    CredentialsModule,
    CredentialEventsModule,
    HealthAuthorityModule,
    CredentialSharingHistoryModule,
    CredentialExportModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestContextMiddleware).forRoutes('*');
  }
}
