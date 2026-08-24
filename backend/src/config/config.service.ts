import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from './env.validation';

@Injectable()
export class TypedConfigService {
  constructor(private readonly configService: ConfigService<EnvironmentVariables, true>) {}

  get<K extends keyof EnvironmentVariables>(key: K): EnvironmentVariables[K] {
    return this.configService.get(key, { infer: true });
  }

  // Application
  get nodeEnv(): string {
    return this.get('NODE_ENV');
  }

  get port(): number {
    return this.get('PORT');
  }

  get apiPrefix(): string {
    return this.get('API_PREFIX');
  }

  get isDevelopment(): boolean {
    return this.nodeEnv === 'development';
  }

  get isProduction(): boolean {
    return this.nodeEnv === 'production';
  }

  // Database
  get dbHost(): string {
    return this.get('DB_HOST');
  }

  get dbPort(): number {
    return this.get('DB_PORT');
  }

  get dbUsername(): string {
    return this.get('DB_USERNAME');
  }

  get dbPassword(): string {
    return this.get('DB_PASSWORD');
  }

  get dbDatabase(): string {
    return this.get('DB_DATABASE');
  }

  // Redis
  get redisHost(): string {
    return this.get('REDIS_HOST');
  }

  get redisPort(): number {
    return this.get('REDIS_PORT');
  }

  get redisPassword(): string | undefined {
    return this.get('REDIS_PASSWORD');
  }

  // Stellar
  get sorobanNetworkUrl(): string {
    return this.get('SOROBAN_NETWORK_URL');
  }

  get sorobanNetworkPassphrase(): string {
    return this.get('SOROBAN_NETWORK_PASSPHRASE');
  }

  // JWT
  get jwtSecret(): string {
    return this.get('JWT_SECRET');
  }

  get jwtExpiresIn(): string {
    return this.get('JWT_EXPIRES_IN');
  }

  // Encryption
  get encryptionKey(): string {
    return this.get('ENCRYPTION_KEY');
  }

  // Logging
  get logLevel(): string {
    return this.get('LOG_LEVEL');
  }

  get logJson(): boolean {
    return this.get('LOG_JSON') as unknown as boolean;
  }
}
