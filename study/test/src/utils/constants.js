// file: constants.js
export const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};