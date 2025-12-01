import { OnSiteEvent } from './entities/OnSiteEvent.js';
import {
  EventAlreadyExistsError,
  InvalidDateError,
  InvalidLatitudeError,
  InvalidLongitudeError,
  InvalidOwnerIdError,
  InvalidTicketPriceError,
} from './errors/index.js';

// DTO - Data Transfer Object
interface Input {
  ownerId: string;
  name: string;
  date: Date;
  ticketPriceInCents: number;
  latitude: number;
  longitude: number;
}

//  DTO - Data Transfer Object
interface Output {
  id: string;
  ownerId: string;
  name: string;
  date: Date;
  ticketPriceInCents: number;
  latitude: number;
  longitude: number;
}

// PORT
export interface EventRepository {
  create: (input: OnSiteEvent) => Promise<Output>;
  getByDateLatAndLong: (params: {
    date: Date;
    latitude: number;
    longitude: number;
  }) => Promise<OnSiteEvent | null>;
}

export class CreateEvent {
  // eventRepository: EventRepository;
  // constructor(eventRepository: EventRepository) {
  //   this.eventRepository = eventRepository;
  constructor(private eventRepository: EventRepository) {}
  async execute(input: Input) {
    const { ownerId, name, date, ticketPriceInCents, latitude, longitude } =
      input;
    // ownerId é um uuid?
    if (
      !/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(
        ownerId
      )
    ) {
      throw new InvalidOwnerIdError();
    }
    // tickerPriceInCents é um número inteiro?
    if (ticketPriceInCents < 0) {
      throw new InvalidTicketPriceError();
    }
    // latitude é entre -90 e 90?
    if (latitude < -90 || latitude > 90) {
      throw new InvalidLatitudeError();
    }
    // longitude é entre -180 e 180?
    if (longitude < -180 || longitude > 180) {
      throw new InvalidLongitudeError();
    }
    // BUSINESS RULES
    // date é no futuro?
    const now = new Date();
    if (date < now) {
      throw new InvalidDateError();
    }
    //  não posso criar um evento na mesma data (dia e horario), latitude e longitude
    const existenEvent = await this.eventRepository.getByDateLatAndLong({
      date,
      latitude,
      longitude,
    });
    if (existenEvent) {
      throw new EventAlreadyExistsError();
    }

    const event = await this.eventRepository.create({
      id: crypto.randomUUID(),
      name,
      date: new Date(date),
      ticketPriceInCents,
      latitude,
      longitude,
      ownerId,
    });
    return event;
  }
}
