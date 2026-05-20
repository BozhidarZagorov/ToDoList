import { Component } from '@angular/core';
import { Auths } from '../auth';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  imports: [FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class RegisterComponent {

  email = '';
  password = '';

  constructor(private auth: Auths, private router: Router) {}

  register() {
    this.auth.register(this.email, this.password)
      .then(() => this.router.navigate(['/login']))
      .catch(err => console.error(err));
  }
  googleLogin() {
    this.auth.googleLogin()
  }
}