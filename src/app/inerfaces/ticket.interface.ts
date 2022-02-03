export interface Ticket {
  id?: string;
  placeOfDeparture: string;
  dateOfDeparture: Date | string | number;
  placeOfArrival: string;
  dateOfArrival: Date | string | number;
}
