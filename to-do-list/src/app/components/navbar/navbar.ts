import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Auths } from '../../auth/auth';
import { AsyncPipe, CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, AsyncPipe, CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {

  constructor(
    public auth: Auths,
    private router: Router
  ) {}

  logout() {
    this.auth.logout().then(() => {
      this.router.navigate(['/login']);
    });
  }
}