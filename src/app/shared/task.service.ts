import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private tasksSource = new BehaviorSubject<any[]>([]);
  tasks$ = this.tasksSource.asObservable();

  addTask(task: any) {
    const currentTasks = this.tasksSource.value;
    this.tasksSource.next([...currentTasks, task]);
  }
}
