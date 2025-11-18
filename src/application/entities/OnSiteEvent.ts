export interface OnSiteEvent {
  id: string;
  ownerId: string;
  name: string;
  date: Date;
  ticketPriceInCents: number;
  latitude: number;
  longitude: number;
}
