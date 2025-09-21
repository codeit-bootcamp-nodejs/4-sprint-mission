import { User } from '@/types';

export class UserRepository {
  private users: User[] = [
    { id: 1, name: 'John Doe', email: 'john@example.com', age: 30 },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', age: 25 },
  ];

  // 모든 사용자 조회
  findAll(): User[] {
    return this.users;
  }

  // ID로 사용자 조회
  findById(id: number): User | undefined {
    return this.users.find(user => user.id === id);
  }

  // 이메일로 사용자 조회
  findByEmail(email: string): User | undefined {
    return this.users.find(user => user.email === email);
  }

  // 사용자 생성
  create(userData: Omit<User, 'id'>): User {
    const newUser: User = {
      id: this.getNextId(),
      ...userData
    };
    this.users.push(newUser);
    return newUser;
  }

  // 사용자 수정
  update(id: number, userData: Partial<Omit<User, 'id'>>): User | null {
    const userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex === -1) {
      return null;
    }

    this.users[userIndex] = { ...this.users[userIndex], ...userData };
    return this.users[userIndex];
  }

  // 사용자 삭제
  delete(id: number): boolean {
    const userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex === -1) {
      return false;
    }

    this.users.splice(userIndex, 1);
    return true;
  }

  // 다음 ID 생성
  private getNextId(): number {
    return this.users.length > 0 
      ? Math.max(...this.users.map(user => user.id)) + 1 
      : 1;
  }
}