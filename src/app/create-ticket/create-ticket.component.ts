import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ITicket } from '../inerfaces/ticket.interface';

@Component({
  selector: 'app-create-ticket',
  templateUrl: './create-ticket.component.html',
  styleUrls: ['./create-ticket.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateTicketComponent implements OnInit {
  @Input() citiesData: string[] = [];

  @Output() createTicketEvent$ = new EventEmitter<ITicket>();
  form: FormGroup;

  constructor() {}

  ngOnInit(): void {
    this.form = new FormGroup({
      placeOfDeparture: new FormControl(undefined, Validators.required),
      dateOfDeparture: new FormControl(undefined, Validators.required),
      placeOfArrival: new FormControl(undefined, Validators.required),
      dateOfArrival: new FormControl(undefined, Validators.required),
    });

    // TODO: подумать над решением
    // this.form.get('dateOfDeparture').valueChanges
    // .subscribe((data: string) => {
    //     debugger
    //     this.form.get('dateOfArrival').setValidators());
    //   });
  }

  createTicket(): void {
    const dateOfDeparture = new Date(this.form.get('dateOfDeparture').value);
    const dateOfArrival = new Date(this.form.get('dateOfArrival').value);
    if (!this.form.valid || dateOfDeparture > dateOfArrival) {
      return console.log('введите корректные данные');
    }
    console.log(this.form.value);
    this.createTicketEvent$.emit(this.form.value);
  }
}
