import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormTicketComponent } from './form-ticket.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';

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

  it('should make Event$ with data', () => {
    component.form = new FormGroup({
      placeOfDeparture: new FormControl('1', Validators.required),
      dateOfDeparture: new FormControl('1', Validators.required),
      placeOfArrival: new FormControl('1', Validators.required),
      dateOfArrival: new FormControl('1', Validators.required),
    });

    let result = null;
    component.saveTicketEvent$.subscribe(v => {
      result = v;
      expect(result).toBe('1');
    });
    component.submit();

  });
});
