import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CreateTicketComponent } from './create-ticket/create-ticket.component';
import { EditTicketComponent } from './edit-ticket/edit-ticket.component';
import { TicketComponent } from './ticket/ticket.component';
import { TicketRoutesComponent } from './ticket-routes/ticket-routes.component';

@NgModule({
  declarations: [
    AppComponent,
    CreateTicketComponent,
    EditTicketComponent,
    TicketComponent,
    TicketRoutesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
