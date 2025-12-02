export class InvalidOwnerIdError extends Error {
  code = 'INVALID_OWNER_ID';
  constructor() {
    super('Invalid ownerId');
  }
}

export class InvalidLongitudeError extends Error {
  code = 'INVALID_LONGITUDE';
  constructor() {
    super('Invalid longitude');
  }
}

export class InvalidLatitudeError extends Error {
  code = 'INVALID_LATITUDE';
  constructor() {
    super('Invalid latitude');
  }
}

export class InvalidTicketPriceError extends Error {
  code = 'INVALID_TICKET_PRICE';
  constructor() {
    super('Invalid ticket price');
  }
}
export class InvalidDateError extends Error {
  code = 'INVALID_DATE';
  constructor() {
    super('Event date must be in the future');
  }
}

export class NotFoundError extends Error {
  code = 'NOT_FOUND';
  constructor() {
    super('Resource not found');
  }
}

export class InvalidEventIdError extends Error {
  code = 'INVALID_EVENT_ID';
  constructor() {
    super('Invalid event id');
  }
}

export class EventAlreadyExistsError extends Error {
  code = 'EVENT_ALREADY_EXISTS';
  constructor() {
    super('Event already exists');
  }
}
