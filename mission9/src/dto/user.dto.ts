import type { Comment } from "@prisma/client";

export interface IUserDTO {
  id: number;
  email?: string;
  nickname?: string;
  password?: string;
  createdAt?: Date;
  updatedAt?: Date;
  comment?: Comment[];
}

export interface ChangePasswordDTO {
  newPassword: string;
  currentPassword: string;
}
