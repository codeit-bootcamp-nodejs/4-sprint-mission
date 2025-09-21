import { Post } from '@/types';

export class PostRepository {
  private posts: Post[] = [
    { id: 1, title: 'First Post', content: 'This is the first post', userId: 1 },
    { id: 2, title: 'Second Post', content: 'This is the second post', userId: 2 },
  ];

  // 모든 포스트 조회
  findAll(): Post[] {
    return this.posts;
  }

  // ID로 포스트 조회
  findById(id: number): Post | undefined {
    return this.posts.find(post => post.id === id);
  }

  // 사용자 ID로 포스트 조회
  findByUserId(userId: number): Post[] {
    return this.posts.filter(post => post.userId === userId);
  }

  // 포스트 생성
  create(postData: Omit<Post, 'id'>): Post {
    const newPost: Post = {
      id: this.getNextId(),
      ...postData
    };
    this.posts.push(newPost);
    return newPost;
  }

  // 포스트 수정
  update(id: number, postData: Partial<Omit<Post, 'id'>>): Post | null {
    const postIndex = this.posts.findIndex(post => post.id === id);
    if (postIndex === -1) {
      return null;
    }

    this.posts[postIndex] = { ...this.posts[postIndex], ...postData };
    return this.posts[postIndex];
  }

  // 포스트 삭제
  delete(id: number): boolean {
    const postIndex = this.posts.findIndex(post => post.id === id);
    if (postIndex === -1) {
      return false;
    }

    this.posts.splice(postIndex, 1);
    return true;
  }

  // 다음 ID 생성
  private getNextId(): number {
    return this.posts.length > 0 
      ? Math.max(...this.posts.map(post => post.id)) + 1 
      : 1;
  }
}