import User from '../types/User';

const userResponseDTO = (user: User) => {
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

export default userResponseDTO;
