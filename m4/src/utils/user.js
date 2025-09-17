export const omitPassword = (user) => {
    const { password, ...rest } = user;
    return rest;
};
