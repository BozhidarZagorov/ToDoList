import { Component } from '@angular/core';
import { Auths } from '../auth';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class LoginComponent {

  email = '';
  password = '';

  constructor(private auth: Auths, private router: Router) {}

  login() {
    this.auth.login(this.email, this.password)
      .then(() => this.router.navigate(['/']))
      .catch(err => console.error(err));
  }
}