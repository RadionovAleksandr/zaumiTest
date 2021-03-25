import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { StoreService } from '../services/store.service';
import { FormControl, FormGroup } from '@angular/forms';
import { TicketInterface } from '../inerfaces/ticket.interface';

@Component({
  selector: 'app-create-ticket',
  templateUrl: './create-ticket.component.html',
  styleUrls: ['./create-ticket.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateTicketComponent implements OnInit {
  @Input() citiesData: string[];

  @Output() createTicketEvent$ = new EventEmitter<TicketInterface>();
  form: FormGroup;

  constructor(private storeService: StoreService) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      placeOfDeparture: new FormControl(),
      dateOfDeparture: new FormControl(),
      placeOfArrival: new FormControl(),
      dateOfArrival: new FormControl(),
    });

  }

  createTicket(): void {
    console.log(this.form.value);
    this.createTicketEvent$.emit(this.form.value);
  }
}
