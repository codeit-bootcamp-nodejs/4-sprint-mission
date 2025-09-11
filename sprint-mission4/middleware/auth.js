import bcrypt from 'bcrypt';

async function verifyPassword(inputPassword, password) {
  try {
    return await bcrypt.compare(inputPassword, password);
  } catch (error) {
    throw new Error('비밀번호가 일치하지 않습니다.');
  }
}

export default { verifyPassword };