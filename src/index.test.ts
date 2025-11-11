import axios from 'axios';

axios.defaults.validateStatus = () => true;

describe('POST /events', () => {
  test('should create a new event', async () => {
    const input = {
      name: 'Sample Event',
      date: new Date(Date.now() + 86400000).toISOString(),
      ticketPriceInCents: 5000,
      latitude: 37.7749,
      longitude: -122.4194,
      ownerId: crypto.randomUUID(),
    };
    const response = await axios.post('http://localhost:3000/events', input);

    expect(response.status).toBe(201);
  });
  test('should return 400 if ownerId is invalid', async () => {
    const input = {
      name: 'Sample Event',
      date: new Date(Date.now() + 86400000).toISOString(),
      ticketPriceInCents: 5000,
      latitude: 37.7749,
      longitude: -122.4194,
      ownerId: 'invalid id',
    };
    const response = await axios.post('http://localhost:3000/events', input);

    expect(response.status).toBe(400);
  });
  test('should return 400 if ticket price is negative', async () => {
    const input = {
      name: 'Sample Event',
      date: new Date(Date.now() + 86400000).toISOString(),
      ticketPriceInCents: -5000,
      latitude: 37.7749,
      longitude: -122.4194,
      ownerId: crypto.randomUUID(),
    };
    const response = await axios.post('http://localhost:3000/events', input);

    expect(response.status).toBe(400);
  });
  test('should return 400 if latitude is invalid', async () => {
    const input = {
      name: 'Sample Event',
      date: new Date(Date.now() + 86400000).toISOString(),
      ticketPriceInCents: 5000,
      latitude: -100,
      longitude: -122.4194,
      ownerId: crypto.randomUUID(),
    };
    const response = await axios.post('http://localhost:3000/events', input);

    expect(response.status).toBe(400);
  });
  test('should return 400 if longitude is invalid', async () => {
    const input = {
      name: 'Sample Event',
      date: new Date(Date.now() + 86400000).toISOString(),
      ticketPriceInCents: 5000,
      latitude: 37.7749,
      longitude: -200,
      ownerId: crypto.randomUUID(),
    };
    const response = await axios.post('http://localhost:3000/events', input);

    expect(response.status).toBe(400);
  });
  test('should return 400 if date is invalid', async () => {
    const input = {
      name: 'Sample Event',
      date: '123',
      ticketPriceInCents: 5000,
      latitude: 37.7749,
      longitude: -180,
      ownerId: crypto.randomUUID(),
    };
    const response = await axios.post('http://localhost:3000/events', input);

    expect(response.status).toBe(400);
  });
});
