import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ChatbotService } from '../../services/chatbot.service';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    InputTextModule,
    ButtonModule,
    MessageModule

  ],
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.scss']
})
export class ChatbotComponent implements OnInit {
  userInput: string = '';
  messages: { content: string; isUser: boolean }[] = [];
  userId: string | null = '3';

  constructor(private router: Router, private chatbotService: ChatbotService) {}

  ngOnInit() {
    this.chatbotService.sendMessage('inicio', this.userId)
      .subscribe(response => {
        this.messages.push({ content: this.formatResponse(response.response), isUser: false });
        this.userId = null;
      }, error => {
        console.error('Erro ao se comunicar com a API:', error);
        this.messages.push({ content: 'Erro ao se comunicar com a API.', isUser: false });
      });
  }

  sendMessage() {
    if (this.userInput.trim() !== '') {
      this.messages.push({ content: this.userInput, isUser: true });

      const userMessage = this.userInput;
      this.userInput = '';

      this.chatbotService.sendMessage(userMessage)
        .subscribe(response => {
          this.messages.push({ content: this.formatResponse(response.response), isUser: false });
        }, error => {
          console.error('Erro ao se comunicar com a API:', error);
          this.messages.push({ content: 'Erro ao se comunicar com a API.', isUser: false });
        });
    }
  }

  formatResponse(response: string): string {
    // Converte quebras de linha para <br> tags
    return response.replace(/\n/g, '<br>');
  }

  goBack() {
    this.router.navigate(['/']);
  }
}
