import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUI from '@fastify/swagger-ui';
import fastify from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod';
import z from 'zod';

import { CreateEvent } from './application/CreateEvent.js';
import { InvalidOwnerIdError } from './application/errors/index.js';
import { db } from './db/client.js';
import { EventRepositoryDrizzle } from './resources/EventRepository.js';

const app = fastify();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

await app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'Evently',
      description:
        'Event management API with event-driven architecture, async processing, BuildMQ messaging, AWS integration, and geolocation support.',
      version: '1.0.0',
    },
    servers: [
      {
        url: 'http://localhost:8080',
        description: 'Local server',
      },
    ],
  },
  transform: jsonSchemaTransform,
});

await app.register(fastifySwaggerUI, {
  routePrefix: '/docs',
});

app.withTypeProvider<ZodTypeProvider>().route({
  method: 'POST',
  url: '/events',
  schema: {
    tags: ['Events'],
    summary: 'Create a new event',
    body: z.object({
      name: z.string(),
      ticketPriceInCents: z.number(),
      longitude: z.number(),
      latitude: z.number(),
      ownerId: z.uuid(),
      date: z.iso.datetime(),
    }),
    response: {
      201: z.object({
        id: z.uuid(),
        name: z.string(),
        ticketPriceInCents: z.number(),
        longitude: z.number(),
        latitude: z.number(),
        ownerId: z.uuid(),
        date: z.iso.datetime(),
      }),
      400: z.object({
        code: z.string().optional(),
        message: z.string(),
      }),
    },
  },
  handler: async (req, res) => {
    const { name, ticketPriceInCents, latitude, longitude, ownerId, date } =
      req.body;
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
      return res.status(201).send({
        ...event,
        date: event.date.toISOString(),
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(error);
      if (error instanceof InvalidOwnerIdError) {
        return res.status(400).send({
          code: error.code,
          message: error.message,
        });
      }
      return res
        .status(400)
        .send({ code: 'SERVER_ERROR', message: error.message });
    }
  },
});

await app.ready();
app.listen({ port: 8080 }, () => {
  console.log('Servidor rodando na porta 3000');
});
