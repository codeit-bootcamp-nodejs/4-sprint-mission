import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export class UserService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  // 회원가입
  signUp = async (email, nickname, password) => {
    const existingUser = await this.userRepository.findUserByEmail(email);
    if (existingUser) {
      throw new Error('이미 사용 중인 이메일입니다.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await this.userRepository.createUser(
      email,
      nickname,
      hashedPassword,
    );

    // 보안을 위해 password 필드 제거 후 반환
    delete newUser.password;
    return newUser;
  };

  // 로그인
  signIn = async (email, password) => {
    const user = await this.userRepository.findUserByEmail(email);
    if (!user) {
      throw new Error('사용자를 찾을 수 없습니다.');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('비밀번호가 일치하지 않습니다.');
    }

    // Access Token 생성 (유효기간: 12시간)
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: '12h',
    });

    return token;
  };

  // 내 정보 조회
  getUserInfo = async (userId) => {
    const user = await this.userRepository.findUserById(userId);
    if (!user) {
      throw new Error('사용자를 찾을 수 없습니다.');
    }

    delete user.password;
    return user;
  };

  // 내 정보 수정
  updateUserInfo = async (userId, userInfoData) => {
    const { nickname, image } = userInfoData;
    const dataToUpdate = {};

    if (nickname) dataToUpdate.nickname = nickname;
    if (image) dataToUpdate.image = image;

    if (Object.keys(dataToUpdate).length === 0) {
      throw new Error('수정할 정보를 입력해주세요.');
    }

    const updatedUser = await this.userRepository.updateUser(
      userId,
      dataToUpdate,
    );
    delete updatedUser.password;
    return updatedUser;
  };
}
