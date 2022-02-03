import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Ticket } from '../inerfaces/ticket.interface';

@Component({
  selector: 'app-form-ticket',
  templateUrl: './form-ticket.component.html',
  styleUrls: ['./form-ticket.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormTicketComponent implements OnInit {
  @Input() citiesData: string[] = [];
  @Input() data: Ticket;
  @Output() saveTicketEvent$ = new EventEmitter<Ticket>();
  form: FormGroup;

  constructor(private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      placeOfDeparture: new FormControl(undefined, Validators.required),
      dateOfDeparture: new FormControl(undefined, Validators.required),
      placeOfArrival: new FormControl(undefined, Validators.required),
      dateOfArrival: new FormControl(undefined, Validators.required),
    });

    if (this.data) {
      this.form.patchValue(this.data);
      this.cd.detectChanges();
    }

    this.saveTicketEvent$.subscribe(data => {
      this.form.patchValue(data);
      this.cd.detectChanges();
    });
  }

  submit(): void {
    if (!this.isCheckValid()) {
      return alert('введите корректные данные');
    }

    this.saveTicketEvent$.emit({ ...this.form.value, id: this.data?.id });
    this.form.patchValue({});
  }

  isCheckValid(): boolean {
    const dateOfDeparture = new Date(this.form.get('dateOfDeparture').value);
    const dateOfArrival = new Date(this.form.get('dateOfArrival').value);
    const placeOfDeparture = this.form.get('placeOfDeparture').value;
    const placeOfArrival = this.form.get('placeOfArrival').value;
    return !(!this.form.valid || dateOfDeparture > dateOfArrival || placeOfDeparture === placeOfArrival);
  }
}
