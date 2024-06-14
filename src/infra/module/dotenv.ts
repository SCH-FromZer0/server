import { config } from 'dotenv';

class Env {
    public readonly TZ: string;

    public readonly CLIENT_URL: string;

    public readonly HTTP_PORT: number;

    public readonly DB_HOST: string;
    public readonly DB_PORT: number;
    public readonly DB_USER: string;
    public readonly DB_PASS: string;
    public readonly DB_NAME: string;

    public readonly REDIS_HOST: string;
    public readonly REDIS_PORT: number;

    public readonly MAILGUN_API_KEY: string;
    public readonly TELEGRAM_API_KEY: string;

    public readonly JWT_KEY_TTL: number;
    public readonly JWT_ISSUER: string;
    public readonly ACCESS_TTL: number;
    public readonly REFRESH_TTL: number;

    constructor() {
        config();

        this.TZ = process.env.TZ ?? 'KST';
        this.CLIENT_URL = process.env.CLIENT_URL ?? 'http://localhost:3000';

        this.HTTP_PORT = parseInt(String(process.env.HTTP_PORT), 10) ?? 5000;

        this.DB_HOST = process.env.DB_HOST ?? '';
        this.DB_PORT = parseInt(String(process.env.DB_PORT), 10) ?? 5432;
        this.DB_USER = process.env.DB_USER ?? '';
        this.DB_PASS = process.env.DB_PASS ?? '';
        this.DB_NAME = process.env.DB_NAME ?? '';

        this.REDIS_HOST = process.env.REDIS_HOST ?? '';
        this.REDIS_PORT = parseInt(String(process.env.REDIS_PORT), 10) ?? 6379;

        this.MAILGUN_API_KEY = process.env.MAILGUN_API_KEY ?? '';
        this.TELEGRAM_API_KEY = process.env.TELEGRAM_API_KEY ?? '';

        this.JWT_KEY_TTL = parseInt(String(process.env.JWT_KEY_TTL), 10) ?? 0;
        this.JWT_ISSUER = process.env.JWT_ISSUER ?? '';
        this.ACCESS_TTL = parseInt(String(process.env.ACCESS_TTL), 10) ?? 0;
        this.REFRESH_TTL = parseInt(String(process.env.REFRESH_TTL), 10) ?? 0;
    }
}

const env = new Env();

export default env;
