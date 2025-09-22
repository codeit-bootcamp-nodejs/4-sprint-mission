const accessTokenOption = {
  httpOnly: true,
  secure: false,
  maxAge: 1 * 60 * 60 * 1000, // 1hour
};

const refreshTokenOption = {
  httpOnly: true,
  secure: false,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

export { accessTokenOption, refreshTokenOption };
