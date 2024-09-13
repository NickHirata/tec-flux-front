import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
//import { TaskService } from '../../shared;



@Component({
  selector: 'app-kanban-board',
  standalone: true,
  imports: [CommonModule, FormsModule, DragDropModule],
  templateUrl: './kanban-board.component.html',
  styleUrl: './kanban-board.component.scss'
})
export class KanbanBoardComponent //implements OnInit
{

  selectedColumn: any;
  newTask: string = '';

  // Definimos as colunas e as tarefas internamente no componente
  boardColumns = [
    {
      name: 'A Fazer',
      tasks: ['Tarefa 1', 'Tarefa 2', 'Tarefa 3'],
      color: '#B3E5FC' // Cor personalizada para essa coluna
    },
    {
      name: 'Em Progresso',
      tasks: ['Tarefa 4'],
      color: '#64B5F6'
    },
    {
      name: 'Concluído',
      tasks: ['Tarefa 5'],
      color: '#0288D1'
    },
  ];

  //constructor(private taskService: TaskService) {}

 /* ngOnInit() {
    this.taskService.taskAdded$.subscribe(({ task, columnIndex }) => {
      this.addTask(task, columnIndex);
    });
  }*/

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
