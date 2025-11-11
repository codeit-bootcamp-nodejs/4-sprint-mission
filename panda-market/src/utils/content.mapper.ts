import { Likes } from '@/types/shared.types.js';

export function buildContentList<T extends Likes>({
  userId,
  contents,
}: {
  userId: number;
  contents: T[];
}) {
  return contents.map((content) => {
    const { likes, ...filteredContent } = content;
    return {
      isLike: userId ? likes.length > 0 : false,
      ...filteredContent,
    };
  });
}
export function buildContent<T extends Likes>({
  userId,
  content,
}: {
  userId: number;
  content: T;
}) {
  const { likes, ...filteredProduct } = content;
  return {
    isLike: userId ? likes.length > 0 : false,
    ...filteredProduct,
  };
}
