import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
// Базовый Сервис - обертка для HttpClient
export class HttpServiceService {
  protected options = { headers: {'Content-Type': 'application/json'}, withCredentials: true };
  protected baseUrl = 'https://jsonplaceholder.typicode.com/'; // Базовый путь для всех сервисов

  constructor(private http: HttpClient) { }

  // Базовый метод для получения данных с сервера GET-ом
  get<T>(url: string): Observable<T> {
    url = this.baseUrl + url;
    return this.http.get<T>(url, this.options);
  }

  // Базовый метод для получения данных с сервера POST-ом
  post<T>(url: string, data?: any): Observable<T> {
    url = this.baseUrl + url;
    return this.http.post<T>(url, JSON.stringify(data), this.options);
  }
}
