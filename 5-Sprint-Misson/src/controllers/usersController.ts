import { Request, Response } from "express";
import { UserService } from "../services/userService";
import { UpdateProfileDto, ChangePasswordDto, PaginationQueryDto } from "../dtos/user.dto";

export class UsersController {
  private service = new UserService();

  async getProfile(req: Request, res: Response) {
    try {
      const user = await this.service.getProfile(req.user!.id);
      res.json(user);
    } catch (err: any) {
      res.status(500).json({ error: "내 정보 조회 실패" });
    }
  }

  async updateProfile(req: Request, res: Response) {
    try {
      const dto: UpdateProfileDto = req.body;
      const updated = await this.service.updateProfile(req.user!.id, dto);
      res.json(updated);
    } catch (err: any) {
      res.status(500).json({ error: "내 정보 수정 실패" });
    }
  }

  async changePassword(req: Request, res: Response) {
    try {
      const dto: ChangePasswordDto = req.body;
      const result = await this.service.changePassword(req.user!.id, dto.oldPassword, dto.newPassword);
      res.json(result);
    } catch (err: any) {
      res.status(err.message === "기존 비밀번호 불일치" ? 400 : err.message === "유저 없음" ? 404 : 500).json({ error: err.message });
    }
  }

  async getMyProducts(req: Request, res: Response) {
    try {
      const query: PaginationQueryDto = req.query;
      const products = await this.service.getMyProducts(
        req.user!.id,
        query.page ? Number(query.page) : 1,
        query.pageSize ? Number(query.pageSize) : 10
      );
      res.json(products);
    } catch (err: any) {
      res.status(500).json({ error: "내 상품 목록 조회 실패" });
    }
  }
}
