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
  styleUrl: './kanban-board.component.scss'
})
export class KanbanBoardComponent {

  selectedColumn: any;
  newTask: string = '';

  // Definimos as colunas e as tarefas internamente no componente
  boardColumns = [
    {
      name: 'A Fazer',
      tasks: ['Tarefa 1', 'Tarefa 2', 'Tarefa 3'],
      color: '#FFCDD2' // Cor personalizada para essa coluna
    },
    {
      name: 'Em Progresso',
      tasks: ['Tarefa 4'],
      color: '#BBDEFB'
    },
    {
      name: 'Concluído',
      tasks: ['Tarefa 5'],
      color: '#C8E6C9'
    },
  ];


  // Função para lidar com arrastar e soltar
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

  getConnectedDropLists(): string[] {
    return this.boardColumns.map((_, index) => `cdk-drop-list-${index}`);
  }


  // Função para adicionar uma nova tarefa em uma coluna específica
  addTask(task: string, columnIndex: number) {
    if (task.trim()) {
      this.boardColumns[columnIndex].tasks.push(task);
    }
  }
}
