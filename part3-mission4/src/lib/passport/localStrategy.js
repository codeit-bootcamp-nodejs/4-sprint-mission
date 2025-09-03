import LocalStrategy from 'passport-local';
import bcrypt from 'bcrypt';
import prisma from '../prismaClient.js';

// export const localStrategy = new LocalStrategy(async function (
//   username,
//   password,
//   done
// ) {
//   const user = await prisma.user.findUnique({ where: { username } });
//   if (!user) {
//     return done(null, false);
//   }

//   const isPasswordValid = await bcrypt.compare(password, user.password);
//   if (!isPasswordValid) {
//     return done(null, false);
//   }

//   done(null, user);
// });
export const localStrategy = new LocalStrategy(async function (
  username,
  password,
  done
) {
  console.log('LocalStrategy 호출:', { username, password }); // ① 로그인 요청 들어오는지 확인

  const user = await prisma.user.findUnique({ where: { username } });
  console.log('DB 조회 user:', user); // ② DB에서 유저가 제대로 조회되는지 확인

  if (!user) {
    console.log('유저 없음');
    return done(null, false);
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  console.log('비밀번호 비교 결과:', isPasswordValid); // ③ bcrypt 비교 결과 확인

  if (!isPasswordValid) {
    console.log('비밀번호 불일치');
    return done(null, false);
  }

  console.log('로그인 성공:', user); // ④ 로그인 성공 시 user 정보
  done(null, user);
});
