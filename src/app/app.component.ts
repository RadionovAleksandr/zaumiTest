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
  ticketRoutes: any[];

  constructor(
    private ticketService: TicketService,
    private storeService: StoreService,
    private cd: ChangeDetectorRef,
  ) {
  }

  ngOnInit(): void {
    this.getCities();
    this.getTickets();
    this.ticketRoutes = [
      'Новосибирск – Стамбул',
      'Новосибирск – Париж',
      'Москва – Париж',
    ];
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

  editTicket(id: string): void {

  }
}
