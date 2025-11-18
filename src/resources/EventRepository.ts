import 'dotenv/config';

import { drizzle } from 'drizzle-orm/node-postgres';

import { EventRepository } from '../application/CreateEvent.js';
import { OnSiteEvent } from '../application/entities/OnSiteEvent.js';
import * as schema from '../db/schema.js';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined');
}

const db = drizzle(process.env.DATABASE_URL, { schema });

// ADAPTER
export class EventRepositoryDrizzle implements EventRepository {
  async create(input: OnSiteEvent): Promise<OnSiteEvent> {
    const [output] = await db
      .insert(schema.eventsTable)
      .values({
        date: input.date,
        name: input.name,
        ownerId: input.ownerId,
        ticketPriceInCents: input.ticketPriceInCents,
        latitude: input.latitude.toString(),
        longitude: input.longitude.toString(),
      })
      .returning();
    return {
      date: output.date,
      id: output.id,
      latitude: Number(output.latitude),
      longitude: Number(output.longitude),
      name: output.name,
      ownerId: output.ownerId,
      ticketPriceInCents: output.ticketPriceInCents,
    };
  }
}
