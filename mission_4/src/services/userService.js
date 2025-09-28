import * as userRepository from "../repository/userRepository.js";
import * as productRepository from "../repository/productRepository.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function createUser(user) {
  // 이미 가입된 이메일인지 검증
  const existedUser = await userRepository.findByEmail(user.email);

  if (existedUser) {
    const err = new Error("User already exists");
    err.statusCode = 422;
    err.data = { email: user.email };
    throw err;
  }

  const createdUser = await userRepository.createUser(user);
  const createdUserId = await userRepository.filterSensitiveUserData(
    createdUser
  ).id;

  return createdUserId;
}

export async function getUser({ email, password }) {
  const user = await userRepository.findByEmail(email);

  // If user is invalid
  if (!user) {
    const err = new Error("Unauthorized");
    err.statusCode = 401;
    throw err;
  }

  // Verifying password
  await verifyPassword(password, user.password);

  // Return without password
  return userRepository.filterSensitiveUserData(user);
}

export async function getUserById(userId) {
  const user = await userRepository.findById(userId);

  if (!user) {
    const err = new Error("User not found");
    err.statusCode = 404;
    throw err;
  }

  return userRepository.filterSensitiveUserData(user);
}

async function verifyPassword(inputPassword, password) {
  const isVerified = await bcrypt.compare(inputPassword, password);

  if (!isVerified) {
    const err = new Error("Password is wrong");
    err.statusCode = 401;
    throw err;
  }
}

export function createToken(user, token) {
  const payload = { userId: user.id };
  const options = { expiresIn: token === "refresh" ? "2w" : "1h" };

  return jwt.sign(payload, process.env.JWT_SECRET, options);
}

export async function refreshToken(userId, refreshToken) {
  const user = await userRepository.findById(userId);

  if (!user || user.refreshToken !== refreshToken) {
    const err = new Error("Unauthorized");
    err.statusCode = 404;
    throw err;
  }

  const accessToken = createToken(user);
  return accessToken;
}

export async function updateUserInfo(userId, toUpdate) {
  // 수정할 내용이 없다면 에러 처리
  if (Object.keys(toUpdate).length === 0) {
    const err = new Error("No data to update");
    err.statusCode = 400;
    throw err;
  }

  const updatedUser = await userRepository.updateUser(userId, toUpdate);

  return userRepository.filterSensitiveUserData(updatedUser);
}

export async function updateUserPassword(userId, newPassword) {
  const hashedPassword = await userRepository.hashPassword(newPassword);
  const user = await userRepository.updateUser(userId, {
    password: hashedPassword,
  });

  return userRepository.filterSensitiveUserData(user);
}

export async function getMyProducts(userId) {
  const products = await productRepository.getProductsByUser(userId);

  return products.Product;
}
