import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CarouselModule } from 'primeng/carousel';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CarouselModule, ButtonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  planos = [
    {
      nome: 'Plano Básico',
      preco: 99.99,
      imagem: 'https://static.vecteezy.com/ti/vetor-gratis/p3/2580439-assinatura-planos-rgb-color-icon-vetor.jpg'
    },
    {
      nome: 'Plano Premium',
      preco: 199.99,
      imagem: 'https://static.vecteezy.com/ti/vetor-gratis/p3/2580439-assinatura-planos-rgb-color-icon-vetor.jpg'
    },
    {
      nome: 'Plano Empresarial',
      preco: 299.99,
      imagem: 'https://static.vecteezy.com/ti/vetor-gratis/p3/2580439-assinatura-planos-rgb-color-icon-vetor.jpg'
    }
    // Adicione mais planos conforme necessário
  ];

  // Função para definir a severidade com base no status do inventário
  getSeverity(status: string): string {
    return status === 'Disponível' ? 'success' : 'danger';
  }

}
