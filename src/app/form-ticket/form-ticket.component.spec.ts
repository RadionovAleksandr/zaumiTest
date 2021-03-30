import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormTicketComponent } from './form-ticket.component';

describe('CreateTicketComponent', () => {
  let component: FormTicketComponent;
  let fixture: ComponentFixture<FormTicketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormTicketComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should make Event$', () => {

    let result = null;
    component.saveTicketEvent$.subscribe(v => result = v);
    component.submit();
  });
});
