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
    const response = await axios.post('http://localhost:8080/events', input);

    expect(response.status).toBe(201);
    expect(response.data.name).toBe(input.name);

    expect(response.data.ticketPriceInCents).toBe(input.ticketPriceInCents);
    // expect(response.data.latitude).toBe(input.latitude);
    // expect(response.data.longitude).toBe(input.longitude);
  });
  test('should return 400 if createEvent throws an exception ', async () => {
    const input = {
      name: 'Sample Event',
      date: new Date(Date.now() + 86400000).toISOString(),
      ticketPriceInCents: 5000,
      latitude: 37.7749,
      longitude: -122.4194,
      ownerId: 'invalid id',
    };
    const response = await axios.post('http://localhost:8080/events', input);

    expect(response.status).toBe(400);
  });
});

describe('GET /events/:eventId', () => {
  test('should return the created event', async () => {
    const input = {
      name: 'Event For Get',
      date: new Date(Date.now() + 86400000).toISOString(),
      ticketPriceInCents: 2500,
      latitude: 40.7128,
      longitude: -74.006,
      ownerId: crypto.randomUUID(),
    };

    const createRes = await axios.post('http://localhost:8080/events', input);
    expect(createRes.status).toBe(201);

    const eventId = createRes.data.id;
    const getRes = await axios.get(`http://localhost:8080/events/${eventId}`);
    expect(getRes.status).toBe(200);
    expect(getRes.data.id).toBe(eventId);
    expect(getRes.data.name).toBe(input.name);
    expect(getRes.data.ticketPriceInCents).toBe(input.ticketPriceInCents);
  });

  test('should return 404 for non existing id', async () => {
    const randomId = crypto.randomUUID();
    const res = await axios.get(`http://localhost:8080/events/${randomId}`);
    expect(res.status).toBe(404);
  });
});
