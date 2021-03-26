import { Injectable } from '@angular/core';
import { StoreService } from './store.service';
import { ITicket } from '../inerfaces/ticket.interface';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  constructor(private storeService: StoreService) {
  }

  createTicket(ticket: ITicket): Observable<string> {
    ticket.id = this.uid();
    this.storeService.tickets.push(ticket);
    return of(ticket.id);
  }

  deleteTicket(id: string): Observable<string> {
    return of(this.storeService.tickets = this.storeService.tickets.filter(d => d.id !== id))
      .pipe(switchMap(() => of(id)));
  }

  uid(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}
