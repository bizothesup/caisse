import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecetteService {
  private apiUrl: string;
  constructor(protected httpClient: HttpClient) { }

  address() {
    return './assets';
  }

  public findAll() {
    const url = encodeURI(this.address() + "/recettes.json");
    return this.httpClient
      .get<any>(url);
  }
}
