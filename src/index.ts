import 'dotenv/config';

import { drizzle } from 'drizzle-orm/node-postgres';
import express from 'express';

import * as schema from './db/schema.js';

const app = express();

app.use(express.json());

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined');
}

const db = drizzle(process.env.DATABASE_URL, { schema });

app.post('/events', async (req, res) => {
  const { name, date, ticketPriceInCents, latitude, longitude, ownerId } =
    req.body;

  // ownerId é um uuid?
  if (
    !/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(
      ownerId
    )
  ) {
    return res.status(400).json({ error: 'Invalid ownerId' });
  }
  // tickerPriceInCents é um número inteiro?
  if (ticketPriceInCents < 0) {
    return res.status(400).json({ error: 'Invalid ticket price' });
  }
  // latitude é entre -90 e 90?
  if (latitude < -90 || latitude > 90) {
    return res.status(400).json({ error: 'Invalid latitude' });
  }
  // longitude é entre -180 e 180?
  if (longitude < -180 || longitude > 180) {
    return res.status(400).json({ error: 'Invalid longitude' });
  }

  // BUSINESS RULES
  // date é no futuro?
  const now = new Date();
  if (date < now) {
    return res.status(400).json({ error: 'Event date must be in the future' });
  }
  //  não posso criar um evento na mesma data (dia e horario), latitude e longitude
  const event = await db
    .insert(schema.eventsTable)
    .values({
      name,
      date: new Date(date),
      ticketPriceInCents,
      latitude,
      longitude,
      ownerId,
    })
    .returning();

  res.status(201).json({ event });
});

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});
