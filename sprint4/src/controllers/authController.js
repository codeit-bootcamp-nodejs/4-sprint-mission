//src/controllers/authController.js

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

// 회원가입 컨트롤러
exports.register = async (req, res) => {
  try {
    const { email, nickname, password } = req.body;

    // 필수 필드 검증
    if (!email || !nickname || !password) {
      return res.status(400).json({ message: '모든 필드를 입력해주세요.' });
    }

    // 이메일 중복 검사
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(409).json({ message: '이미 사용 중인 이메일입니다.' });
    }

    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(password, 10);

    // 사용자 생성
    const user = await prisma.user.create({
      data: {
        email,
        nickname,
        password: hashedPassword
      }
    });

    // 비밀번호 제외하고 반환
    const { password: _, ...userWithoutPassword } = user;

    res.status(201).json({
      message: '회원가입 성공',
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('회원가입 오류:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};

// 로그인 컨트롤러
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 필수 필드 검증
    if (!email || !password) {
      return res.status(400).json({ message: '이메일과 비밀번호를 입력해주세요.' });
    }

    // 사용자 조회
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(401).json({ message: '이메일 또는 비밀번호가 올바르지 않습니다.' });
    }

    // 비밀번호 확인
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: '이메일 또는 비밀번호가 올바르지 않습니다.' });
    }

    // JWT 토큰 생성
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // 비밀번호 제외하고 반환
    const { password: _, ...userWithoutPassword } = user;

    res.status(200).json({
      message: '로그인 성공',
      token,
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('로그인 오류:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};

// 내 정보 조회 컨트롤러
exports.getMyInfo = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        id: true,
        email: true,
        nickname: true,
        image: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error('사용자 정보 조회 오류:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};

// 내 정보 수정 컨트롤러
exports.updateMyInfo = async (req, res) => {
  try {
    const { nickname, image } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: req.userId },
      data: {
        ...(nickname && { nickname }),
        ...(image && { image })
      },
      select: {
        id: true,
        email: true,
        nickname: true,
        image: true,
        createdAt: true,
        updatedAt: true
      }
    });

    res.status(200).json({
      message: '사용자 정보가 성공적으로 수정되었습니다.',
      user: updatedUser
    });
  } catch (error) {
    console.error('사용자 정보 수정 오류:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};

// 비밀번호 변경 컨트롤러
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // 필수 필드 검증
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: '현재 비밀번호와 새 비밀번호를 모두 입력해주세요.' });
    }

    // 사용자 조회
    const user = await prisma.user.findUnique({
      where: { id: req.userId }
    });

    if (!user) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }

    // 현재 비밀번호 확인
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: '현재 비밀번호가 올바르지 않습니다.' });
    }

    // 새 비밀번호와 현재 비밀번호가 같은지 확인
    if (currentPassword === newPassword) {
      return res.status(400).json({ message: '새 비밀번호는 현재 비밀번호와 달라야 합니다.' });
    }

    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 비밀번호 업데이트
    await prisma.user.update({
      where: { id: req.userId },
      data: { password: hashedPassword }
    });

    res.status(200).json({ message: '비밀번호가 성공적으로 변경되었습니다.' });
  } catch (error) {
    console.error('비밀번호 변경 오류:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};

// 로그인 컨트롤러 수정 (리프레시 토큰 발급 추가)
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 필수 필드 검증
        if (!email || !password) {
            return res.status(400).json({ message: '이메일과 비밀번호를 입력해주세요.' });
        }

        // 사용자 조회
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return res.status(401).json({ message: '이메일 또는 비밀번호가 올바르지 않습니다.' });
        }

        // 비밀번호 확인
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: '이메일 또는 비밀번호가 올바르지 않습니다.' });
        }

        // 액세스 토큰 생성 (짧은 유효기간)
        const accessToken = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }  // 1시간으로 설정
        );

        // 리프레시 토큰 생성 (긴 유효기간)
        const refreshToken = jwt.sign(
            { id: user.id },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: '7d' }  // 7일로 설정
        );

        // 기존 리프레시 토큰이 있다면 삭제
        await prisma.refreshToken.deleteMany({
            where: { userId: user.id }
        });

        // 새 리프레시 토큰 저장
        await prisma.refreshToken.create({
            data: {
                token: refreshToken,
                userId: user.id
            }
        });

        // 비밀번호 제외하고 반환
        const { password: _, ...userWithoutPassword } = user;

        res.status(200).json({
            message: '로그인 성공',
            accessToken,
            refreshToken,
            user: userWithoutPassword
        });
    } catch (error) {
        console.error('로그인 오류:', error);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
};

// 토큰 갱신 컨트롤러
exports.refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({ message: '리프레시 토큰이 필요합니다.' });
        }

        // DB에서 리프레시 토큰 조회
        const savedToken = await prisma.refreshToken.findUnique({
            where: { token: refreshToken },
            include: { user: true }
        });

        if (!savedToken) {
            return res.status(401).json({ message: '유효하지 않은 리프레시 토큰입니다.' });
        }

        // 리프레시 토큰 검증
        try {
            const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

            // 토큰의 사용자 ID와 DB의 사용자 ID가 일치하는지 확인
            if (decoded.id !== savedToken.userId) {
                throw new Error('토큰 사용자 불일치');
            }

            // 새 액세스 토큰 발급
            const accessToken = jwt.sign(
                { id: savedToken.user.id, email: savedToken.user.email },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );

            res.status(200).json({
                accessToken,
                message: '토큰이 성공적으로 갱신되었습니다.'
            });
        } catch (error) {
            // 리프레시 토큰이 만료되었거나 유효하지 않은 경우
            await prisma.refreshToken.delete({
                where: { id: savedToken.id }
            });

            return res.status(401).json({ message: '만료되었거나 유효하지 않은 리프레시 토큰입니다.' });
        }
    } catch (error) {
        console.error('토큰 갱신 오류:', error);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
};

// 로그아웃 컨트롤러
exports.logout = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({ message: '리프레시 토큰이 필요합니다.' });
        }

        // DB에서 리프레시 토큰 삭제
        await prisma.refreshToken.deleteMany({
            where: { token: refreshToken }
        });

        res.status(200).json({ message: '로그아웃되었습니다.' });
    } catch (error) {
        console.error('로그아웃 오류:', error);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
};