import { validationSchema, EnvironmentVariables } from './env.validation';

describe('Environment Validation Schema', () => {
  const validEnv: Partial<EnvironmentVariables> = {
    NODE_ENV: 'development',
    PORT: 3001,
    API_PREFIX: 'api/v1',
    LOG_LEVEL: 'info',
    LOG_JSON: 'false',
    DB_HOST: 'localhost',
    DB_PORT: 5432,
    DB_USERNAME: 'postgres',
    DB_PASSWORD: 'postgres',
    DB_DATABASE: 'securedata',
    REDIS_HOST: 'localhost',
    REDIS_PORT: 6379,
    SOROBAN_NETWORK_URL: 'https://soroban-testnet.stellar.org',
    SOROBAN_NETWORK_PASSPHRASE: 'Test SDF Network ; September 2015',
    JWT_SECRET: 'my-secret-key-that-is-at-least-32-chars',
    JWT_EXPIRES_IN: '7d',
    ENCRYPTION_KEY: '12345678901234567890123456789012',
    THROTTLE_TTL: 60000,
    THROTTLE_LIMIT: 60,
    AUDIT_RETENTION_DAYS: 365,
    AUDIT_RETENTION_SWEEP_HOURS: 24,
    AUDIT_RETENTION_ENABLED: 'true',
    BACKUP_AUTO_ENABLED: 'true',
    BACKUP_HEALTH_CHECK_INTERVAL_HOURS: 6,
    BACKUP_HEALTH_CHECK_ENABLED: 'true',
    BACKUP_ROTATION_CHECK_INTERVAL_DAYS: 7,
    BACKUP_ROTATION_ENABLED: 'true',
    BACKUP_RESTORATION_TEST_INTERVAL_DAYS: 30,
    BACKUP_RESTORATION_TEST_ENABLED: 'true',
  };

  it('should validate a complete valid environment', () => {
    const { error, value } = validationSchema.validate(validEnv);
    expect(error).toBeUndefined();
    expect(value).toBeDefined();
  });

  describe('Required fields', () => {
    const requiredFields = [
      'DB_HOST',
      'DB_USERNAME',
      'DB_PASSWORD',
      'DB_DATABASE',
      'REDIS_HOST',
      'SOROBAN_NETWORK_URL',
      'SOROBAN_NETWORK_PASSPHRASE',
      'JWT_SECRET',
      'ENCRYPTION_KEY',
    ];

    requiredFields.forEach((field) => {
      it(`should fail when ${field} is missing`, () => {
        const env = { ...validEnv };
        delete env[field as keyof typeof env];
        const { error } = validationSchema.validate(env);
        expect(error).toBeDefined();
        expect(error!.details.some((d) => d.context?.key === field)).toBe(true);
      });
    });
  });

  describe('Format validation', () => {
    it('should reject invalid NODE_ENV', () => {
      const { error } = validationSchema.validate({ ...validEnv, NODE_ENV: 'invalid' });
      expect(error).toBeDefined();
      expect(error!.details[0].context?.key).toBe('NODE_ENV');
    });

    it('should reject invalid LOG_LEVEL', () => {
      const { error } = validationSchema.validate({ ...validEnv, LOG_LEVEL: 'verbose' });
      expect(error).toBeDefined();
      expect(error!.details[0].context?.key).toBe('LOG_LEVEL');
    });

    it('should reject negative PORT', () => {
      const { error } = validationSchema.validate({ ...validEnv, PORT: -1 });
      expect(error).toBeDefined();
    });

    it('should reject PORT above 65535', () => {
      const { error } = validationSchema.validate({ ...validEnv, PORT: 99999 });
      expect(error).toBeDefined();
    });

    it('should reject invalid SOROBAN_NETWORK_URL', () => {
      const { error } = validationSchema.validate({
        ...validEnv,
        SOROBAN_NETWORK_URL: 'not-a-url',
      });
      expect(error).toBeDefined();
      expect(error!.details[0].context?.key).toBe('SOROBAN_NETWORK_URL');
    });

    it('should reject JWT_SECRET shorter than 32 chars', () => {
      const { error } = validationSchema.validate({ ...validEnv, JWT_SECRET: 'short' });
      expect(error).toBeDefined();
      expect(error!.details[0].context?.key).toBe('JWT_SECRET');
    });

    it('should reject ENCRYPTION_KEY not exactly 32 chars', () => {
      const { error } = validationSchema.validate({
        ...validEnv,
        ENCRYPTION_KEY: 'too-short',
      });
      expect(error).toBeDefined();
      expect(error!.details[0].context?.key).toBe('ENCRYPTION_KEY');
    });

    it('should reject invalid JWT_EXPIRES_IN format', () => {
      const { error } = validationSchema.validate({
        ...validEnv,
        JWT_EXPIRES_IN: 'seven-days',
      });
      expect(error).toBeDefined();
      expect(error!.details[0].context?.key).toBe('JWT_EXPIRES_IN');
    });

    it('should accept valid JWT_EXPIRES_IN formats', () => {
      const formats = ['7d', '24h', '3600s', '30m'];
      formats.forEach((format) => {
        const { error } = validationSchema.validate({
          ...validEnv,
          JWT_EXPIRES_IN: format,
        });
        expect(error).toBeUndefined();
      });
    });
  });

  describe('Default values', () => {
    it('should apply defaults for optional fields', () => {
      const minimalEnv = {
        DB_HOST: 'localhost',
        DB_USERNAME: 'postgres',
        DB_PASSWORD: 'postgres',
        DB_DATABASE: 'securedata',
        REDIS_HOST: 'localhost',
        SOROBAN_NETWORK_URL: 'https://soroban-testnet.stellar.org',
        SOROBAN_NETWORK_PASSPHRASE: 'Test SDF Network ; September 2015',
        JWT_SECRET: 'my-secret-key-that-is-at-least-32-chars',
        ENCRYPTION_KEY: '12345678901234567890123456789012',
      };

      const { error, value } = validationSchema.validate(minimalEnv);
      expect(error).toBeUndefined();
      expect(value.NODE_ENV).toBe('development');
      expect(value.PORT).toBe(3001);
      expect(value.API_PREFIX).toBe('api/v1');
      expect(value.LOG_LEVEL).toBe('info');
      expect(value.DB_PORT).toBe(5432);
      expect(value.REDIS_PORT).toBe(6379);
      expect(value.JWT_EXPIRES_IN).toBe('7d');
      expect(value.THROTTLE_TTL).toBe(60000);
      expect(value.THROTTLE_LIMIT).toBe(60);
      expect(value.AUDIT_RETENTION_DAYS).toBe(365);
      expect(value.AUDIT_RETENTION_SWEEP_HOURS).toBe(24);
    });
  });

  describe('Optional fields', () => {
    it('should allow empty optional string fields', () => {
      const env = {
        ...validEnv,
        REDIS_PASSWORD: '',
        PINATA_API_KEY: '',
        PINATA_API_SECRET: '',
        GROQ_API_KEY: '',
        IDENTITY_REGISTRY_CONTRACT_ID: '',
        AUDIT_HMAC_SECRET: '',
        ADMIN_WALLETS: '',
      };

      const { error } = validationSchema.validate(env);
      expect(error).toBeUndefined();
    });
  });

  describe('Boolean coercion', () => {
    it('should coerce string "true" to boolean for LOG_JSON', () => {
      const { value } = validationSchema.validate({ ...validEnv, LOG_JSON: 'true' });
      expect(value.LOG_JSON).toBe(true);
    });

    it('should coerce string "false" to boolean for LOG_JSON', () => {
      const { value } = validationSchema.validate({ ...validEnv, LOG_JSON: 'false' });
      expect(value.LOG_JSON).toBe(false);
    });

    it('should coerce AUDIT_RETENTION_ENABLED', () => {
      const { value } = validationSchema.validate({
        ...validEnv,
        AUDIT_RETENTION_ENABLED: 'false',
      });
      expect(value.AUDIT_RETENTION_ENABLED).toBe(false);
    });
  });

  describe('Multiple errors', () => {
    it('should report all missing required fields at once', () => {
      const { error } = validationSchema.validate({}, { abortEarly: false });
      expect(error).toBeDefined();
      expect(error!.details.length).toBeGreaterThan(1);
      const missingKeys = error!.details.map((d) => d.context?.key);
      expect(missingKeys).toContain('DB_HOST');
      expect(missingKeys).toContain('DB_USERNAME');
      expect(missingKeys).toContain('REDIS_HOST');
      expect(missingKeys).toContain('JWT_SECRET');
      expect(missingKeys).toContain('ENCRYPTION_KEY');
    });
  });
});
