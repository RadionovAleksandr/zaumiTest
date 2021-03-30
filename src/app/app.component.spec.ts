import { ComponentFixture, TestBed } from '@angular/core/testing';
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

    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('it get cites', () => {

    const ticket = {
      id: '1', placeOfDeparture: '',
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


});
