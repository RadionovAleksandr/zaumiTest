import { createReducer, on } from '@ngrx/store';
import {
  createTicket,
  clearTickets,
  deleteTicket,
  getCities,
  updateTicket,
} from '../actions/ticket.actions';
import { Ticket } from '../models/ticket.models';
import { UtilsService } from '../../services/utils';
import { TicketService } from '../../services/ticket.service';

const initialTicketState: Ticket[] = [
    {
      dateOfArrival: '2021-03-26T10:00',
      dateOfDeparture: '2021-03-26T08:00',
      id: '2eq0mxj2f',
      placeOfArrival: 'Москва',
      placeOfDeparture: 'Новосибирск',
    },
    {
      dateOfArrival: '2021-03-26T14:00',
      dateOfDeparture: '2021-03-26T12:00',
      id: '08q0mwj2f',
      placeOfArrival: 'Париж',
      placeOfDeparture: 'Москва',
    },
    {
      dateOfArrival: '2021-03-26T21:00',
      dateOfDeparture: '2021-03-26T20:00',
      id: '2wq0mwj2f',
      placeOfArrival: 'Мюнхен',
      placeOfDeparture: 'Париж',
    },
    {
      dateOfArrival: '2021-03-26T20:00',
      dateOfDeparture: '2021-03-26T18:00',
      id: '08qdf9j2f',
      placeOfArrival: 'Копенгаген',
      placeOfDeparture: 'Мюнхен',
    },
    {
      dateOfArrival: '2021-03-26T23:00',
      dateOfDeparture: '2021-03-26T22:00',
      id: '2wq0mwj2f',
      placeOfArrival: 'Новосибирск',
      placeOfDeparture: 'Мюнхен',
    },
];
const initialCitiesState: string[] = ['Новосибирск', 'Москва', 'Париж', 'Мюнхен', 'Копенгаген'];
const utilsService = new UtilsService();
const ticketService = new TicketService();

const TICKET_REDUCER = createReducer(
  ticketService.checkStorageAndGetTickets(initialTicketState),
  on(createTicket, (tickets, event) => {
    const newTicketState = [...tickets, {...event.ticket, id: utilsService.uid()}];
    ticketService.setStorage(newTicketState);
    return newTicketState;
  }),
  on(updateTicket, (tickets, event) => {
    const newTicketState = tickets.map(ticket => {
      if (ticket.id === event.ticket.id) {
        return event.ticket;
      }
      return ticket;
    });
    ticketService.setStorage(newTicketState);
    return newTicketState;
  }),
  on(deleteTicket, (tickets, event) => {
    const newTicketState = tickets.filter(ticket => ticket.id !== event.id);
    ticketService.setStorage(newTicketState);
    return newTicketState;
  }),
  on(clearTickets, () => {
    ticketService.setStorage([]);
    return [];
  }),
);

const CITIES_REDUCER = createReducer(
  initialCitiesState,
  on(getCities, (cities) => cities),
);

// tslint:disable-next-line:typedef
export function ticketReducer(state, action) {
  return TICKET_REDUCER(state, action);
}
// tslint:disable-next-line:typedef
export function citiesReducer(state, action) {
  return CITIES_REDUCER(state, action);
}
