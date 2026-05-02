import { Injectable } from '@angular/core';
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
import { Auth } from '@angular/fire/auth';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TodoService {

  constructor(
    private firestore: Firestore,
    private auth: Auth
  ) {}

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

  // 🔹 Delete todo
  deleteTodo(id: string) {
    const todoRef = doc(this.firestore, `todos/${id}`);
    return deleteDoc(todoRef);
  }

  // 🔹 Edit todo
  updateTodo(id: string, newText: string) {
    const todoRef = doc(this.firestore, `todos/${id}`);
    return updateDoc(todoRef, {
      text: newText
    });
  }

  // 🔹 Get todos (filtered by user + status)
  getTodos(completed: boolean): Observable<any[]> {
    const user = this.auth.currentUser;
    if (!user) return of([]);

    const todosRef = collection(this.firestore, 'todos');

    const q = query(
      todosRef,
      where('userId', '==', user.uid),
      where('completed', '==', completed)
    );

    return collectionData(q, { idField: 'id' }) as Observable<any[]>;
  }

  // 🔹 Mark complete / incomplete
  toggleTodo(id: string, completed: boolean) {
    const todoDoc = doc(this.firestore, `todos/${id}`);
    return updateDoc(todoDoc, { completed });
  }
}