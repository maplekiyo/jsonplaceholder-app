import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JsonplaceholderService } from '../../services/jsonplaceholder.service';
import { Todo } from '../../models/todo.model';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-todos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './todos.component.html',
  styleUrl: './todos.component.css'
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
