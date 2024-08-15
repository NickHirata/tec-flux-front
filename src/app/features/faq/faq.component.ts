import { Component } from '@angular/core';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent {
  faqs = [
    {
      question: 'O que é o TecFlux?',
      answer: 'O TecFlux é um sistema de gerenciamento de chamados que utiliza o método Kanban para otimizar o fluxo de trabalho e aumentar a eficiência.',
      showAnswer: false
    },
    {
      question: 'Como o TecFlux pode ajudar na minha empresa?',
      answer: 'O TecFlux ajuda a visualizar e gerenciar tarefas de forma eficiente, garantindo que todas as etapas do processo sejam concluídas com sucesso e no prazo.',
      showAnswer: false
    },
    {
      question: 'O que é o método Kanban?',
      answer: 'O método Kanban é uma abordagem de gestão visual que utiliza cartões e quadros para monitorar o progresso das tarefas e garantir que o trabalho flua de forma contínua e eficiente.',
      showAnswer: false
    },
    {
      question: 'O TecFlux oferece suporte para integração com outras ferramentas?',
      answer: 'Sim, o TecFlux pode ser integrado com diversas ferramentas e plataformas para melhorar a eficiência e a colaboração em sua equipe.',
      showAnswer: false
    },
    {
      question: 'Há alguma limitação no número de usuários?',
      answer: 'Não, o TecFlux é escalável e pode suportar um número ilimitado de usuários, adaptando-se às necessidades da sua empresa.',
      showAnswer: false
    },
    {
      question: 'Como posso começar a usar o TecFlux?',
      answer: 'Para começar a usar o TecFlux, você pode se inscrever no nosso site e seguir o guia de integração para configurar sua conta e começar a gerenciar suas tarefas.',
      showAnswer: false
    }
  ];

  toggleAnswer(item: any): void {
    item.showAnswer = !item.showAnswer;
  }
}
