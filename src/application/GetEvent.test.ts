import { describe, expect, test } from 'vitest';

import { InvalidEventIdError, NotFoundError } from './errors/index.js';
import { GetEvent } from './GetEvent.js';

const sampleEvent = {
  id: crypto.randomUUID(),
  ownerId: crypto.randomUUID(),
  name: 'Sample',
  date: new Date('2030-01-01T10:00:00.000Z'),
  ticketPriceInCents: 1000,
  latitude: 10,
  longitude: 20,
};

describe('GetEvent use-case', () => {
  test('returns event when repository finds it', async () => {
    const repo = {
      getById: async (id: string) => {
        expect(id).toBe(sampleEvent.id);
        return sampleEvent;
      },
    };
    const useCase = new GetEvent(repo);
    const result = await useCase.execute(sampleEvent.id);
    expect(result).toEqual(sampleEvent);
  });

  test('throws InvalidEventIdError for invalid id', async () => {
    const repo = { getById: async () => null };
    const useCase = new GetEvent(repo);
    await expect(async () =>
      useCase.execute('invalid-id')
    ).rejects.toBeInstanceOf(InvalidEventIdError);
  });

  test('throws NotFoundError when repository returns null', async () => {
    const repo = { getById: async () => null };
    const useCase = new GetEvent(repo);
    await expect(async () =>
      useCase.execute(sampleEvent.id)
    ).rejects.toBeInstanceOf(NotFoundError);
  });
});
