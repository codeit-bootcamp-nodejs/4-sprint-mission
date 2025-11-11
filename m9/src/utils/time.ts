export const parseExpiresIn = (expiresInStr: string) => {
    const ONE_DAY_MS = 24 * 60 * 60 * 1000;
    const ONE_HOUR_MS = 60 * 60 * 1000;
    const ONE_MINUTE_MS = 60 * 1000;
    const ONE_SECOND_MS = 1000;

    const value = parseInt(expiresInStr, 10);
    if (expiresInStr.endsWith('d')) return value * ONE_DAY_MS;
    if (expiresInStr.endsWith('h')) return value * ONE_HOUR_MS;
    if (expiresInStr.endsWith('m')) return value * ONE_MINUTE_MS;
    if (expiresInStr.endsWith('s')) return value * ONE_SECOND_MS;
    return value;
};
