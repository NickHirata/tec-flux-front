// funcionarios.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
// Remova as importações de interfaces

@Injectable({
  providedIn: 'root'
})
export class FuncionariosService {
  private apiUrl = 'http://localhost:8081'; // Defina a URL diretamente aqui ou ajuste conforme necessário

  constructor(private http: HttpClient) { }

  /**
   * Recupera a lista paginada de funcionários para uma empresa específica
   * @param companyId ID da empresa
   * @param page Número da página (opcional)
   * @param size Tamanho da página (opcional)
   */
  getEmployeesByCompany(companyId: number, page: number = 0, size: number = 20): Observable<any> {
    const url = `${this.apiUrl}/user/company/${companyId}`;
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<any>(url, { params });
  }

  /**
   * Adiciona um novo funcionário
   * @param employee Dados do funcionário
   */
  addEmployee(employee: any): Observable<any> {
    const url = `${this.apiUrl}/auth/signup`;
    return this.http.post(url, employee);
  }

  // Outros métodos (update, delete, etc.) podem ser adicionados aqui
}
