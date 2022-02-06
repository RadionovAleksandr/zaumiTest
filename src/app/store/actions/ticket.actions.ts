import { createAction, props } from '@ngrx/store';
import { Ticket } from '../models/ticket.models';

export const getTickets = createAction('[App Component] GetTickets');
export const getCities = createAction('[App Component] GetCities');
export const createTicket = createAction('[App Component] AddTicket', props<{ ticket: Ticket }>());
export const updateTicket = createAction('[App Component] UpdateTicket', props<{ ticket: Ticket }>());
export const deleteTicket = createAction('[App Component] DeleteTicket', props<{ id: Ticket['id'] }>());
export const clearTickets = createAction('[App Component] ClearTickets');
