import { sql } from 'drizzle-orm';
import { check, index, integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable(
  'users',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    username: text('username').notNull(),
    passwordHash: text('password_hash').notNull(),
    createdAt: integer('created_at', { mode: 'timestamp_ms' })
      .notNull()
      .default(sql`(unixepoch('subsec') * 1000)`),
    lastLoginAt: integer('last_login_at', { mode: 'timestamp_ms' })
  },
  (t) => ({
    usernameUnique: uniqueIndex('users_username_unique').on(t.username)
  })
);

export const leagues = sqliteTable(
  'leagues',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    slug: text('slug').notNull(),
    name: text('name').notNull(),
    status: text('status').notNull().default('draft'),
    createdAt: integer('created_at', { mode: 'timestamp_ms' })
      .notNull()
      .default(sql`(unixepoch('subsec') * 1000)`),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
      .notNull()
      .default(sql`(unixepoch('subsec') * 1000)`)
  },
  (t) => ({
    slugUnique: uniqueIndex('leagues_slug_unique').on(t.slug)
  })
);

export const players = sqliteTable(
  'players',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    leagueId: integer('league_id')
      .notNull()
      .references(() => leagues.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    factionId: text('faction_id').notNull(),
    createdAt: integer('created_at', { mode: 'timestamp_ms' })
      .notNull()
      .default(sql`(unixepoch('subsec') * 1000)`)
  },
  (t) => ({
    leagueIdx: index('players_league_idx').on(t.leagueId),
    leagueNameUnique: uniqueIndex('players_league_name_unique').on(t.leagueId, t.name)
  })
);

export const matches = sqliteTable(
  'matches',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    leagueId: integer('league_id')
      .notNull()
      .references(() => leagues.id, { onDelete: 'cascade' }),
    playerAId: integer('player_a_id')
      .notNull()
      .references(() => players.id, { onDelete: 'cascade' }),
    playerBId: integer('player_b_id')
      .notNull()
      .references(() => players.id, { onDelete: 'cascade' }),
    result: text('result'),
    recordedAt: integer('recorded_at', { mode: 'timestamp_ms' })
  },
  (t) => ({
    leagueIdx: index('matches_league_idx').on(t.leagueId),
    recordedIdx: index('matches_recorded_idx').on(t.leagueId, t.recordedAt),
    pairUnique: uniqueIndex('matches_league_pair_unique').on(t.leagueId, t.playerAId, t.playerBId),
    orderedCheck: check('matches_player_order', sql`${t.playerAId} < ${t.playerBId}`),
    resultCheck: check(
      'matches_result_valid',
      sql`${t.result} is null or ${t.result} in ('a', 'b', 'draw')`
    )
  })
);
