import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JsonplaceholderService } from '../../services/jsonplaceholder.service';
import { Post } from '../../models/post.model';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="posts-container">
      <h2>Posts</h2>
      <div class="posts-grid">
        @for (post of posts(); track post.id) {
          <div class="post-card">
            <h3>{{ post.title }}</h3>
            <p class="post-body">{{ post.body }}</p>
            <div class="post-meta">
              <span class="author">By: {{ getUserName(post.userId) }}</span>
              <span class="post-id">Post #{{ post.id }}</span>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .posts-container {
      padding: 20px;
    }
    
    .posts-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
      margin-top: 20px;
    }
    
    .post-card {
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 16px;
      background: white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .post-card h3 {
      margin: 0 0 12px 0;
      color: #333;
      font-size: 1.2em;
    }
    
    .post-body {
      color: #666;
      line-height: 1.5;
      margin-bottom: 12px;
    }
    
    .post-meta {
      display: flex;
      justify-content: space-between;
      font-size: 0.9em;
      color: #888;
    }
    
    .author {
      font-weight: bold;
    }
  `]
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
