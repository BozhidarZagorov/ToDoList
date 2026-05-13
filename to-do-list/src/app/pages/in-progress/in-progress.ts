import { Component, OnInit } from '@angular/core';
import { Auths } from '../../auth/auth';
import { AsyncPipe, CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TodoService, TodoStatus } from '../../todos/todo';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { DragDropModule, CdkDragDrop } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-in-progress',
  standalone: true,
  imports: [CommonModule, AsyncPipe, RouterLink, FormsModule, DragDropModule],
  templateUrl: './in-progress.html',
  styleUrl: './in-progress.scss',
})
export class InProgress implements OnInit {

  // 🔹 UI state
  editingId: string | null = null;
  editedTitle = '';
  editedDescription = '';
  newTitle = '';
  newDescription = '';

  // 🔹 Streams
  notStarted$!: Observable<any[]>;
  inProgress$!: Observable<any[]>;

  constructor(
    public auth: Auths,
    private todoService: TodoService
  ) {}

  ngOnInit() {
    this.notStarted$ = this.todoService.getTodosByStatus('not-started');
    this.inProgress$ = this.todoService.getTodosByStatus('in-progress');
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

  saveEdit(id: string) {
    if (!this.editedText.trim()) return;

    this.todoService.updateTodo(id, this.editedText);
    this.editingId = null;
    this.editedText = '';
  }

  cancelEdit() {
    this.editingId = null;
    this.editedTitle = '';
    this.editedDescription = '';
  }


  drop(event: CdkDragDrop<any[] | null, any[] | null>) {

  const todo = event.item.data;

  // move to in progress
  if (
    event.previousContainer.id === 'notStartedList' &&
    event.container.id === 'inProgressList'
  ) {
    this.todoService.updateStatus(todo.id, 'in-progress');
  }

  // move back to not started
  if (
    event.previousContainer.id === 'inProgressList' &&
    event.container.id === 'notStartedList'
  ) {
    this.todoService.updateStatus(todo.id, 'not-started');
  }
}
}