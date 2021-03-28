import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ITicket } from '../inerfaces/ticket.interface';

@Component({
  selector: 'app-form-ticket',
  templateUrl: './form-ticket.component.html',
  styleUrls: ['./form-ticket.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormTicketComponent implements OnInit {
  @Input() citiesData: string[] = [];
  @Input() data: ITicket;
  @Output() saveTicketEvent$ = new EventEmitter<ITicket>();
  mode = 'create';
  form: FormGroup;
  layout: { [klass: string]: any; };

  constructor(private cd: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      placeOfDeparture: new FormControl(undefined, Validators.required),
      dateOfDeparture: new FormControl(undefined, Validators.required),
      placeOfArrival: new FormControl(undefined, Validators.required),
      dateOfArrival: new FormControl(undefined, Validators.required),
    });
    if (this.data) {
      this.mode = 'update';
      this.form.patchValue(this.data);
      this.cd.detectChanges();
    }

    this.layout = {
      horizontal: this.mode === 'create',
      vertical: this.mode === 'edit',
    };

    // TODO: подумать над решением
    // this.form.get('dateOfDeparture').valueChanges
    // .subscribe((data: string) => {
    //     debugger
    //     this.form.get('dateOfArrival').setValidators());
    //   });
  }

  submit(): void {
    const dateOfDeparture = new Date(this.form.get('dateOfDeparture').value);
    const dateOfArrival = new Date(this.form.get('dateOfArrival').value);
    if (!this.form.valid || dateOfDeparture > dateOfArrival) {
      return alert('введите корректные данные');
    }
    if (this.data) {
      this.saveTicketEvent$.emit({ ...this.form.value, id: this.data.id });
    } else {
      this.saveTicketEvent$.emit(this.form.value);
    }
  }
}
