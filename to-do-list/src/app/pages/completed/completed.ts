import { Component, OnInit } from '@angular/core';
import { Auths } from '../../auth/auth';
import { AsyncPipe, CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TodoService } from '../../todos/todo';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-completed',
  standalone: true,
  imports: [CommonModule, AsyncPipe, RouterLink],
  templateUrl: './completed.html',
  styleUrl: './completed.scss',
})
export class Completed implements OnInit {

  todos$!: Observable<any[]>;

  constructor(
    public auth: Auths,
    private todoService: TodoService
  ) {}

  ngOnInit() {
    this.todos$ = this.todoService.getTodosByStatus('completed');
  }

  undoTodo(id: string) {
    this.todoService.updateStatus(id, 'in-progress');
  }

  deleteTodo(id: string) {
    this.todoService.deleteTodo(id);
  }
}