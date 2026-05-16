import { Component, OnInit } from '@angular/core';
import { Auths } from '../../auth/auth';
import { AsyncPipe, CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TodoService, TodoStatus } from '../../todos/todo';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { DragDropModule, CdkDragDrop } from '@angular/cdk/drag-drop';

type Todo = {
  id: string;
  title: string;
  description: string;
  status: string;
  createdAt?: any;
  startedAt?: any;
};
@Component({
  selector: 'app-in-progress',
  standalone: true,
  imports: [CommonModule, AsyncPipe, RouterLink, FormsModule, DragDropModule],
  templateUrl: './in-progress.html',
  styleUrl: './in-progress.scss',
})
export class InProgress implements OnInit {
  notStartedCount = 0;
  inProgressCount = 0;
  selectedTodo: any = null;
  isDragging = false;
  placeholderList: Todo[] = [];
  showCompleteDrop = false;

  // 🔹 UI state
  editingId: string | null = null;
  editedTitle = '';
  editedDescription = '';
  newTitle = '';
  newDescription = '';

  // 🔹 Streams
  notStarted$!: Observable<Todo[]>;
  inProgress$!: Observable<Todo[]>;

  constructor(
    public auth: Auths,
    private todoService: TodoService
  ) {}
  

  ngOnInit() {
    this.notStarted$ = this.todoService.getTodosByStatus('not-started');
    this.inProgress$ = this.todoService.getTodosByStatus('in-progress');
    

    this.notStarted$.subscribe(todos => {
      this.notStartedCount = todos.length;
    });

    this.inProgress$.subscribe(todos => {
      this.inProgressCount = todos.length;
    });
  }
  
  // 🔹 Add
  addTodo() {
    if (!this.newTitle.trim()) return;
    if (!this.newDescription.trim()) return;

    this.todoService.addTodo(this.newTitle,this.newDescription);
    this.newTitle = '';
    this.newDescription = '';
  }

  // 🔹 Move to "in progress"
  startTask(id: string) {
    this.todoService.updateStatus(id, 'in-progress');
  }

  moveToNotStarted(id: string) {
    this.todoService.updateStatus(id, 'not-started');
  }

  // 🔹 Move to "completed"
  completeTodo(id: string) {
    this.todoService.updateStatus(id, 'completed');
  }

  // 🔹 Delete
  deleteTodo(id: string) {
    this.todoService.deleteTodo(id);
  }

  // 🔹 Edit
  startEdit(todo: any) {
    this.editingId = todo.id;
    this.editedTitle = todo.title
    this.editedDescription = todo.description
  }

  openDetails(todo: any) {
    this.selectedTodo = todo;
  }
  closeDetails() {
    this.selectedTodo = null;
  }

  saveEdit(id: string) {
    if (!this.editedTitle.trim()) return;
    if (!this.editedDescription.trim()) return;

    this.todoService.updateTodo(id, this.editedTitle, this.editedDescription);
    this.editingId = null;
    this.editedTitle = '';
    this.editedDescription = '';
  }

  cancelEdit() {
    this.editingId = null;
    this.editedTitle = '';
    this.editedDescription = '';
  }

  dragStarted(todo: any) {
  this.isDragging = true;

  this.showCompleteDrop = todo.status === 'in-progress';
}

  dragEnded() {
  this.isDragging = false;
  this.showCompleteDrop = false;
}


  drop(event: CdkDragDrop<any[]>) {
  const todo = event.item.data;

  const to = event.container.id;

  switch (to) {
    case 'inProgressList':
      this.todoService.updateStatus(todo.id, 'in-progress');
      break;

    case 'notStartedList':
      this.todoService.updateStatus(todo.id, 'not-started');
      break;

    case 'completedList':
      if (todo.status === 'in-progress') {
        this.todoService.updateStatus(todo.id, 'completed');
      }
      break;
  }

  this.showCompleteDrop = false;
}
}