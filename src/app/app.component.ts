import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { TicketService } from './services/ticket.service';
import { StoreService } from './services/store.service';
import { Observable, Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { FormTicketComponent } from './form-ticket/form-ticket.component';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Ticket } from './inerfaces/ticket.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit, OnDestroy {
  citiesData: string[];
  destroy$ = new Subject();
  ticketlist: Ticket[] = [];
  ticketRoutes: Set<string>;

  constructor(
    private ticketService: TicketService,
    private storeService: StoreService,
    private cd: ChangeDetectorRef,
    private modalService: NzModalService,
  ) {}

  ngOnInit(): void {
    this.getCities();
    this.getTickets();

    this.ticketService.ticketChange$.pipe(takeUntil(this.destroy$)).subscribe(() => this.getTickets());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getCities(): void {
    this.ticketService.getCitiesList()
    .pipe(takeUntil(this.destroy$))
    .subscribe(cities => this.citiesData = cities);
  }

  getTickets(): void {
    this.ticketService.checkStorageAndGetTickets()
    .pipe(takeUntil(this.destroy$))
    .subscribe((tickets: Ticket[]) => {
      this.ticketlist = tickets;
      this.ticketRoutes = this.ticketService.calculateRoutes(tickets);
      this.cd.detectChanges();
    });
  }

  saveTicket(ticket: Ticket): void {
    const req: Observable<string> = ticket.id
      ? this.ticketService.updateTicket(ticket)
      : this.ticketService.createTicket(ticket);

    req.pipe(
      takeUntil(this.destroy$),
      switchMap(() => this.ticketService.getTicketlist())
    )
    .subscribe((tickets: Ticket[]) => {
      this.ticketlist = tickets;
      this.ticketRoutes = this.ticketService.calculateRoutes(tickets);
      this.cd.detectChanges();
    });
  }

  deleteTicket(ids?: string[]): void {
    const req: Observable<string[]> = ids
    ? this.ticketService.deleteTicket(ids)
    : this.ticketService.deleteAllTicket();

    req
    .pipe(takeUntil(this.destroy$),
      switchMap(() => this.ticketService.getTicketlist())
    ).subscribe((tickets) => {
      this.ticketlist = tickets;
      this.ticketRoutes = this.ticketService.calculateRoutes(tickets);
      this.cd.detectChanges();
    });
  }

  editTicket(id: string): void {
    this.ticketService.getTicket(id)
    .subscribe((ticket: Ticket[]) => {
      const modalRef  = this.modalService.create({
        nzContent: FormTicketComponent,
        nzWidth: 500,
        nzComponentParams: { data: ticket[0], citiesData: this.citiesData },
        nzOnOk: () => {
          const formTicketInstance: FormTicketComponent  = modalRef.componentInstance;
          formTicketInstance.saveTicketEvent$
            .pipe(takeUntil(this.destroy$)).subscribe((data) => this.saveTicket(data));
          formTicketInstance.submit();
        },
      });
    });
  }

  createTicket(): void {
      const modalRef  = this.modalService.create({
        nzTitle: 'Мой будущий билет',
        nzContent: FormTicketComponent,
        nzWidth: 500,
        nzComponentParams: { citiesData: this.citiesData },
        nzOnOk: () => {
          const formTicketInstance: FormTicketComponent  = modalRef.componentInstance;
          formTicketInstance.saveTicketEvent$
            .pipe(takeUntil(this.destroy$)).subscribe((data) => this.saveTicket(data));
          formTicketInstance.submit();
        },
      });

  }
}
