interface User {
  id: number;
  email: string;
  password: string;
  nickname: string;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export default User;
