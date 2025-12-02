import { OnSiteEvent } from './entities/OnSiteEvent.js';
import { InvalidEventIdError, NotFoundError } from './errors/index.js';

// DTO - Data Transfer Object
interface Input {
  eventId: string;
}

// DTO - Data Transfer Object
interface Output {
  id: string;
  ownerId: string;
  name: string;
  ticketPriceInCents: number;
  date: Date;
  latitude: number;
  longitude: number;
}

export interface GetEventRepository {
  getById: (id: string) => Promise<OnSiteEvent | null>;
}

export class GetEvent {
  constructor(private eventRepository: GetEventRepository) {}

  async execute(input: Input): Promise<Output> {
    const { eventId } = input;
    if (
      !/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(
        eventId
      )
    ) {
      throw new InvalidEventIdError();
    }

    const event = await this.eventRepository.getById(eventId);
    if (!event) {
      throw new NotFoundError();
    }
    return event;
  }
}
