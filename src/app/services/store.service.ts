import { Injectable } from '@angular/core';
import { ITicket } from '../inerfaces/ticket.interface';

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  citiesData: string[] = ['Новосибирск', 'Москва', 'Париж'];
  tickets: ITicket[] = [
    // {
    //   dateOfArrival: '2021-03-27T15:00',
    //   dateOfDeparture: '2021-03-27T13:00',
    //   id: 'r9q0mxj2f',
    //   placeOfArrival: 'Москва',
    //   placeOfDeparture: 'Новосибирск',
    // },
    // {
    //   dateOfArrival: '2021-03-26T10:00',
    //   dateOfDeparture: '2021-03-26T08:00',
    //   id: '2eq0mxj2f',
    //   placeOfArrival: 'Москва',
    //   placeOfDeparture: 'Новосибирск',
    // },
    // {
    //   dateOfArrival: '2021-03-26T14:00',
    //   dateOfDeparture: '2021-03-26T12:00',
    //   id: '08q0mwj2f',
    //   placeOfArrival: 'Париж',
    //   placeOfDeparture: 'Москва',
    // },
    // {
    //   dateOfArrival: '2021-03-26T21:00',
    //   dateOfDeparture: '2021-03-26T20:00',
    //   id: '08q0mwj2f',
    //   placeOfArrival: 'Мюнхен',
    //   placeOfDeparture: 'Париж',
    // },
    // {
    //   dateOfArrival: '2021-03-26T20:00',
    //   dateOfDeparture: '2021-03-26T18:00',
    //   id: '08qdf9j2f',
    //   placeOfArrival: 'Копенгаген',
    //   placeOfDeparture: 'Москва',
    // },

  ];
}
