import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const BASIC_URL = 'http://localhost:8080/';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: HttpClient) { }

  getApiBaseUrl(): string {
    return BASIC_URL;
  }

  createTest(testDto): Observable<any> {
    return this.http.post(BASIC_URL + 'api/test', testDto);
  }

  getAllTest(): Observable<any> {
    return this.http.get(BASIC_URL + 'api/test');
  }

  addQuestionInTest(questionDto): Observable<any> {
    return this.http.post(BASIC_URL + 'api/test/question', questionDto);
  }

  addQuestionInTestWithImage(questionFormData: FormData): Observable<any> {
    return this.http.post(BASIC_URL + 'api/test/question-with-image', questionFormData);
  }

  getTestQuestions(id: number): Observable<any> {
    return this.http.get(BASIC_URL + `api/test/${id}`);
  }

  getTestResults(): Observable<any> {
    return this.http.get(BASIC_URL + 'api/test-result');
  }

  updateTest(id: number, testDto): Observable<any> {
    return this.http.put(BASIC_URL + `api/test/${id}`, testDto);
  }

  updateQuestion(id: number, questionDto): Observable<any> {
    return this.http.put(BASIC_URL + `api/test/question/${id}`, questionDto);
  }

  updateQuestionWithImage(id: number, questionFormData: FormData): Observable<any> {
    return this.http.put(BASIC_URL + `api/test/question/${id}/with-image`, questionFormData);
  }

  deleteQuestion(id: number): Observable<any> {
    return this.http.delete(BASIC_URL + `api/test/question/${id}`);
  }

  getQuestionById(id: number): Observable<any> {
    return this.http.get(BASIC_URL + `api/test/question-details/${id}`);
  }

  getQuestionImage(id: number): Observable<Blob> {
    return this.http.get(BASIC_URL + `api/test/question/${id}/image`, { responseType: 'blob' });
  }

  deleteTest(id: number): Observable<any> {
    return this.http.delete(BASIC_URL + `api/test/${id}`);
  }
}
