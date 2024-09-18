import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class CadastroService {
  private apiUrl = 'http://localhost:8081';  // Substitua pelo URL do seu backend
  constructor(private http: HttpClient) {}
  getDepartamentos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/departments`);
  }
  getCategorias(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/categories`);
  }
  getChamados(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/chamados`);
  }
  salvarChamado(chamado: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/chamados`, chamado);
  }
  getChamadosByUser(userId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/chamados?userId=${userId}`);
  }
}