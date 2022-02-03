import { Injectable } from '@angular/core';
import { StoreService } from './store.service';
import { Observable, of, Subject } from 'rxjs';
import { Ticket } from '../inerfaces/ticket.interface';

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  ticketChange$ = new Subject<Ticket[]>();

  constructor(private storeService: StoreService) {}

  createTicket(ticket: Ticket): Observable<string> {
    ticket.id = this.uid();
    const tickets = [...this.storeService.tickets, ticket];
    this.setStorageAndStore(tickets);
    return of(ticket.id);
  }

  updateTicket(ticket: Ticket): Observable<string> {
    for (let i = 0; this.storeService.tickets.length > i; i++ ) {
      if (this.storeService.tickets[i].id === ticket.id) {
        this.storeService.tickets[i] = ticket;
        break;
      }
    }
    this.setStorageAndStore(this.storeService.tickets);
    return of(ticket.id);
  }

  deleteTicket(ids: string[]): Observable<string[]> {
    ids.forEach(id => this.storeService.tickets = this.storeService.tickets.filter(d => d.id !== id));
    this.setStorageAndStore(this.storeService.tickets);
    return of(ids);
  }

  deleteAllTicket(): Observable<null> {
    this.setStorageAndStore([]);
    return of(null);
  }

  checkStorageAndGetTickets(): Observable<Ticket[]> {
    const tickets = JSON.parse(localStorage.getItem('tickets')) || [];
    if (tickets.length) {
      this.storeService.tickets = tickets;
      return of(tickets);
    }
    return of([]);
  }

  getTicketlist(): Observable<Ticket[]> {
    return of(this.storeService.tickets);
  }

  getTicket(id: string): Observable<Ticket[]> {
    const tickets = JSON.parse(localStorage.getItem('tickets')) || [];
    return of(tickets.filter(ticket => ticket.id === id));
  }

  getCitiesList(): Observable<string[]> {
    return of(this.storeService.citiesList);
  }

  calculateRoutes(tickets: Ticket[]): Set<string> {
    // Алгоритм начало
    tickets.sort((a: Ticket, b: Ticket) => (new Date(a.dateOfArrival).getTime() - new Date(b.dateOfDeparture).getTime()));

    const routes: Ticket[] = [];
    tickets.forEach(ticket => {
      routes.push(ticket);
      // Записываем в переменную последний билет
      const currentTicket = ticket;

      // ф-ия находит среди имеющихся маршрутов пересадки и возращает только уникальные значения
      recursyFind(routes, currentTicket);
    });

    // tslint:disable-next-line:typedef
    function recursyFind(routesTicket: Ticket[], currentTicket: Ticket) {

      // ищем в имеющихся маршрутах возможность пересадки по текущему билету
      routesTicket.forEach((ticketFilter) => {
          if (ticketFilter.placeOfArrival === currentTicket.placeOfDeparture &&
            ticketFilter.dateOfArrival < currentTicket.dateOfDeparture &&
            ticketFilter.placeOfDeparture !== currentTicket.placeOfArrival
          ) {

            // нашли возможность пересадки, пушим в маршруты
            routesTicket.push({
              placeOfDeparture: ticketFilter.placeOfDeparture,
              placeOfArrival: currentTicket.placeOfArrival,
              dateOfDeparture: ticketFilter.dateOfDeparture,
              dateOfArrival: currentTicket.dateOfArrival,
            });
            recursyFind(routesTicket, ticketFilter);
          }
      });
    }

    // Только уникальные значения попадают в маршруты
    return new Set(routes.map(route => `${route.placeOfDeparture} - ${route.placeOfArrival}`));
    // Алгоритм конец
  }


  private setStorageAndStore(tickets: Ticket[]): void {
    this.setStorage(tickets);
    this.storeService.tickets = tickets;
    this.ticketChange$.next(tickets);
  }

  private uid(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  private setStorage(tickets: Ticket[]): void {
    localStorage.setItem('tickets', JSON.stringify(tickets));
  }
}
