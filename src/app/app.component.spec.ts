import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { TicketService } from './services/ticket.service';
import { StoreService } from './services/store.service';
import { ChangeDetectorRef } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { of } from 'rxjs';
import { ITicket } from './inerfaces/ticket.interface';

describe('AppComponent', () => {
  let component: AppComponent;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [
        AppComponent
      ],
    }).compileComponents();

    const cd: ChangeDetectorRef = null;
    const modalService = new NzModalService(null, null, null, null);
    component = new AppComponent(new TicketService(null), new StoreService(), cd, modalService);

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('it should get cites and tickets', () => {

    const ticket = {
      id: '1',
      placeOfDeparture: '',
      dateOfDeparture: '',
      placeOfArrival: '',
      dateOfArrival: '',
    };

    const cities: string[] = ['', '', '', ''];
    const tickets: ITicket[] = [ticket, ticket, ticket, ticket];
    spyOn(component, 'getCities').and.callFake(() => of(cities).subscribe((respCities => component.citiesData = respCities)));
    spyOn(component, 'getTickets').and.callFake(() => of(tickets).subscribe((respTickets => component.ticketslist = respTickets)));

    component.ngOnInit();
    expect(component.citiesData.length).toBe(4);
    expect(component.ticketslist.length).toBe(4);
  });

  it('it should update ticket', () => {
    const updateValue = '2021-03-26T11:00';

    const ticket = {
      id: '1',
      placeOfDeparture: 'Париж',
      dateOfDeparture: '2021-03-26T08:00',
      placeOfArrival: 'Копенгаген',
      dateOfArrival: updateValue,
    };

    const tickets: ITicket[] = [
      {
        id: '1',
        dateOfArrival: '2021-03-26T10:00',
        dateOfDeparture: '2021-03-26T08:00',
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

    spyOn(component, 'saveTicket').and.callFake(() => {
      tickets.forEach((tic: ITicket) => {
        if (tic.id === ticket.id) {
          tic.dateOfArrival = ticket.dateOfArrival;
        }
      });
      component.ticketRoutes = component.getRoutes(tickets);
    });

    of(tickets).subscribe((ticketslist => component.ticketslist = ticketslist));
    component.saveTicket(ticket);
    expect(component.ticketslist.length).toBe(5);
    expect(component.ticketslist[0].dateOfArrival).toBe(updateValue);
    expect(component.ticketRoutes.size).toBe(11);
  });


  it('it should update create', () => {
    const id = '1';
    const ticket: ITicket = {
      placeOfDeparture: 'Париж',
      dateOfDeparture: '2021-03-26T08:00',
      placeOfArrival: 'Копенгаген',
      dateOfArrival:  '2021-03-26T11:00',
    };

    const tickets: ITicket[] = [];

    spyOn(component, 'saveTicket').and.callFake(() => {
      ticket.id = id;
      tickets.push(ticket);
    });

    of(tickets).subscribe((ticketslist => component.ticketslist = ticketslist));
    component.saveTicket(ticket);
    expect(component.ticketslist.length).toBe(1);
    expect(component.ticketslist[0].id).toBe(id);
  });

})
;
