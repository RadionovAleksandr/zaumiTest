import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  uid(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}
