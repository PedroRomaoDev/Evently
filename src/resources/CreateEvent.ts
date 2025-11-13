import 'dotenv/config';

import { drizzle } from 'drizzle-orm/node-postgres';

import * as schema from '../db/schema.js';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined');
}

const db = drizzle(process.env.DATABASE_URL, { schema });

export const createEventOnDatabase = async (
  input: typeof schema.eventsTable.$inferInsert
) => {
  const [output] = await db
    .insert(schema.eventsTable)
    .values(input)
    .returning();
  return output;
};
