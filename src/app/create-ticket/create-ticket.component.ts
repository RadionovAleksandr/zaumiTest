import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { StoreService } from '../store.service';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-create-ticket',
  templateUrl: './create-ticket.component.html',
  styleUrls: ['./create-ticket.component.scss']
})
export class CreateTicketComponent implements OnInit {
  citiesData: string[];
  @Output() createTicketEvent$ = new EventEmitter<any>();
  form: FormGroup;

  constructor(private storeService: StoreService) { }

  ngOnInit(): void {
    this.citiesData = this.storeService.citiesData;
    this.form = new FormGroup({
      placeOfDeparture: new FormControl(),
      dateOfDeparture: new FormControl(),
      placeOfArrival: new FormControl(),
      dateOfArrival: new FormControl(),
    });

  }

  createTicket(): void {
    console.log('Start createTicket');
    this.createTicketEvent$.emit();
  }
}
