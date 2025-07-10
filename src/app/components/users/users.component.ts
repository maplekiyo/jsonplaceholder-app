import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JsonplaceholderService } from '../../services/jsonplaceholder.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit {
  users = signal<User[]>([]);

  constructor(private jsonplaceholderService: JsonplaceholderService) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.jsonplaceholderService.getUsers().subscribe({
      next: (users) => this.users.set(users),
      error: (error) => console.error('Error loading users:', error)
    });
  }
}
