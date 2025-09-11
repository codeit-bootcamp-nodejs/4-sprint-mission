import type { User, Comment } from '@prisma/client';
import type { UserContentType } from '@validations/userSchema.js';
import { ContentType } from '@validations/userSchema.js';

export type ContentTypeUnion = (typeof ContentType)[number];

export interface EntityId {
  id: number;
}
export interface PatchUserData extends EntityId {
  data: {
    email?: string;
    nickname?: string;
    changePassword?: string;
    currentPassword?: string;
    image?: string;
  };
}
export interface getUserContent extends EntityId, UserContentType {}

type ItemWithLikes = Omit<ContentTypeUnion, 'comments'> & {
  _count: { likes: number };
  likes: { userId: number }[];
};

export type UserWithContent = User & {
  [K in ContentTypeUnion]?: K extends 'comments' ? Comment[] : ItemWithLikes[];
};
