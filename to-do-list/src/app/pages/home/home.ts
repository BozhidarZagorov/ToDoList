import { Component } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { Auths } from '../../auth/auth';
import { TodoService } from '../../todos/todo';
import { map } from 'rxjs/operators';
import { inject } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [CommonModule, AsyncPipe, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  private auth = inject(Auths);
  private todoService = inject(TodoService);

  user$ = this.auth.user$;

  inProgressCount$ = this.todoService.getTodos(false).pipe(
    map(todos => todos.length)
  );

  completedCount$ = this.todoService.getTodos(true).pipe(
    map(todos => todos.length)
  );
}