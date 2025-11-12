import HttpError from "../lib/error";
import prisma from "../lib/prisma";
import { IProduct } from "../product/product.service";
import bcrypt from "bcrypt";
export interface IUser {
  id: number;
  email?: string | null;
  nickname?: string | null;
  password: string | null ;
  comments?: IComments[];
  product?: IProduct[]; // one to many
  createdAt: Date;
  updatedAt: Date;
}
export interface IComments {
  title: string;
  contents: string;
  ownerid?: number; // relation 1: M
}

// output interface
interface OutputUserInfo {
  id: number;
  email: string | null;
  nickname: string | null;
}
interface OutputChangingPassword {
  success: boolean;
  message: string;
}

export class UserService {
  async getUserInfo({ id }: { id: number }): Promise<IUser> {
    const userId = id;
    const customerInfo = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if(!customerInfo) throw new HttpError(404, "not found")
    return customerInfo;
  }
  async patchUserInfo(
    id: number,
    input: { email: string | null; nickname: string | null }
  ): Promise<OutputUserInfo> {
    const userId = id;
    const { email, nickname } = input;
    const isValid = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!isValid)
      throw { status: 404, message: "해당 유저는 유효하지않습니다" };
    const modifiedUserInfo = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        email,
        nickname,
      },
      select: {
        id: true,
        email: true,
        nickname: true,
      },
    });
    return modifiedUserInfo;
  }
  async patchedPassword(
    id: number,
    input: { currentPassword: string; newPassword: string }
  ): Promise<OutputChangingPassword> {
    const userId = id;
    const { currentPassword, newPassword } = input;
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
  
    if (!user) throw new HttpError(404, "not found");
    if (!user.password) throw new HttpError(404, "not found 비밀번호");

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (isMatch)
     throw new HttpError( 400, "이전비밀번호와 같으면 안됩니다.");
    const newHash = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        password: newHash,
      },
    });
    return { success: true, message: "비밀번호 변경 성공" };
  }
}
