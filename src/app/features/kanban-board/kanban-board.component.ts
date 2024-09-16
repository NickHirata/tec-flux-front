import { Component } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-kanban-board',
  standalone: true,
  imports: [CommonModule, FormsModule, DragDropModule],
  templateUrl: './kanban-board.component.html',
  styleUrls: ['./kanban-board.component.scss'],
})
export class KanbanBoardComponent {
  selectedColumn: any;
  newTask: string = '';

  // Definindo as colunas e as tarefas no componente
  boardColumns = [
    {
      name: 'A Fazer',
      tasks: ['Tarefa 1', 'Tarefa 2', 'Tarefa 3'],
      color: '#B3E5FC', // Cor personalizada
    },
    {
      name: 'Em Progresso',
      tasks: ['Tarefa 4'],
      color: '#B3E5FC',
    },
    {
      name: 'Concluído',
      tasks: ['Tarefa 5'],
      color: '#0288D1',
    },
  ];

  // Função para arrastar e soltar tarefas
  onTaskDrop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  // Obtém as listas conectadas para o drag-and-drop
  getConnectedDropLists(): string[] {
    return this.boardColumns.map((_, index) => `cdk-drop-list-${index}`);
  }

  // Adiciona uma nova tarefa na coluna selecionada
  addTask(task: string, columnIndex: number) {
    if (task.trim()) {
      this.boardColumns[columnIndex].tasks.push(task);
      this.newTask = ''; // Limpa o campo de nova tarefa após adicionar
    }
  }
}
