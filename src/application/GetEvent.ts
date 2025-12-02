import { OnSiteEvent } from './entities/OnSiteEvent.js';
import { InvalidEventIdError, NotFoundError } from './errors/index.js';

export interface GetEventRepository {
  getById: (id: string) => Promise<OnSiteEvent | null>;
}

export class GetEvent {
  constructor(private repository: GetEventRepository) {}

  async execute(eventId: string) {
    // valeventIdate eventId is uuid
    if (
      !/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(
        eventId
      )
    ) {
      throw new InvalidEventIdError();
    }

    const event = await this.repository.getById(eventId);
    if (!event) {
      throw new NotFoundError();
    }
    return event;
  }
}
