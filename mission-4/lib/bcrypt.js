import bcrypt from "bcrypt";

async function passwordHashing(password) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

async function validatePassword(password, userPassword) {
  return await bcrypt.compare(password, userPassword);
}

export { passwordHashing, validatePassword };
