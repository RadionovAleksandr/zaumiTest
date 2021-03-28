import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { TicketService } from './services/ticket.service';
import { ITicket } from './inerfaces/ticket.interface';
import { StoreService } from './services/store.service';
import { Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'test';
  citiesData: string[];
  destroy$ = new Subject();
  editId: string | null = null;
  ticketslist: ITicket[] = [];
  ticketRoutes: Set<string>;

  constructor(
    private ticketService: TicketService,
    private storeService: StoreService,
    private cd: ChangeDetectorRef,
  ) {
  }

  ngOnInit(): void {
    this.getCities();
    this.getTickets();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getCities(): void {
    this.storeService.getCitiesData()
    .pipe(takeUntil(this.destroy$))
    .subscribe(cities => this.citiesData = cities);
  }

  getTickets(): void {
    this.storeService.getTiketslist()
    .pipe(takeUntil(this.destroy$))
    .subscribe(tikets => {
      this.ticketslist = tikets;
      this.ticketRoutes = this.getRoutes(tikets);
      this.cd.detectChanges();
    });
  }

  createTicket(ticket: ITicket): void {
    this.ticketService.createTicket(ticket)
    .pipe(takeUntil(this.destroy$),
      switchMap(() => this.storeService.getTiketslist())
    )
    .subscribe(tikets => {
      this.ticketslist = tikets;
      this.cd.detectChanges();
    });
  }

  deleteTicket(id: string): void {
    this.ticketService.deleteTicket(id)
    .pipe(takeUntil(this.destroy$),
      switchMap(() => this.storeService.getTiketslist())
    ).subscribe(() => {
      this.ticketslist = this.ticketslist.filter(d => d.id !== id);
      this.cd.detectChanges();
    });
  }

  getRoutes(tickets: ITicket[]): Set<string> {
    // Алгоритм начало
    tickets.sort((a: ITicket, b: ITicket) => {
      return (new Date(a.dateOfArrival).getTime() - new Date(b.dateOfDeparture).getTime());
    });

    const routes = [];
    tickets.forEach(ticket => {
      routes.push(ticket);
      // Записываем в переменную последний билет
      const currentTickets = [{
        arrival: { city: ticket.placeOfArrival, date: ticket.dateOfArrival },
        departure: { city: ticket.placeOfDeparture, date: ticket.dateOfDeparture },
      }];

      // ф-ия находит среди имеющихся маршрутов пересадки и возращает только уникальные значения
      recursyFind(routes, currentTickets);
    });

    // tslint:disable-next-line:typedef
    function recursyFind(routesTicket, currentTickets) {
      const newCurrentTicket = [];

      // ищем в имеющихся маршрутах возможность пересадки по текущему билету
      routesTicket.forEach((ticketFilter, index) => {
        currentTickets.forEach(ticket => {
          if (ticketFilter.placeOfArrival === ticket.departure.city &&
            ticketFilter.dateOfArrival < ticket.departure.date) {

            // нашли возможность пересадки, пушим в маршруты
            routesTicket.push({
              placeOfDeparture: ticketFilter.placeOfDeparture,
              placeOfArrival: ticket.arrival.city,
              dateOfDeparture: ticketFilter.dateOfDeparture,
              dateOfArrival: ticket.arrival.date,
            });

            // В результате пересадки сформировались "Новые" билеты, их тоже нужно проверить на возможность пересадки
            newCurrentTicket.push({
              arrival: { city: ticketFilter.placeOfArrival, date: ticketFilter.dateOfArrival },
              departure: { city: ticketFilter.placeOfDeparture, date: ticketFilter.dateOfDeparture },
            });

            if (index === routesTicket[index]) {
              return recursyFind(routesTicket, newCurrentTicket);
            }
          }
        });
      });
    }

    // Только уникальные значения попадают в маршруты
    return new Set(routes.map(route => `${route.placeOfDeparture} - ${route.placeOfArrival}`));
    // Алгоритм конец
  }

  editTicket(id: string): void {

  }
}
