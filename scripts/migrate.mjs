import fs from 'node:fs';
import path from 'node:path';
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';

const dbPath = process.env.DB_PATH ?? path.resolve('data', 'league.db');
fs.mkdirSync(path.dirname(dbPath), { recursive: true });

const sqlite = new Database(dbPath);
const db = drizzle(sqlite);

const migrationsFolder = path.resolve('drizzle');
if (fs.existsSync(migrationsFolder)) {
  migrate(db, { migrationsFolder });
}

sqlite.close();
