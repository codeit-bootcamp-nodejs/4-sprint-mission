import bcrypt from "bcrypt";

async function hashing(hashword: string) {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedWord = await bcrypt.hash(hashword, salt);
    return hashedWord;
  } catch (err) {
    throw err;
  }
}

async function compareWords(word: string, hashedWord: string) {
  return await bcrypt.compare(word, hashedWord);
}

export { hashing, compareWords };
