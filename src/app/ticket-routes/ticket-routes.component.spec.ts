import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketRoutesComponent } from './ticket-routes.component';

describe('TicketRoutesComponent', () => {
  let component: TicketRoutesComponent;
  let fixture: ComponentFixture<TicketRoutesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TicketRoutesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketRoutesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
