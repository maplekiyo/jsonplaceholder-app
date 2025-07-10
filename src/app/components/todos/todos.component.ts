import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JsonplaceholderService } from '../../services/jsonplaceholder.service';
import { Todo } from '../../models/todo.model';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-todos',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="todos-container">
      <h2>Todos</h2>
      <div class="filter-controls">
        <button 
          [class.active]="filter() === 'all'"
          (click)="setFilter('all')">
          All ({{ todos().length }})
        </button>
        <button 
          [class.active]="filter() === 'completed'"
          (click)="setFilter('completed')">
          Completed ({{ getCompletedCount() }})
        </button>
        <button 
          [class.active]="filter() === 'pending'"
          (click)="setFilter('pending')">
          Pending ({{ getPendingCount() }})
        </button>
      </div>
      <div class="todos-list">
        @for (todo of filteredTodos(); track todo.id) {
          <div class="todo-item" [class.completed]="todo.completed">
            <div class="todo-checkbox">
              <input type="checkbox" [checked]="todo.completed" disabled>
            </div>
            <div class="todo-content">
              <h4>{{ todo.title }}</h4>
              <p class="todo-user">Assigned to: {{ getUserName(todo.userId) }}</p>
            </div>
            <div class="todo-status">
              <span [class]="todo.completed ? 'status-completed' : 'status-pending'">
                {{ todo.completed ? 'Completed' : 'Pending' }}
              </span>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .todos-container {
      padding: 20px;
    }
    
    .filter-controls {
      margin: 20px 0;
      display: flex;
      gap: 10px;
    }
    
    .filter-controls button {
      padding: 8px 16px;
      border: 1px solid #ddd;
      background: white;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.2s;
    }
    
    .filter-controls button:hover {
      background: #f5f5f5;
    }
    
    .filter-controls button.active {
      background: #007bff;
      color: white;
      border-color: #007bff;
    }
    
    .todos-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    
    .todo-item {
      display: flex;
      align-items: center;
      padding: 16px;
      border: 1px solid #ddd;
      border-radius: 8px;
      background: white;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    
    .todo-item.completed {
      opacity: 0.7;
      background: #f8f9fa;
    }
    
    .todo-checkbox {
      margin-right: 16px;
    }
    
    .todo-content {
      flex: 1;
    }
    
    .todo-content h4 {
      margin: 0 0 4px 0;
      color: #333;
    }
    
    .todo-user {
      margin: 0;
      color: #666;
      font-size: 0.9em;
    }
    
    .todo-status {
      margin-left: 16px;
    }
    
    .status-completed {
      color: #28a745;
      font-weight: bold;
    }
    
    .status-pending {
      color: #ffc107;
      font-weight: bold;
    }
  `]
})
export class TodosComponent implements OnInit {
  todos = signal<Todo[]>([]);
  users = signal<User[]>([]);
  filter = signal<'all' | 'completed' | 'pending'>('all');

  constructor(private jsonplaceholderService: JsonplaceholderService) {}

  ngOnInit() {
    this.loadTodos();
    this.loadUsers();
  }

  loadTodos() {
    this.jsonplaceholderService.getTodos().subscribe({
      next: (todos) => this.todos.set(todos),
      error: (error) => console.error('Error loading todos:', error)
    });
  }

  loadUsers() {
    this.jsonplaceholderService.getUsers().subscribe({
      next: (users) => this.users.set(users),
      error: (error) => console.error('Error loading users:', error)
    });
  }

  setFilter(filter: 'all' | 'completed' | 'pending') {
    this.filter.set(filter);
  }

  filteredTodos() {
    const todos = this.todos();
    switch (this.filter()) {
      case 'completed':
        return todos.filter(todo => todo.completed);
      case 'pending':
        return todos.filter(todo => !todo.completed);
      default:
        return todos;
    }
  }

  getCompletedCount(): number {
    return this.todos().filter(todo => todo.completed).length;
  }

  getPendingCount(): number {
    return this.todos().filter(todo => !todo.completed).length;
  }

  getUserName(userId: number): string {
    const user = this.users().find(u => u.id === userId);
    return user ? user.name : `User ${userId}`;
  }
}
