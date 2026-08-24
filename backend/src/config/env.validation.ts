import * as Joi from 'joi';

export interface EnvironmentVariables {
  // Application
  NODE_ENV: string;
  PORT: number;
  API_PREFIX: string;

  // Logging
  LOG_LEVEL: string;
  LOG_JSON: string;

  // Database
  DB_HOST: string;
  DB_PORT: number;
  DB_USERNAME: string;
  DB_PASSWORD: string;
  DB_DATABASE: string;

  // Redis
  REDIS_HOST: string;
  REDIS_PORT: number;
  REDIS_PASSWORD?: string;

  // Stellar Soroban
  SOROBAN_NETWORK_URL: string;
  SOROBAN_NETWORK_PASSPHRASE: string;
  IDENTITY_REGISTRY_CONTRACT_ID?: string;
  VERIFICATION_CONTRACT_ID?: string;
  ACCESS_CONTROL_CONTRACT_ID?: string;
  DATA_SHARING_CONTRACT_ID?: string;

  // IPFS / Pinata
  PINATA_API_KEY?: string;
  PINATA_API_SECRET?: string;
  PINATA_GATEWAY: string;

  // Groq AI
  GROQ_API_KEY?: string;

  // JWT
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;

  // Encryption
  ENCRYPTION_KEY: string;

  // Rate limiting
  THROTTLE_TTL: number;
  THROTTLE_LIMIT: number;

  // Audit
  AUDIT_HMAC_SECRET?: string;
  ADMIN_WALLETS?: string;
  AUDIT_RETENTION_DAYS: number;
  AUDIT_RETENTION_SWEEP_HOURS: number;
  AUDIT_RETENTION_ENABLED: string;

  // Backup
  BACKUP_AUTO_ENABLED: string;
  BACKUP_HEALTH_CHECK_INTERVAL_HOURS: number;
  BACKUP_HEALTH_CHECK_ENABLED: string;
  BACKUP_ROTATION_CHECK_INTERVAL_DAYS: number;
  BACKUP_ROTATION_ENABLED: string;
  BACKUP_RESTORATION_TEST_INTERVAL_DAYS: number;
  BACKUP_RESTORATION_TEST_ENABLED: string;
}

export const validationSchema = Joi.object<EnvironmentVariables>({
  // Application
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test', 'staging')
    .default('development'),
  PORT: Joi.number().port().default(3001),
  API_PREFIX: Joi.string().default('api/v1'),

  // Logging
  LOG_LEVEL: Joi.string()
    .valid('fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent')
    .default('info'),
  LOG_JSON: Joi.boolean().truthy('true').falsy('false').default(false),

  // Database - required
  DB_HOST: Joi.string().required().hostname().description('PostgreSQL host'),
  DB_PORT: Joi.number().port().default(5432),
  DB_USERNAME: Joi.string().required().description('PostgreSQL username'),
  DB_PASSWORD: Joi.string().required().description('PostgreSQL password'),
  DB_DATABASE: Joi.string().required().description('PostgreSQL database name'),

  // Redis - required
  REDIS_HOST: Joi.string().required().hostname().description('Redis host'),
  REDIS_PORT: Joi.number().port().default(6379),
  REDIS_PASSWORD: Joi.string().allow('').optional(),

  // Stellar Soroban - required
  SOROBAN_NETWORK_URL: Joi.string().uri().required().description('Stellar Soroban RPC URL'),
  SOROBAN_NETWORK_PASSPHRASE: Joi.string().required().description('Stellar network passphrase'),
  IDENTITY_REGISTRY_CONTRACT_ID: Joi.string().allow('').optional(),
  VERIFICATION_CONTRACT_ID: Joi.string().allow('').optional(),
  ACCESS_CONTROL_CONTRACT_ID: Joi.string().allow('').optional(),
  DATA_SHARING_CONTRACT_ID: Joi.string().allow('').optional(),

  // IPFS / Pinata - optional (features degrade gracefully)
  PINATA_API_KEY: Joi.string().allow('').optional(),
  PINATA_API_SECRET: Joi.string().allow('').optional(),
  PINATA_GATEWAY: Joi.string().uri().default('https://gateway.pinata.cloud/ipfs/'),

  // Groq AI - optional
  GROQ_API_KEY: Joi.string().allow('').optional(),

  // JWT - required
  JWT_SECRET: Joi.string()
    .min(32)
    .required()
    .description('JWT signing secret (min 32 chars)'),
  JWT_EXPIRES_IN: Joi.string()
    .pattern(/^\d+[smhd]$/)
    .default('7d')
    .description('JWT expiration (e.g. 7d, 24h, 3600s)'),

  // Encryption - required
  ENCRYPTION_KEY: Joi.string()
    .length(32)
    .required()
    .description('32-byte encryption key for credential data'),

  // Rate limiting
  THROTTLE_TTL: Joi.number().positive().default(60000),
  THROTTLE_LIMIT: Joi.number().positive().default(60),

  // Audit - optional with defaults
  AUDIT_HMAC_SECRET: Joi.string().allow('').optional(),
  ADMIN_WALLETS: Joi.string().allow('').optional(),
  AUDIT_RETENTION_DAYS: Joi.number().positive().default(365),
  AUDIT_RETENTION_SWEEP_HOURS: Joi.number().positive().default(24),
  AUDIT_RETENTION_ENABLED: Joi.boolean().truthy('true').falsy('false').default(true),

  // Backup - optional with defaults
  BACKUP_AUTO_ENABLED: Joi.boolean().truthy('true').falsy('false').default(true),
  BACKUP_HEALTH_CHECK_INTERVAL_HOURS: Joi.number().positive().default(6),
  BACKUP_HEALTH_CHECK_ENABLED: Joi.boolean().truthy('true').falsy('false').default(true),
  BACKUP_ROTATION_CHECK_INTERVAL_DAYS: Joi.number().positive().default(7),
  BACKUP_ROTATION_ENABLED: Joi.boolean().truthy('true').falsy('false').default(true),
  BACKUP_RESTORATION_TEST_INTERVAL_DAYS: Joi.number().positive().default(30),
  BACKUP_RESTORATION_TEST_ENABLED: Joi.boolean().truthy('true').falsy('false').default(true),
});
