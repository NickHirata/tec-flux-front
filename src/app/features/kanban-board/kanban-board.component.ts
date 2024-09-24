import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { RippleModule } from 'primeng/ripple';
import { CardModule } from 'primeng/card';
import { MessageService } from 'primeng/api';



@Component({
  selector: 'app-kanban-board',
  standalone: true,
  imports: [CommonModule, 
    FormsModule, 
    DragDropModule, 
    ToolbarModule,
    DragDropModule,
    InputTextModule,
    DropdownModule,
    ButtonModule,
    ToolbarModule,
    ToastModule,
    CardModule,
    RippleModule
  ],
  templateUrl: './kanban-board.component.html',
  styleUrl: './kanban-board.component.scss'
})
export class KanbanBoardComponent {
  newTask: string = '';
  selectedColumn: number | null = null;

  boardColumns = [
    {
      name: 'A Fazer',
      tasks: ['Tarefa 1', 'Tarefa 2', 'Tarefa 3'],
      color: '#B3E5FC' 
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
  dropdownOptions: { label: string, value: number }[] = [];

  constructor(private messageService: MessageService) {}

  ngOnInit() {
    this.dropdownOptions = this.boardColumns.map((col, index) => ({
      label: col.name,
      value: index
    }));
  }

  addTask(task: string, columnIndex: number | null) {
    if (task.trim() && columnIndex !== null && this.boardColumns[columnIndex]) {
      this.boardColumns[columnIndex].tasks.push(task.trim());
      this.newTask = '';
      this.selectedColumn = null;

      // Exibir toast de sucesso
      this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Tarefa adicionada!' });
    } else {
      // Exibir toast de erro se a coluna não for válida
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Selecione uma coluna válida!' });
    }
  }

  getConnectedDropLists() {
    return this.boardColumns.map((_, index) => `cdk-drop-list-${index}`);
  }

  onTaskDrop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }
}