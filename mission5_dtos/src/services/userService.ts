import bcrypt from "bcrypt";
import { UserRepository } from "../repositories/userRepository";
import { generateTokens } from "../lib/token";

export class UserService {
  private userRepo = new UserRepository();

  async register(email: string, nickname: string, password: string) {
    const exists = await this.userRepo.findByEmail(email);
    if (exists) throw new Error("EMAIL_EXISTS");

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await this.userRepo.createUser(email, nickname, hashedPassword);
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

  async updatePassword(userId: number, password: string) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
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
