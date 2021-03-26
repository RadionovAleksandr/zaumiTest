import { Injectable } from '@angular/core';
import { ITicket } from '../inerfaces/ticket.interface';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  citiesData: string[] = ['Новосибирск', 'Москва', 'Париж'];
  tickets: ITicket[] = [];
  constructor() { }

  getCitiesData(): Observable<string[]> {
    return of(this.citiesData);
  }

  getTiketslist(): Observable<ITicket[]> {
    return of(this.tickets);
  }
}
