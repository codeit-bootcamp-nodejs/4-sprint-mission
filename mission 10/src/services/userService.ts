import bcrypt from "bcrypt";
import { UserRepository } from "../repositories/userRepository";
import { generateTokens } from "../lib/token";
import type { UserRegisterDTO, UserUpdateDTO, UserPasswordDTO } from "../dtos/user.dto";

export class UserService {
  private userRepo = new UserRepository();

  async register(data: UserRegisterDTO) {
    const exists = await this.userRepo.findByEmail(data.email);
    if (exists) throw new Error("EMAIL_EXISTS");

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);

    await this.userRepo.createUser(data.email, data.nickname, hashedPassword);
    return { message: "User registered successfully" };
  }

  async getProfile(userId: number) {
    return this.userRepo.findById(userId);
  }

  async updateInformation(userId: number, nickname?: string, image?: string) {
    const updateData: Record<string, string> = {};
    if (nickname) updateData.nickname = nickname;
    if (image) updateData.image = image;

    if (Object.keys(updateData).length === 0) throw new Error("NO_DATA");

    return this.userRepo.updateUser(userId, updateData);
  }

  async updatePassword(userId: number, data: UserPasswordDTO) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);
    await this.userRepo.updateUser(userId, { password: hashedPassword });
    return { message: "Password updated successfully" };
  }

  async getProducts(userId: number) {
    return this.userRepo.findProductsByUserId(userId);
  }

  generateUserTokens(userId: number) {
    return generateTokens(userId);
  }
}
