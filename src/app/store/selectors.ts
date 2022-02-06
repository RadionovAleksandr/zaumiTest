import { createFeatureSelector } from '@ngrx/store';
import { Ticket } from './models/ticket.models';

export const selectTickets = createFeatureSelector<Ticket[]>('tickets');
export const selectCities = createFeatureSelector<string[]>('cities');
