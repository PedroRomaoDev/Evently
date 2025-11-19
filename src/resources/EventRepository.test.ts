import { EventRepositoryDrizzle } from './EventRepository.js';

describe('Event Repository Drizzle', () => {
  test('should create a new event in the database', async () => {
    const repository = new EventRepositoryDrizzle();
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
