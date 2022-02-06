import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { TicketService } from './services/ticket.service';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FormTicketComponent } from './form-ticket/form-ticket.component';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Ticket } from './store/models/ticket.models';
import { Store } from '@ngrx/store';
import {
  clearTickets,
  createTicket,
  deleteTicket,
  updateTicket
} from './store/actions/ticket.actions';
import {selectCities, selectTickets} from './store/selectors';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit, OnDestroy {
  cities: string[];
  cities$: Observable<string[]>;
  destroy$ = new Subject();
  ticketlist: Ticket[] = [];
  ticketRoutes: Set<string>;

  constructor(
    private ticketService: TicketService,
    private modalService: NzModalService,
    private store: Store,
  ) {}
  ngOnInit(): void {
    this.getCities();
    this.getTickets();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getCities(): void {
    this.store.select(selectCities).pipe(takeUntil(this.destroy$))
     .subscribe(cities => this.cities = cities);
  }

  getTickets(): void {
    this.store.select(selectTickets)
      .pipe(takeUntil(this.destroy$))
      .subscribe((tickets: Ticket[]) => {
        this.ticketlist = tickets;
        this.ticketRoutes = this.ticketService.calculateRoutes(tickets);
    });
  }

  saveTicket(ticket: Ticket): void {
    ticket.id
      ? this.store.dispatch(updateTicket({ ticket }))
      : this.store.dispatch(createTicket({ ticket }));
  }

  deleteTicket(ids?: Ticket['id'][]): void {
    ids.length
    ? this.store.dispatch(deleteTicket({ id: ids[0] }))
    : this.store.dispatch(clearTickets());
  }

  editTicket(id: string): void {
      const ticket = this.ticketlist.find(ticketItem => ticketItem.id === id);
      const modalRef  = this.modalService.create({
        nzContent: FormTicketComponent,
        nzWidth: 500,
        nzComponentParams: { data: ticket, citiesData: this.cities },
        nzOnOk: () => {
          const formTicketInstance: FormTicketComponent  = modalRef.componentInstance;
          formTicketInstance.saveTicketEvent$
            .pipe(takeUntil(this.destroy$)).subscribe((data) => this.saveTicket(data));
          formTicketInstance.submit();
        },
      });
  }

  createTicket(): void {
      const modalRef  = this.modalService.create({
        nzTitle: 'Мой будущий билет',
        nzContent: FormTicketComponent,
        nzWidth: 500,
        nzComponentParams: { citiesData: this.cities } as any,
        nzOnOk: () => {
          const formTicketInstance: FormTicketComponent = modalRef.componentInstance;
          formTicketInstance.saveTicketEvent$
            .pipe(takeUntil(this.destroy$)).subscribe((data) => this.saveTicket(data));
          formTicketInstance.submit();
        },
      });
  }
}
