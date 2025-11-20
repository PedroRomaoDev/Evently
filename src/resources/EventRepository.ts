import 'dotenv/config';

import { and, eq } from 'drizzle-orm';

import { EventRepository } from '../application/CreateEvent.js';
import { OnSiteEvent } from '../application/entities/OnSiteEvent.js';
import { db } from '../db/client.js';
import * as schema from '../db/schema.js';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined');
}

// ADAPTER
export class EventRepositoryDrizzle implements EventRepository {
  constructor(private database: typeof db) {}
  async getByDateLatAndLong(params: {
    date: Date;
    latitude: number;
    longitude: number;
  }): Promise<OnSiteEvent | null> {
    const output = await this.database.query.eventsTable.findFirst({
      where: and(
        eq(schema.eventsTable.date, params.date),
        eq(schema.eventsTable.latitude, params.latitude.toString()),
        eq(schema.eventsTable.longitude, params.longitude.toString())
      ),
    });
    if (!output) {
      return null;
    }
    return {
      date: output?.date,
      id: output.id,
      longitude: Number(output.longitude),
      latitude: Number(output.latitude),
      name: output.name,
      ownerId: output.ownerId,
      ticketPriceInCents: output.ticketPriceInCents,
    };
  }
  async create(input: OnSiteEvent): Promise<OnSiteEvent> {
    const [output] = await this.database
      .insert(schema.eventsTable)
      .values({
        id: input.id,
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
