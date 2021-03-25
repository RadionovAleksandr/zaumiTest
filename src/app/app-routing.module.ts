import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { CreateTicketComponent } from './create-ticket/create-ticket.component';
import { EditTicketComponent } from './edit-ticket/edit-ticket.component';

const routes: Routes = [
  {
    path: '',
    component: AppComponent,
  },
  {
    path: 'createTicket',
    component: CreateTicketComponent,
  },
  {
    path: 'editTicket/:id',
    component: EditTicketComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
