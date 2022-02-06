import { Injectable } from '@angular/core';
import { Ticket } from '../store/models/ticket.models';

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  checkStorageAndGetTickets(initialState: Ticket[]): Ticket[] {
    const tickets = JSON.parse(localStorage.getItem('tickets')) || [];
    if (tickets.length) {
      return tickets;
    }
    return initialState;
  }

  setStorage(tickets: Ticket[]): void {
    localStorage.setItem('tickets', JSON.stringify(tickets));
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
}
