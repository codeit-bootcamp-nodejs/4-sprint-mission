import { Request, Response } from 'express';
import { UserService } from '@/services/user.service';
import { CreateUserDto, UpdateUserDto } from '@/dto/user.dto';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  // 모든 사용자 조회
  getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await this.userService.getAllUsers();
      res.json(result);
    } catch (error) {
      res.status(500).json({ 
        error: error instanceof Error ? error.message : '서버 오류가 발생했습니다.' 
      });
    }
  };

  // ID로 사용자 조회
  getUserById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        res.status(400).json({ error: '유효하지 않은 사용자 ID입니다.' });
        return;
      }

      const user = await this.userService.getUserById(id);
      
      if (!user) {
        res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });
        return;
      }

      res.json(user);
    } catch (error) {
      res.status(500).json({ 
        error: error instanceof Error ? error.message : '서버 오류가 발생했습니다.' 
      });
    }
  };

  // 사용자 생성
  createUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const createUserDto: CreateUserDto = req.body;

      if (!createUserDto.name || !createUserDto.email || createUserDto.age === undefined) {
        res.status(400).json({ error: '필수 필드가 누락되었습니다.' });
        return;
      }

      const user = await this.userService.createUser(createUserDto);
      res.status(201).json(user);
    } catch (error) {
      if (error instanceof Error && error.message.includes('이미 존재하는')) {
        res.status(409).json({ error: error.message });
        return;
      }

      res.status(400).json({ 
        error: error instanceof Error ? error.message : '잘못된 요청입니다.' 
      });
    }
  };

  // 사용자 수정
  updateUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        res.status(400).json({ error: '유효하지 않은 사용자 ID입니다.' });
        return;
      }

      const updateUserDto: UpdateUserDto = req.body;
      const user = await this.userService.updateUser(id, updateUserDto);

      if (!user) {
        res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });
        return;
      }

      res.json(user);
    } catch (error) {
      if (error instanceof Error && error.message.includes('이미 존재하는')) {
        res.status(409).json({ error: error.message });
        return;
      }

      res.status(400).json({ 
        error: error instanceof Error ? error.message : '잘못된 요청입니다.' 
      });
    }
  };

  // 사용자 삭제
  deleteUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        res.status(400).json({ error: '유효하지 않은 사용자 ID입니다.' });
        return;
      }

      const deleted = await this.userService.deleteUser(id);

      if (!deleted) {
        res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });
        return;
      }

      res.status(204).send();
    } catch (error) {
      res.status(500).json({ 
        error: error instanceof Error ? error.message : '서버 오류가 발생했습니다.' 
      });
    }
  };
}