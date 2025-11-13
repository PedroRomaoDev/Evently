import express from 'express';

import { createEvent } from './application/CreateEvent.js';

const app = express();

app.use(express.json());

app.post('/events', async (req, res) => {
  const { name, ticketPriceInCents, latitude, longitude, ownerId, date } =
    req.body;
  try {
    const event = await createEvent({
      ownerId,
      name,
      ticketPriceInCents,
      latitude,
      longitude,
      date: new Date(date),
    });
    return res.status(201).json({ event });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message });
    }
    return res.status(400).json({ message: 'Erro desconhecido' });
  }
});

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});
