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

  // 🔹 Add todo (NEW: uses status instead of completed)
  addTodo(text: string) {
    const user = this.auth.currentUser;
    if (!user) return;

    const todosRef = collection(this.firestore, 'todos');

    return addDoc(todosRef, {
      text,
      status: 'not-started', // ✅ default state
      userId: user.uid,
      createdAt: new Date()
    });
  }

  // 🔹 Get todos by status (MAIN QUERY)
  getTodosByStatus(status: TodoStatus): Observable<any[]> {
    return runInInjectionContext(this.injector, () =>
      authState(this.auth).pipe(
        switchMap(user => {
          if (!user) return of([]);

          return runInInjectionContext(this.injector, () => {
            const todosRef = collection(this.firestore, 'todos');

            const q = query(
              todosRef,
              where('userId', '==', user.uid),
              where('status', '==', status)
            );

            return collectionData(q, { idField: 'id' }) as Observable<any[]>;
          });
        })
      )
    );
  }

  // 🔹 Update status (move between columns)
  updateStatus(id: string, status: TodoStatus) {
    const todoDoc = doc(this.firestore, `todos/${id}`);
    return updateDoc(todoDoc, { status });
  }

  // 🔹 Delete todo
  deleteTodo(id: string) {
    return deleteDoc(doc(this.firestore, `todos/${id}`));
  }

  // 🔹 Edit text
  updateTodo(id: string, newText: string) {
    const todoDoc = doc(this.firestore, `todos/${id}`);
    return updateDoc(todoDoc, {
      text: newText
    });
  }
}