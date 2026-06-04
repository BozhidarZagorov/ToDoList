import { Component, inject } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { Auths } from '../../auth/auth';
import { TodoService } from '../../todos/todo';
import { map } from 'rxjs/operators';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, AsyncPipe, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  private auth = inject(Auths);
  private todoService = inject(TodoService);

  user$ = this.auth.user$;
  notStartedCount$!: Observable<number>;
  inProgressCount$!: Observable<number>;
  completedCount$!: Observable<number>;

  constructor() {
    this.notStartedCount$ = this.todoService.getTodosByStatus('not-started').pipe(
      map(todos => todos.length)
    );

    this.inProgressCount$ = this.todoService.getTodosByStatus('in-progress').pipe(
      map(todos => todos.length)
    );

    this.completedCount$ = this.todoService.getTodosByStatus('completed').pipe(
      map(todos => todos.length)
    );
  }
}