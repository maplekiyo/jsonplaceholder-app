import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JsonplaceholderService } from '../../services/jsonplaceholder.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="users-container">
      <h2>Users</h2>
      <div class="users-grid">
        @for (user of users(); track user.id) {
          <div class="user-card">
            <h3>{{ user.name }}</h3>
            <p class="username">{{ '@' + user.username }}</p>
            <div class="user-details">
              <p><strong>Email:</strong> {{ user.email }}</p>
              <p><strong>Phone:</strong> {{ user.phone }}</p>
              <p><strong>Website:</strong> {{ user.website }}</p>
              <p><strong>Company:</strong> {{ user.company.name }}</p>
              <p><strong>Address:</strong> {{ user.address.city }}, {{ user.address.street }}</p>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .users-container {
      padding: 20px;
    }
    
    .users-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 20px;
      margin-top: 20px;
    }
    
    .user-card {
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 20px;
      background: white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .user-card h3 {
      margin: 0 0 8px 0;
      color: #333;
      font-size: 1.3em;
    }
    
    .username {
      color: #666;
      font-style: italic;
      margin-bottom: 16px;
    }
    
    .user-details p {
      margin: 8px 0;
      color: #555;
    }
    
    .user-details strong {
      color: #333;
    }
  `]
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
