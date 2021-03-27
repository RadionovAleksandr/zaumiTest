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
  tiketslist: ITicket[] = [];
  ticketRoutes: string[] = [];

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
      this.tiketslist = tikets;
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
      this.tiketslist = tikets;
      this.cd.detectChanges();
    });
  }

  deleteTicket(id: string): void {
    this.ticketService.deleteTicket(id)
    .pipe(takeUntil(this.destroy$),
      switchMap(() => this.storeService.getTiketslist())
    ).subscribe(() => {
      this.tiketslist = this.tiketslist.filter(d => d.id !== id);
      this.cd.detectChanges();
    });
  }

  getRoutes(tikets: ITicket[]): string[] {
    // Алгоритм начало
    tikets.sort((a: ITicket, b: ITicket) => {
      return (new Date(a.dateOfArrival).getTime() - new Date(b.dateOfDeparture).getTime());
    });

    const routes = [];
    tikets.forEach(ticket => {

      // Записываем в переменную последний билет
      const currentTicket = { city: ticket.placeOfArrival, date: ticket.dateOfArrival };

      routes.push(ticket);

      // ищем в имеющихся маршрутах возможность пересадки по текущему билету
      const transplantTicket = { city: ticket.placeOfDeparture, date: ticket.dateOfDeparture };
      routes.forEach(ticketFilter => {
        if (ticketFilter.placeOfArrival === transplantTicket.city &&
          ticketFilter.dateOfArrival < transplantTicket.date) {
          routes.push({
            placeOfDeparture: ticketFilter.placeOfDeparture,
            placeOfArrival: currentTicket.city,
            dateOfDeparture: ticketFilter.dateOfDeparture,
            dateOfArrival: currentTicket.date,
          });
        }
      });
    });

    return routes.map(route => `${route.placeOfDeparture} - ${route.placeOfArrival}`);
    // Алгоритм конец
  }

  editTicket(id: string): void {

  }
}
