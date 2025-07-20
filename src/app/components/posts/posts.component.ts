import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { JsonplaceholderService } from '../../services/jsonplaceholder.service';
import { Post } from '../../models/post.model';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.css'
})
export class PostsComponent implements OnInit {
  posts = signal<Post[]>([]);
  users = signal<User[]>([]);

  constructor(private jsonplaceholderService: JsonplaceholderService) {}

  ngOnInit() {
    this.loadPosts();
    this.loadUsers();
  }

  loadPosts() {
    this.jsonplaceholderService.getPosts().subscribe({
      next: (posts) => this.posts.set(posts),
      error: (error) => console.error('Error loading posts:', error)
    });
  }

  loadUsers() {
    this.jsonplaceholderService.getUsers().subscribe({
      next: (users) => this.users.set(users),
      error: (error) => console.error('Error loading users:', error)
    });
  }

  getUserName(userId: number): string {
    const user = this.users().find(u => u.id === userId);
    return user ? user.name : `User ${userId}`;
  }
}
