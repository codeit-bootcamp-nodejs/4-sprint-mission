import type { User, Comment, Product, Article } from '@prisma/client';
import type { Content, UserId } from './shared.type.js';

export interface PatchUserData extends UserId {
  data: {
    email?: string;
    nickname?: string;
    changePassword?: string;
    currentPassword?: string;
    image?: string;
  };
}
export interface GetUserContent extends UserId {
  content: Content;
}

export type ItemWithLikes = (Product | Article) & {
  _count: { likes: number };
  likes: { userId: number }[];
};

export type UserWithContent = User & {
  [K in Content]?: K extends 'comments' ? Comment[] : ItemWithLikes[];
};

export type FilteredContent = Omit<ItemWithLikes, '_count' | 'likes'> & {
  likeCount: number;
  isLike: boolean;
};

export interface UserContentResponse {
  data: FilteredContent[] | Comment[];
}

export type UserContentList = GetUserContent & {
  userContent: UserWithContent;
};
