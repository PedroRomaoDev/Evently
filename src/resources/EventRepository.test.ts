import { vi } from 'vitest';

import { db } from '../db/client.js';
import { EventRepositoryDrizzle } from './EventRepository.js';

describe('Event Repository Drizzle', () => {
  test('should create a new event in the database', async () => {
    const repository = new EventRepositoryDrizzle(db);
    const id = crypto.randomUUID();
    const output = await repository.create({
      id,
      name: 'Sample Event',
      date: new Date(new Date(Date.now() + 86400000).toISOString()),
      ticketPriceInCents: 5000,
      latitude: 37.7749,
      longitude: -122.4194,
      ownerId: crypto.randomUUID(),
    });
    expect(output.id).toBe(id);
  });
});

describe('EventRepositoryDrizzle.getById (unit)', () => {
  test('returns mapped OnSiteEvent when database row exists', async () => {
    process.env.DATABASE_URL =
      process.env.DATABASE_URL || 'postgres://localhost/testdb';
    const { EventRepositoryDrizzle: Repo } = await import(
      './EventRepository.js'
    );

    const sampleRow = {
      id: '11111111-1111-1111-1111-111111111111',
      ownerId: '22222222-2222-2222-2222-222222222222',
      name: 'Repository Sample',
      date: new Date('2030-01-01T10:00:00.000Z'),
      ticketPriceInCents: 1500,
      latitude: '10.123456',
      longitude: '20.654321',
    };

    const mockDb = {
      query: {
        eventsTable: {
          findFirst: vi.fn().mockResolvedValue(sampleRow),
        },
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;

    const repo = new Repo(mockDb);
    const result = await repo.getById(sampleRow.id);

    expect(mockDb.query.eventsTable.findFirst).toHaveBeenCalled();
    expect(result).not.toBeNull();
    expect(result?.id).toBe(sampleRow.id);
    expect(result?.name).toBe(sampleRow.name);
    expect(result?.ownerId).toBe(sampleRow.ownerId);
    expect(result?.ticketPriceInCents).toBe(sampleRow.ticketPriceInCents);
    expect(result?.latitude).toBeCloseTo(Number(sampleRow.latitude));
    expect(result?.longitude).toBeCloseTo(Number(sampleRow.longitude));
    expect(result?.date instanceof Date).toBe(true);
  });

  test('returns null when no row is found', async () => {
    process.env.DATABASE_URL =
      process.env.DATABASE_URL || 'postgres://localhost/testdb';
    const { EventRepositoryDrizzle: Repo } = await import(
      './EventRepository.js'
    );
    const mockDb = {
      query: {
        eventsTable: {
          findFirst: vi.fn().mockResolvedValue(null),
        },
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;

    const repo = new Repo(mockDb);
    const result = await repo.getById('00000000-0000-0000-0000-000000000000');
    expect(result).toBeNull();
  });
});
