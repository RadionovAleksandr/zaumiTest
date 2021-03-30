import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { TicketService } from './services/ticket.service';
import { ITicket } from './inerfaces/ticket.interface';
import { StoreService } from './services/store.service';
import { Observable, Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { FormTicketComponent } from './form-ticket/form-ticket.component';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit, OnDestroy {
  citiesData: string[];
  destroy$ = new Subject();
  editId: string | null = null;
  ticketslist: ITicket[] = [];
  ticketRoutes: Set<string>;

  constructor(
    private ticketService: TicketService,
    private storeService: StoreService,
    private cd: ChangeDetectorRef,
    private modalService: NzModalService,
  ) {
  }

  ngOnInit(): void {
    this.getCities();
    this.getTickets();

    // TODO: костыль
    this.ticketService.updateTicket$.subscribe((data: ITicket) => this.saveTicket(data));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getCities(): void {
    this.ticketService.getCitiesData()
    .pipe(takeUntil(this.destroy$))
    .subscribe(cities => this.citiesData = cities);
  }

  getTickets(): void {
    this.ticketService.checkStorageAndGetTickets()
    .pipe(takeUntil(this.destroy$))
    .subscribe((tickets: ITicket[]) => {
      this.ticketslist = tickets;
      this.ticketRoutes = this.getRoutes(tickets);
      this.cd.detectChanges();
    });
  }

  saveTicket(ticket: ITicket): void {
    const req: Observable<string> = ticket.id
      ? this.ticketService.updateTicket(ticket)
      : this.ticketService.createTicket(ticket);

    req.pipe(
      takeUntil(this.destroy$),
      switchMap(() => this.ticketService.getTicketslist())
    )
    .subscribe((tickets: ITicket[]) => {
      this.ticketslist = tickets;
      this.ticketRoutes = this.getRoutes(tickets);
      this.cd.detectChanges();
    });
  }

  deleteTicket(ids?: string[]): void {
    const req: Observable<string[]> = ids
    ? this.ticketService.deleteTicket(ids)
    : this.ticketService.deleteTicket(this.ticketslist.map(ticket => ticket.id));

    req
    .pipe(takeUntil(this.destroy$),
      switchMap(() => this.ticketService.getTicketslist())
    ).subscribe((tickets) => {
      this.ticketslist = tickets;
      this.ticketRoutes = this.getRoutes(tickets);
      this.cd.detectChanges();
    });
  }

  editTicket(id: string): void {
    this.ticketService.getTicket(id)
    .subscribe((ticket: ITicket[]) => {
      const modalRef = this.modalService.create({
        nzContent: FormTicketComponent,
        nzWidth: 500,
        nzComponentParams: { data: ticket[0], citiesData: this.citiesData },
        nzOnOk: () => modalRef.getContentComponent().submit()
      });
    });
  }

  private getRoutes(tickets: ITicket[]): Set<string> {
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
}
