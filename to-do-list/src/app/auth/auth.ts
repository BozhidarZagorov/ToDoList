import { Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  authState,
  GoogleAuthProvider,
  signInWithPopup
} from '@angular/fire/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Auths {

  user$: Observable<any>;

  constructor(private auth: Auth) {
    this.user$ = authState(this.auth);
  }

  register(email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }
  googleLogin() {
    const provider = new GoogleAuthProvider();

    return signInWithPopup(this.auth, provider);
  }

  logout() {
    return signOut(this.auth);
  }
  
}