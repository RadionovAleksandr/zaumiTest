import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { TicketService } from './services/ticket.service';
import { TicketInterface } from './inerfaces/ticket.interface';
import { StoreService } from './services/store.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

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

  constructor(
    private ticketService: TicketService,
    private storeService: StoreService
  ) {
  }

  ngOnInit(): void {
    this.citiesData = this.storeService.citiesData;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  createTicket(ticket: TicketInterface): void {
    this.ticketService.createTicket(ticket)
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => console.log(data));
  }
}
