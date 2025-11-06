import bcrypt from 'bcrypt';

async function passwordHashing(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

async function validatePassword(
  password: string,
  userPassword: string,
): Promise<boolean> {
  return await bcrypt.compare(password, userPassword);
}

export { passwordHashing, validatePassword };
