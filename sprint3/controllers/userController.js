import {
  findUser,
  findUserProduct,
  updatePassword,
  updateUser,
} from "../services/userService.js";

export const getUser = async (req, res, next) => {
  try {
    const user = await findUser(req.user.id);

    if (!user) {
      return res.status(404).json({ error: "유저를 찾을 수 없습니다." });
    }

    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

export const patchUser = async (req, res, next) => {
  try {
    const data = req.body;
    const user = await updateUser(req.user.id, data);

    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

export const patchPassword = async (req, res, next) => {
  try {
    const { password } = req.body;

    await updatePassword(req.user.id, password);

    res.status(200).json({ message: "비밀번호 변경 완료" });
  } catch (err) {
    next(err);
  }
};

export const getUserProduct = async (req, res, next) => {
  try {
    const userProduct = await findUserProduct(req.user.id);

    res.status(200).json(userProduct);
  } catch (err) {
    next(err);
  }
};
