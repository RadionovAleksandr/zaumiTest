import { Injectable } from '@angular/core';
import { StoreService } from './store.service';
import { TicketInterface } from '../inerfaces/ticket.interface';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  constructor(private storeService: StoreService) {
  }

  createTicket(ticket: TicketInterface): Observable<string> {
    ticket.id = Math.random().toString(36).substr(2, 9);
    this.storeService.tickets.push(ticket);
    return of(ticket.id);
  }
}
