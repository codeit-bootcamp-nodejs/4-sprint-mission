import { PostRepository } from '@/repositories/post.repository';
import { UserRepository } from '@/repositories/user.repository';
import { CreatePostDto, UpdatePostDto, PostResponseDto, PostsResponseDto } from '@/dto/post.dto';
import { Post } from '@/types';

export class PostService {
  private postRepository: PostRepository;
  private userRepository: UserRepository;

  constructor() {
    this.postRepository = new PostRepository();
    this.userRepository = new UserRepository();
  }

  // 모든 포스트 조회
  async getAllPosts(): Promise<PostsResponseDto> {
    const posts = this.postRepository.findAll();
    return {
      posts: posts.map(this.mapToResponseDto),
      total: posts.length
    };
  }

  // ID로 포스트 조회
  async getPostById(id: number): Promise<PostResponseDto | null> {
    const post = this.postRepository.findById(id);
    return post ? this.mapToResponseDto(post) : null;
  }

  // 사용자 ID로 포스트 조회
  async getPostsByUserId(userId: number): Promise<PostsResponseDto> {
    const posts = this.postRepository.findByUserId(userId);
    return {
      posts: posts.map(this.mapToResponseDto),
      total: posts.length
    };
  }

  // 포스트 생성
  async createPost(createPostDto: CreatePostDto): Promise<PostResponseDto> {
    // 사용자 존재 여부 확인
    const user = this.userRepository.findById(createPostDto.userId);
    if (!user) {
      throw new Error('존재하지 않는 사용자입니다.');
    }

    // 입력값 검증
    this.validatePostData(createPostDto);

    const post = this.postRepository.create(createPostDto);
    return this.mapToResponseDto(post);
  }

  // 포스트 수정
  async updatePost(id: number, updatePostDto: UpdatePostDto): Promise<PostResponseDto | null> {
    const existingPost = this.postRepository.findById(id);
    if (!existingPost) {
      return null;
    }

    // 사용자 존재 여부 확인 (userId가 변경되는 경우)
    if (updatePostDto.userId) {
      const user = this.userRepository.findById(updatePostDto.userId);
      if (!user) {
        throw new Error('존재하지 않는 사용자입니다.');
      }
    }

    // 입력값 검증
    this.validatePostUpdateData(updatePostDto);

    const updatedPost = this.postRepository.update(id, updatePostDto);
    return updatedPost ? this.mapToResponseDto(updatedPost) : null;
  }

  // 포스트 삭제
  async deletePost(id: number): Promise<boolean> {
    return this.postRepository.delete(id);
  }

  // 포스트 데이터 검증
  private validatePostData(postData: CreatePostDto): void {
    if (!postData.title?.trim()) {
      throw new Error('제목은 필수 항목입니다.');
    }

    if (!postData.content?.trim()) {
      throw new Error('내용은 필수 항목입니다.');
    }

    if (!postData.userId || postData.userId <= 0) {
      throw new Error('유효하지 않은 사용자 ID입니다.');
    }
  }

  // 포스트 수정 데이터 검증
  private validatePostUpdateData(postData: UpdatePostDto): void {
    if (postData.title !== undefined && !postData.title?.trim()) {
      throw new Error('제목은 빈 값일 수 없습니다.');
    }

    if (postData.content !== undefined && !postData.content?.trim()) {
      throw new Error('내용은 빈 값일 수 없습니다.');
    }

    if (postData.userId !== undefined && (!postData.userId || postData.userId <= 0)) {
      throw new Error('유효하지 않은 사용자 ID입니다.');
    }
  }

  // Entity를 Response DTO로 변환
  private mapToResponseDto(post: Post): PostResponseDto {
    return {
      id: post.id,
      title: post.title,
      content: post.content,
      userId: post.userId
    };
  }
}