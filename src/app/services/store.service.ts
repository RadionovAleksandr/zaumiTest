import { Injectable } from '@angular/core';
import { ITicket } from '../inerfaces/ticket.interface';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  citiesData: string[] = ['Новосибирск', 'Москва', 'Париж'];
  tickets: ITicket[] = [
    {
      dateOfArrival: '2021-03-26T14:00',
      dateOfDeparture: '2021-03-26T12:00',
      id: 'r9q0mxj2f',
      placeOfArrival: 'Москва',
      placeOfDeparture: 'Новосибирск',
    },
    {
      dateOfArrival: '2021-03-26T18:00',
      dateOfDeparture: '2021-03-26T20:00',
      id: '08q0mwj2f',
      placeOfArrival: 'Париж',
      placeOfDeparture: 'Москва',
    },

  ];
  constructor() { }

  getCitiesData(): Observable<string[]> {
    return of(this.citiesData);
  }

  getTiketslist(): Observable<ITicket[]> {
    return of(this.tickets);
  }
}
