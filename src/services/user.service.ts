import { UserRepository } from '@/repositories/user.repository';
import { CreateUserDto, UpdateUserDto, UserResponseDto, UsersResponseDto } from '@/dto/user.dto';
import { User } from '@/types';

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  // 모든 사용자 조회
  async getAllUsers(): Promise<UsersResponseDto> {
    const users = this.userRepository.findAll();
    return {
      users: users.map(this.mapToResponseDto),
      total: users.length
    };
  }

  // ID로 사용자 조회
  async getUserById(id: number): Promise<UserResponseDto | null> {
    const user = this.userRepository.findById(id);
    return user ? this.mapToResponseDto(user) : null;
  }

  // 사용자 생성
  async createUser(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    // 이메일 중복 검사
    const existingUser = this.userRepository.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new Error('이미 존재하는 이메일입니다.');
    }

    // 입력값 검증
    this.validateUserData(createUserDto);

    const user = this.userRepository.create(createUserDto);
    return this.mapToResponseDto(user);
  }

  // 사용자 수정
  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<UserResponseDto | null> {
    const existingUser = this.userRepository.findById(id);
    if (!existingUser) {
      return null;
    }

    // 이메일 중복 검사 (다른 사용자가 같은 이메일을 사용하는지)
    if (updateUserDto.email) {
      const userWithEmail = this.userRepository.findByEmail(updateUserDto.email);
      if (userWithEmail && userWithEmail.id !== id) {
        throw new Error('이미 존재하는 이메일입니다.');
      }
    }

    // 입력값 검증
    this.validateUserUpdateData(updateUserDto);

    const updatedUser = this.userRepository.update(id, updateUserDto);
    return updatedUser ? this.mapToResponseDto(updatedUser) : null;
  }

  // 사용자 삭제
  async deleteUser(id: number): Promise<boolean> {
    return this.userRepository.delete(id);
  }

  // 사용자 데이터 검증
  private validateUserData(userData: CreateUserDto): void {
    if (!userData.name?.trim()) {
      throw new Error('이름은 필수 항목입니다.');
    }

    if (!userData.email?.trim()) {
      throw new Error('이메일은 필수 항목입니다.');
    }

    if (!this.isValidEmail(userData.email)) {
      throw new Error('올바른 이메일 형식이 아닙니다.');
    }

    if (userData.age < 0 || userData.age > 150) {
      throw new Error('유효하지 않은 나이입니다.');
    }
  }

  // 사용자 수정 데이터 검증
  private validateUserUpdateData(userData: UpdateUserDto): void {
    if (userData.name !== undefined && !userData.name?.trim()) {
      throw new Error('이름은 빈 값일 수 없습니다.');
    }

    if (userData.email !== undefined) {
      if (!userData.email?.trim()) {
        throw new Error('이메일은 빈 값일 수 없습니다.');
      }
      
      if (!this.isValidEmail(userData.email)) {
        throw new Error('올바른 이메일 형식이 아닙니다.');
      }
    }

    if (userData.age !== undefined && (userData.age < 0 || userData.age > 150)) {
      throw new Error('유효하지 않은 나이입니다.');
    }
  }

  // 이메일 형식 검증
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Entity를 Response DTO로 변환
  private mapToResponseDto(user: User): UserResponseDto {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      age: user.age
    };
  }
}