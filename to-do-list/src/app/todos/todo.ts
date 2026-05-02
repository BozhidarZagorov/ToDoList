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

@Injectable({
  providedIn: 'root'
})
export class TodoService {

  private firestore = inject(Firestore);
  private auth = inject(Auth);
   private injector = inject(Injector);

  // 🔹 Add todo
  addTodo(text: string) {
    const user = this.auth.currentUser;
    if (!user) return;

    const todosRef = collection(this.firestore, 'todos');

    return addDoc(todosRef, {
      text,
      completed: false,
      userId: user.uid,
      createdAt: new Date()
    });
  }

   // 🔹 Get todos (FIXED properly)
  getTodos(completed: boolean): Observable<any[]> {
  return runInInjectionContext(this.injector, () =>
    authState(this.auth).pipe(
      switchMap(user => {
        if (!user) return of([]);

        return runInInjectionContext(this.injector, () => {
          const todosRef = collection(this.firestore, 'todos');

          const q = query(
            todosRef,
            where('userId', '==', user.uid),
            where('completed', '==', completed)
          );

          return collectionData(q, { idField: 'id' }) as Observable<any[]>;
        });
      })
    )
  );
}

  // 🔹 Delete
  deleteTodo(id: string) {
    return deleteDoc(doc(this.firestore, `todos/${id}`));
  }

  // 🔹 Update text
  updateTodo(id: string, newText: string) {
    return updateDoc(doc(this.firestore, `todos/${id}`), {
      text: newText
    });
  }

  // 🔹 Toggle complete
  toggleTodo(id: string, completed: boolean) {
    return updateDoc(doc(this.firestore, `todos/${id}`), {
      completed
    });
  }
}