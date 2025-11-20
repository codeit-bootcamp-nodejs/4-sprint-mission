export default interface User {
  id: number;
  email: string;
  nickname: string;
  image: string | null;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}
