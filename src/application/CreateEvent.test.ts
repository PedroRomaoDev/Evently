import axios from 'axios';

import { createEvent } from './CreateEvent.js';

axios.defaults.validateStatus = () => true;

describe('Create Event', () => {
  test('should create a new event', async () => {
    const input = {
      name: 'Sample Event',
      date: new Date(new Date(Date.now() + 86400000).toISOString()),
      ticketPriceInCents: 5000,
      latitude: 37.7749,
      longitude: -122.4194,
      ownerId: crypto.randomUUID(),
    };
    const output = await createEvent(input);

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
    const output = createEvent(input);

    await expect(output).rejects.toThrowError('Invalid ownerId');
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

    const output = createEvent(input);
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

    const output = createEvent(input);
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

    const output = createEvent(input);
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

    const output = createEvent(input);
    await expect(output).rejects.toThrowError(
      'Event date must be in the future'
    );
  });
});
