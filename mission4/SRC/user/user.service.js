import prisma from "../../lib/prisma.js";
import bcrypt from "bcrypt";
export class UserService {
  //  == export new userService
  async createUser({ email, nickname, password }) {
    const hashedPassword = await bcrypt.hash(password, 10); // 여기서 해싱
    return prisma.user.create({
      data: {
        email,
        nickname,
        password: hashedPassword,
      },
    });
  }
  async getUserInfo({ me }) {
    const customerInfo = await prisma.user.findUnique({
      where: { me},
    });
    if (!customerInfo) throw new Error("해당 유저의 정보 없습니다");
    return customerInfo.map((info) => ({
      id: info.id,
      nickname: info.nickname,
    }));
  }
  async patchUserInfo({ me, data }) {
    const updatedUserInfo = await prisma.user.update({
      where: {
        me
      },
      data: data,
    });
    return updatedUserInfo.map((info) => ({
      id: info.id,
      nickname: info.nickname,
    }));
  }
  async patchUserPassword({ userId, old_password, new_password }) {
    const hashed_password = await bcrypt.hash(new_password, 10);
    const customer = await prisma.user.findUnique({ where: { id: userId } });

    const isValid = await bcrypt.compare(old_password, customer.password);
    if (!isValid) throw new Error("기존 비밀번호가 틀렸어요");
    return prisma.user.update({
      where: { id: userId },
      data: { password: hashed_password },
    });
  }
  async getUserProductList({ me }) {
    const customer = await prisma.user.findUnique({
      where: {
        me
      },
    });
    if (!customer) throw new Error("해당 유저가 없습니다");
    const items = await prisma.product.findMany({
      where: { userId: customer.id },
      include: {
        tags: true,
        comment: true,
      },
    });
    return items.map((el) => ({
      id: el.id,
      name: el.name,
      description: el.description,
      tags: el.tags,
      comment: el.comment,
    }));
  }
}
