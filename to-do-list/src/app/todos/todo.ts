import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  collectionData,
  query,
  where,
  updateDoc,
  doc
} from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { Observable } from 'rxjs';

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

  // 🔹 Get todos (filtered by user + status)
  getTodos(completed: boolean): Observable<any[]> {
    const user = this.auth.currentUser;
    if (!user) return new Observable();

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