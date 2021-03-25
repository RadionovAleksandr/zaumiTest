import { Injectable } from '@angular/core';
import { TicketInterface } from '../inerfaces/ticket.interface';

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  citiesData: string[] = ['Новосибирск', 'Москва', 'Париж'];
  tickets: TicketInterface[] = [];
  constructor() { }
}
