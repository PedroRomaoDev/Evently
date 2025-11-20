import fastify, { FastifyReply, FastifyRequest } from 'fastify';

import { CreateEvent } from './application/CreateEvent.js';
import { db } from './db/client.js';
import { EventRepositoryDrizzle } from './resources/EventRepository.js';

const app = fastify();

app.post('/events', async (req: FastifyRequest, res: FastifyReply) => {
  const { name, ticketPriceInCents, latitude, longitude, ownerId, date } =
    req.body as {
      name: string;
      ticketPriceInCents: number;
      latitude: number;
      longitude: number;
      ownerId: string;
      date: string;
    };
  try {
    const eventRepositoryDrizzle = new EventRepositoryDrizzle(db);
    const createEvent = new CreateEvent(eventRepositoryDrizzle);
    const event = await createEvent.execute({
      ownerId,
      name,
      ticketPriceInCents,
      latitude,
      longitude,
      date: new Date(date),
    });
    return res.status(201).send(event);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).send({ message: error.message });
    }
    return res.status(400).send({ message: 'Erro desconhecido' });
  }
});

app.listen({ port: 3000 }, () => {
  console.log('Servidor rodando na porta 3000');
});
