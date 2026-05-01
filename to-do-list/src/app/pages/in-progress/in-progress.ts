import { Component, OnInit } from '@angular/core';
import { Auths } from '../../auth/auth';
import { AsyncPipe, CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TodoService } from '../../todos/todo';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-in-progress',
  standalone: true,
  imports: [CommonModule, AsyncPipe, RouterLink, FormsModule],
  templateUrl: './in-progress.html',
  styleUrl: './in-progress.scss',
})
export class InProgress implements OnInit {

  newTodo = '';
  todos$!: Observable<any[]>;

  constructor(
    public auth: Auths,
    private todoService: TodoService
  ) {}

  ngOnInit() {
    this.todos$ = this.todoService.getTodos(false);
  }

  addTodo() {
    if (!this.newTodo.trim()) return;

    this.todoService.addTodo(this.newTodo);
    this.newTodo = '';
  }

  completeTodo(id: string) {
    this.todoService.toggleTodo(id, true);
  }
}