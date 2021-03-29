import { Injectable } from '@angular/core';
import { StoreService } from './store.service';
import { ITicket } from '../inerfaces/ticket.interface';
import { Observable, of, Subject } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  updateTicket$ = new Subject();

  constructor(private storeService: StoreService) {
  }

  createTicket(ticket: ITicket): Observable<string> {
    ticket.id = this.uid();
    this.storeService.tickets.push(ticket);
    return of(ticket.id);
  }

  updateTicket(ticket: ITicket): Observable<string> {
    for (let i = 0; this.storeService.tickets.length > i; i++ ) {
      if (this.storeService.tickets[i].id === ticket.id) {
        this.storeService.tickets[i] = ticket;
        break;
      }
    }
    return of(ticket.id);
  }

  deleteTicket(id: string): Observable<string> {
    return of(this.storeService.tickets = this.storeService.tickets.filter(d => d.id !== id))
      .pipe(switchMap(() => of(id)));
  }

  checkStorageAndGetTickets(): Observable<ITicket[]> {
    const tickets = JSON.parse(localStorage.getItem('tickets')) || [];
    if (tickets.length) {
      this.storeService.tickets = tickets;
      return of(tickets);
    }
    return this.getTicketslist();
  }

  getTicketslist(): Observable<ITicket[]> {
    this.setStorage(this.storeService.tickets);
    return of(this.storeService.tickets);
  }

  getTicket(id: string): Observable<ITicket[]> {
    const tickets = JSON.parse(localStorage.getItem('tickets')) || [];
    return of(tickets.filter(ticket => ticket.id === id));
  }

  getCitiesData(): Observable<string[]> {
    return of(this.storeService.citiesData);
  }

  private uid(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  private setStorage(tickets: ITicket[]): void {
    localStorage.setItem('tickets', JSON.stringify(tickets));
  }
}
