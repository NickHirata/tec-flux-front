import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  private apiUrl = 'http://localhost:5000/chat';

  constructor(private http: HttpClient) {}

  sendMessage(prompt: string, userId: string | null = null): Observable<any> {
    const body = userId ? { prompt, usuario_id: userId } : { prompt };
    return this.http.post<any>(this.apiUrl, body);
  }
}
