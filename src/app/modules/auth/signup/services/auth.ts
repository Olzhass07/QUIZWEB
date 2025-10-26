import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const BASIC_URl = 'http://localhost:8080/';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  constructor(private http:HttpClient) { }

  register(data): Observable<any> {
    return this.http.post(BASIC_URl + 'api/auth/sign-up', data);
}
  }
