export default interface Article {
  id: number;
  title: string;
  content: string;
  image: string | null;
  userId: number;
  likeCount: number;
  isLiked: boolean;
  createdAt: Date;
  updatedAt: Date;
}
