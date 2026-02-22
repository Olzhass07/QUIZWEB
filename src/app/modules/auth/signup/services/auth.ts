import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const BASIC_URl = 'http://localhost:8080/';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  constructor(private http: HttpClient) { }

  register(data): Observable<any> {
    return this.http.post(BASIC_URl + 'api/auth/sign-up', data);
  }
  login(loginRequest: any): Observable<any> {
    return this.http.post(BASIC_URl + 'api/auth/login', loginRequest);
  }

  getProfile(userId: string): Observable<any> {
    return this.http.get(BASIC_URl + `api/auth/profile/${userId}`);
  }

  updateProfile(userId: string, profileData: any): Observable<any> {
    return this.http.put(BASIC_URl + `api/auth/profile/${userId}`, profileData);
  }

  changePassword(changePasswordData: any): Observable<any> {
    return this.http.put(BASIC_URl + 'api/auth/profile/change-password', changePasswordData);
  }
}
