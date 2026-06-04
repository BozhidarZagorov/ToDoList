import { Injectable, inject, Injector, runInInjectionContext } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  collectionData,
  query,
  where,
  updateDoc,
  doc,
  deleteDoc
} from '@angular/fire/firestore';
import { Auth, authState } from '@angular/fire/auth';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

export type TodoStatus = 'not-started' | 'in-progress' | 'completed';

@Injectable({
  providedIn: 'root'
})
export class TodoService {

  private firestore = inject(Firestore);
  private auth = inject(Auth);
  private injector = inject(Injector);

  // 🔹 Add todo
  addTodo(title: string, description: string) {
    const user = this.auth.currentUser;

    if (!user) return;

    const todosRef = collection(
      this.firestore,
      `users/${user.uid}/todos`
    );

    return addDoc(todosRef, {
      title,
      description,

      status: 'not-started',

      createdAt: new Date(),
      startedAt: null,
      completedAt: null
    });
  }

  // 🔹 Get todos by status
  getTodosByStatus(status: TodoStatus): Observable<any[]> {
    return runInInjectionContext(this.injector, () =>
      authState(this.auth).pipe(
        switchMap(user => {
          if (!user) return of([]);

          return runInInjectionContext(this.injector, () => {

            const todosRef = collection(
              this.firestore,
              `users/${user.uid}/todos`
            );

            const q = query(
              todosRef,
              where('status', '==', status)
            );

            return collectionData(q, {
              idField: 'id'
            }) as Observable<any[]>;
          });
        })
      )
    );
  }

  // 🔹 Update status
  updateStatus(id: string, status: TodoStatus) {
    const user = this.auth.currentUser;

    if (!user) return;

    const todoRef = doc(
      this.firestore,
      `users/${user.uid}/todos/${id}`
    );

    const data: any = {
      status
    };

    if (status === 'in-progress') {
      data.startedAt = new Date();
    }

    if (status === 'completed') {
      data.completedAt = new Date();
    }

    if (status === 'not-started') {
      data.startedAt = null;
      data.completedAt = null;
    }

    return updateDoc(todoRef, data);
  }

  // 🔹 Delete todo
  deleteTodo(id: string) {
    const user = this.auth.currentUser;

    if (!user) return;

    return deleteDoc(
      doc(
        this.firestore,
        `users/${user.uid}/todos/${id}`
      )
    );
  }

  // 🔹 Edit todo
  updateTodo(
    id: string,
    title: string,
    description: string
  ) {
    const user = this.auth.currentUser;

    if (!user) return;

    const todoRef = doc(
      this.firestore,
      `users/${user.uid}/todos/${id}`
    );

    return updateDoc(todoRef, {
      title,
      description
    });
  }
}