"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const client_1 = require("@prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const pg_1 = require("pg");
const env_1 = require("../config/env");
const pool = new pg_1.Pool({
    connectionString: env_1.env.DATABASE_URL,
    max: 5,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 5_000,
    ssl: env_1.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
});
const adapter = new adapter_pg_1.PrismaPg(pool);
const globalForPrisma = globalThis;
exports.prisma = globalForPrisma.prisma ||
    new client_1.PrismaClient({
        adapter,
        log: env_1.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
    });
if (env_1.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = exports.prisma;
}
