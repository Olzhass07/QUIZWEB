import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserStorage } from '../../../../auth/signup/services/user-storage';

const BASIC_URL = "http://localhost:8080/";

@Injectable({
  providedIn: 'root'
})
export class TestService {
  
  constructor(private http: HttpClient) { }

    getAllTest(): Observable<any> {
      return this.http.get(BASIC_URL + 'api/test');
    }

    getTestQuestions(id: number): Observable<any> {
      return this.http.get(BASIC_URL + `api/test/${id}`);
    }

    submitTest(data:any): Observable<any> {
      return this.http.post(BASIC_URL + 'api/test/submit-test', data);
    }
    
    getMyTestResults(): Observable<any> {
      return this.http.get(BASIC_URL + `api/test-result/${UserStorage.getUserID()} `);
    }
}
