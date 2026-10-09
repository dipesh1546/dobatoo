export interface AppConfig {
  port: number;
  nodeEnv: string;
  frontendUrl: string;
  databaseUrl: string;
  smtp: {
    host?: string;
    port?: number;
    user?: string;
    password?: string;
    from?: string;
    fromName?: string;
  };
  jwtSecret?: string;
}

export default (): AppConfig => {
  const databaseUrl = process.env.DATABASE_URL || '';
  if (process.env.NODE_ENV !== 'test') {
    let isValid = false;
    if (databaseUrl && typeof databaseUrl === 'string') {
      try {
        const parsed = new URL(databaseUrl);
        const isMongo =
          parsed.protocol === 'mongodb:' || parsed.protocol === 'mongodb+srv:';
        const dbName = parsed.pathname
          ? parsed.pathname.replace(/^\//, '').trim()
          : '';
        if (isMongo && dbName.length > 0) {
          isValid = true;
        }
      } catch {
        isValid = false;
      }
    }
    if (!isValid) {
      throw new Error(
        'DATABASE_URL is missing or does not contain a MongoDB database name.',
      );
    }
  }

  return {
    port: parseInt(process.env.PORT || '3000', 10),
    nodeEnv: process.env.NODE_ENV || 'development',
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
    databaseUrl,
    smtp: {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587,
      user: process.env.SMTP_USER,
      password: process.env.SMTP_PASSWORD,
      from: process.env.SMTP_FROM || 'no-reply@dobato.app',
      fromName: process.env.SMTP_FROM_NAME || 'DOBATO Team',
    },
    jwtSecret: process.env.JWT_SECRET,
  };
};
