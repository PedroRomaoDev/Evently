import { createEventOnDatabase } from '../resources/CreateEvent.js';

interface Input {
  ownerId: string;
  name: string;
  date: Date;
  ticketPriceInCents: number;
  latitude: number;
  longitude: number;
}

export const createEvent = async (input: Input) => {
  const { name, date, ticketPriceInCents, latitude, longitude, ownerId } =
    input;
  // ownerId é um uuid?
  if (
    !/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(
      ownerId
    )
  ) {
    throw new Error('Invalid ownerId');
  }
  // tickerPriceInCents é um número inteiro?
  if (ticketPriceInCents < 0) {
    throw new Error('Invalid ticket price');
  }
  // latitude é entre -90 e 90?
  if (latitude < -90 || latitude > 90) {
    throw new Error('Invalid latitude');
  }
  // longitude é entre -180 e 180?
  if (longitude < -180 || longitude > 180) {
    throw new Error('Invalid longitude');
  }
  // BUSINESS RULES
  // date é no futuro?
  const now = new Date();
  if (date < now) {
    throw new Error('Event date must be in the future');
  }
  //  não posso criar um evento na mesma data (dia e horario), latitude e longitude
  const event = await createEventOnDatabase({
    name,
    date: new Date(date),
    ticketPriceInCents,
    latitude,
    longitude,
    ownerId,
  });
  return event;
};
