import { db } from '../db/client.js';
import { EventRepositoryDrizzle } from '../resources/EventRepository.js';
import { CreateEvent } from './CreateEvent.js';
import { InvalidOwnerIdError } from './errors/index.js';

describe('Create Event', () => {
  // service under test
  const makeSut = () => {
    const eventRepository = new EventRepositoryDrizzle(db);
    const sut = new CreateEvent(eventRepository);
    return { sut, eventRepository };
  };

  const { sut } = makeSut();
  test('should create a new event', async () => {
    const input = {
      name: 'Sample Event',
      date: new Date(new Date(Date.now() + 86400000).toISOString()),
      ticketPriceInCents: 5000,
      latitude: 37.7749,
      longitude: -122.4194,
      ownerId: crypto.randomUUID(),
    };
    const output = await sut.execute(input);
    expect(output.id).toBeDefined();
    expect(output.name).toBe(input.name);
    expect(output.ticketPriceInCents).toBe(input.ticketPriceInCents);
  });
  test('should throw a error if ownerId is invalid', async () => {
    const input = {
      name: 'Sample Event',
      date: new Date(new Date(Date.now() + 86400000).toISOString()),
      ticketPriceInCents: 5000,
      latitude: 37.7749,
      longitude: -122.4194,
      ownerId: 'invalid id',
    };
    const output = sut.execute(input);

    await expect(output).rejects.toThrow(new InvalidOwnerIdError());
  });
  test('should throw a error if ticket price is negative', async () => {
    const input = {
      name: 'Sample Event',
      date: new Date(new Date(Date.now() + 86400000).toISOString()),
      ticketPriceInCents: -5000,
      latitude: 37.7749,
      longitude: -122.4194,
      ownerId: crypto.randomUUID(),
    };

    const output = sut.execute(input);
    await expect(output).rejects.toThrowError('Invalid ticket price');
  });
  test('should throw a error if latitude is invalid', async () => {
    const input = {
      name: 'Sample Event',
      date: new Date(new Date(Date.now() + 86400000).toISOString()),
      ticketPriceInCents: 5000,
      latitude: -100,
      longitude: -122.4194,
      ownerId: crypto.randomUUID(),
    };

    const output = sut.execute(input);
    await expect(output).rejects.toThrowError('Invalid latitude');
  });
  test('should throw a error if longitude is invalid', async () => {
    const input = {
      name: 'Sample Event',
      date: new Date(new Date(Date.now() + 86400000).toISOString()),
      ticketPriceInCents: 5000,
      latitude: 37.7749,
      longitude: -200,
      ownerId: crypto.randomUUID(),
    };

    const output = sut.execute(input);
    await expect(output).rejects.toThrowError('Invalid longitude');
  });
  test('should throw a error if date is invalid', async () => {
    const input = {
      name: 'Sample Event',
      date: new Date(new Date(Date.now() - 1).toISOString()),
      ticketPriceInCents: 5000,
      latitude: 37.7749,
      longitude: -180,
      ownerId: crypto.randomUUID(),
    };

    const output = sut.execute(input);
    await expect(output).rejects.toThrowError(
      'Event date must be in the future'
    );
  });
  test('should throw a error if an event already exists for the same date, latitude and longitude', async () => {
    const date = new Date(new Date(Date.now() + 86400000).toISOString());
    const input = {
      name: 'Sample Event',
      date,
      ticketPriceInCents: 5000,
      latitude: 37.7749,
      longitude: -180,
      ownerId: crypto.randomUUID(),
    };

    const output = await sut.execute(input);
    expect(output.name).toBe(input.name);

    const output2 = sut.execute(input);
    await expect(output2).rejects.toThrowError(
      'An event already exists for the same date, latitude and longitude'
    );
  });
  test('should call repository with correct parameters', async () => {
    const { sut, eventRepository } = makeSut();
    const spy = vi.spyOn(eventRepository, 'create');
    const input = {
      name: 'Sample Event',
      date: new Date(new Date(Date.now() + 86400000).toISOString()),
      ticketPriceInCents: 5000,
      latitude: 37.7749,
      longitude: -180,
      ownerId: crypto.randomUUID(),
    };
    await sut.execute(input);
    expect(spy).toHaveBeenCalledWith({
      id: expect.any(String),
      ...input,
    });
  });
});
