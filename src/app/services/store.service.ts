import { Injectable } from '@angular/core';
import { Ticket } from '../inerfaces/ticket.interface';

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  citiesList: string[] = ['Новосибирск', 'Москва', 'Париж', 'Мюнхен', 'Копенгаген'];
  tickets: Ticket[] = [
    {
      dateOfArrival: '2021-03-26T10:00',
      dateOfDeparture: '2021-03-26T08:00',
      id: '2eq0mxj2f',
      placeOfArrival: 'Москва',
      placeOfDeparture: 'Новосибирск',
    },
    {
      dateOfArrival: '2021-03-26T14:00',
      dateOfDeparture: '2021-03-26T12:00',
      id: '08q0mwj2f',
      placeOfArrival: 'Париж',
      placeOfDeparture: 'Москва',
    },
    {
      dateOfArrival: '2021-03-26T21:00',
      dateOfDeparture: '2021-03-26T20:00',
      id: '2wq0mwj2f',
      placeOfArrival: 'Мюнхен',
      placeOfDeparture: 'Париж',
    },
    {
      dateOfArrival: '2021-03-26T20:00',
      dateOfDeparture: '2021-03-26T18:00',
      id: '08qdf9j2f',
      placeOfArrival: 'Копенгаген',
      placeOfDeparture: 'Мюнхен',
    },
    {
      dateOfArrival: '2021-03-26T23:00',
      dateOfDeparture: '2021-03-26T22:00',
      id: '2wq0mwj2f',
      placeOfArrival: 'Новосибирск',
      placeOfDeparture: 'Мюнхен',
    },
  ];
}
